import React, { useEffect, useState } from 'react';

// Age gate — advisory only, client-side by design (design 8-2 §2, SPEC ADR #3).
export default function AgeGate() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Belt-and-braces: themes are frontStore-only, /admin is theme-immune.
    if (window.location.pathname.startsWith('/admin')) return;
    const accepted = document.cookie
      .split(';')
      .some((c) => c.trim().startsWith('elune_age_ok='));
    if (accepted) return;
    setShow(true);
    document.body.classList.add('elune-lock');
  }, []);

  if (!show) return null;

  const enter = () => {
    document.cookie = 'elune_age_ok=1; path=/; max-age=2592000; SameSite=Lax';
    document.body.classList.remove('elune-lock');
    setShow(false);
  };

  const leave = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 p-4"
    >
      <div className="w-full max-w-lg rounded-lg border border-border bg-card p-8 text-card-foreground shadow-xl">
        <h2 id="age-gate-title" className="mb-4 text-2xl font-bold">
          Are you 18 or older?
        </h2>
        <p className="mb-6 leading-relaxed">
          Elune Labs products are sold as{' '}
          <strong>research chemicals for laboratory research use only</strong>.
          They are not food, dietary supplements, or drugs, and are{' '}
          <strong>not intended for human consumption</strong>. By entering, you
          confirm that you are at least 18 years old and accept our terms of
          sale.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={enter}
            className="rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground hover:bg-accent hover:text-accent-foreground"
          >
            I am 18 or older — Enter
          </button>
          <button
            type="button"
            onClick={leave}
            className="rounded-md border border-border px-4 py-2 font-semibold hover:bg-muted"
          >
            Cancel — Leave
          </button>
        </div>
        <p className="mt-6 text-sm italic text-muted-foreground">
          This notice is advisory and stored only in a browser cookie for 30
          days.
        </p>
      </div>
    </div>
  );
}

export const layout = {
  areaId: 'body',
  sortOrder: 20
};
