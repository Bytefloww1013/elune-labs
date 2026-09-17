import React from 'react';

/**
 * The research-use-only notice, on every product page (DESIGN.md, Notices).
 *
 * A `--mist` panel at the control radius, body copy in ink at the micro step,
 * and a caption label inside the block — never floating above a heading. The
 * amber treatment of the superseded world is retired: no warm value survives,
 * so this notice uses tokens like every other surface.
 *
 * Copy is the shipped contract's, verbatim from
 * `docs/design/8-2-ui-compliance-payment.md` §1.4 for the supplying sentence and
 * from DESIGN.md's fixed-string list for the RUO line, which it requires to
 * render "in a notice on every product page". Nothing here is design-owned or
 * open to rewording.
 */
export default function RuoNotice() {
  return (
    <div className="ruo-notice mt-4 rounded-ctrl bg-mist p-4 text-micro">
      <span className="block uppercase text-caption font-medium">Laboratory Research Notice (RUO)</span>
      <p className="mt-1 font-medium">For research use only. Not for human consumption.</p>
      <p className="mt-1">
        This chemical compound is supplied strictly for in-vitro laboratory experimentation and
        analytical reference. Not for human, clinical, or veterinary administration.
      </p>
    </div>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 60
};
