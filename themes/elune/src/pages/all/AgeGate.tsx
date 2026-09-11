import React, { useEffect, useRef, useState } from 'react';

// Age gate — advisory only, client-side by design (design 8-2 §2, SPEC ADR #3).
export default function AgeGate() {
  const [show, setShow] = useState(false);
  const panel = useRef<HTMLDivElement>(null);

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

  // Focus stays inside the modal while it is open. Advisory gate, but the
  // contract still is a modal: focus in on open, Tab cycles the panel.
  useEffect(() => {
    if (!show) return;
    const focusables = () =>
      Array.from(
        panel.current?.querySelectorAll<HTMLElement>('button, [href], [tabindex]') ?? []
      );
    focusables()[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') return;
      if (event.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [show]);

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-4"
    >
      <div
        ref={panel}
        className="w-full max-w-lg rounded-lg border border-border bg-card p-6 md:p-8 text-card-foreground shadow-lg shadow-foreground/5"
      >
        <h2 id="age-gate-title" className="mb-4 text-2xl font-bold tracking-tight text-foreground">
          Are you 18 or older?
        </h2>
        <div className="mb-5 rounded border border-amber-300 bg-amber-50 p-3 text-xs text-amber-950 leading-relaxed">
          <strong className="text-amber-900 font-semibold block uppercase tracking-wider text-[0.75rem] mb-1">
            Research Chemical Notice
          </strong>
          Compounds offered by Elune Labs are supplied exclusively for <strong>in-vitro laboratory research and analytical evaluation</strong>. They are strictly not for human consumption, clinical application, or therapeutic use.
        </div>
        <p className="mb-6 text-sm text-muted-foreground leading-relaxed">
          By continuing you confirm that you are at least 18 years of age and that you will handle these materials as laboratory reference compounds only.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={enter}
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors duration-150 cursor-pointer"
          >
            I am 18 or older — Continue
          </button>
          <button
            type="button"
            onClick={leave}
            className="rounded-md border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-150 cursor-pointer"
          >
            Decline & Exit
          </button>
        </div>
        <p className="mt-5 text-xs text-muted-foreground">
          Saved in a client session cookie for 30 days.
        </p>
      </div>
    </div>
  );
}

export const layout = {
  areaId: 'body',
  sortOrder: 20
};
