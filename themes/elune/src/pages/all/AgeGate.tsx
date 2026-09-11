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
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-md p-4"
    >
      <div className="w-full max-w-lg rounded-lg border border-border/80 bg-card p-6 md:p-8 text-card-foreground shadow-2xl shadow-black/80">
        <div className="flex items-center gap-2 text-primary text-xs font-mono uppercase tracking-widest mb-3">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span>Access Verification Protocol</span>
        </div>
        <h2 id="age-gate-title" className="mb-4 text-2xl font-bold tracking-tight text-foreground">
          Are you 18 or older?
        </h2>
        <div className="mb-5 rounded border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200/90 leading-relaxed">
          <strong className="text-amber-300 font-semibold block uppercase tracking-wider text-[11px] mb-1">
            Research Chemical Notice
          </strong>
          Compounds offered by Elune Labs are synthesized exclusively for <strong>in-vitro laboratory research and analytical evaluation</strong>. They are strictly not for human consumption, clinical application, or therapeutic use.
        </div>
        <p className="mb-6 text-sm text-muted-foreground leading-relaxed">
          By proceeding, you attest under penalty of perjury that you are at least 18 years of age and possess qualified laboratory handling expertise.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={enter}
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_0_15px_rgba(0,240,255,0.35)] hover:bg-cyan-400 hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] transition-all duration-150 cursor-pointer"
          >
            I am 18 or older — Enter Lab
          </button>
          <button
            type="button"
            onClick={leave}
            className="rounded-md border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-150 cursor-pointer"
          >
            Decline & Exit
          </button>
        </div>
        <p className="mt-5 text-xs text-muted-foreground/70">
          Advisory verification status saved in client session cookie (30 days).
        </p>
      </div>
    </div>
  );
}

export const layout = {
  areaId: 'body',
  sortOrder: 20
};
