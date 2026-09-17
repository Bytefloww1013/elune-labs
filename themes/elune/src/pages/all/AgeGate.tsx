import React, { useEffect, useRef, useState } from 'react';

/**
 * Age gate — advisory only, client-side by design (design 8-2 §2, SPEC ADR #3).
 *
 * The behaviour is the shipped contract and is unchanged: a 30-day cookie, focus
 * moved into the panel and trapped there, body scroll locked with `.elune-lock`,
 * and a refusal that leaves the site. What changed is the world it renders in —
 * the sheet is now `--snow` on `--night` ink with a hairline and the system's one
 * light-side shadow, the notice is a `--mist` panel like every other notice block
 * (the old amber carve-out is retired), and the two controls are one compact
 * filled pill plus a plain text link, so the region keeps a single filled pill.
 *
 * Copy is normative and comes from docs/design/8-2-ui-compliance-payment.md §2.3
 * verbatim: a visual restyle does not invent, shorten or rewrite compliance copy.
 * Declining is an anchor rather than a scripted redirect — same destination, and
 * it works before hydration.
 */
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

  return (
    <div className="age-gate" role="dialog" aria-modal="true" aria-labelledby="age-gate-title">
      <div className="age-gate__sheet" ref={panel}>
        <h2 id="age-gate-title" className="h3">
          Are you 18 or older?
        </h2>

        <div className="age-gate__notice">
          <strong className="age-gate__notice-label">Research Chemical Notice</strong>
          Elune Labs products are sold as{' '}
          <strong>research chemicals for laboratory research use only</strong>. They are not food,
          dietary supplements, or drugs, and are{' '}
          <strong>not intended for human consumption</strong>.
        </div>

        <p className="age-gate__confirm">
          By entering, you confirm that you are at least 18 years old and accept our terms of sale.
        </p>

        <div className="age-gate__actions">
          <button type="button" className="btn btn--sm" onClick={enter}>
            I am 18 or older — Enter
          </button>
          <a className="tlink" href="https://www.google.com">
            Cancel — Leave
          </a>
        </div>

        <p className="age-gate__foot">
          This notice is advisory and stored only in a browser cookie for 30 days.
        </p>
      </div>
    </div>
  );
}

export const layout = {
  areaId: 'body',
  sortOrder: 20
};