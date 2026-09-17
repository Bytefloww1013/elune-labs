import React from 'react';

/**
 * The announcement bar: a 38px `--mist` band carrying one compliance line and
 * one operational line, sentence case, no hype (DESIGN.md, Announcement Bar).
 *
 * It renders into the header's top area, which is inside the sticky header, so
 * the bar and the nav stay pinned together — the pair is the 112px the design
 * measures fragment targets against. It is never a countdown and never a
 * discount, and the RUO half is the same fixed string every other surface uses.
 */
export default function Announce() {
  return (
    <div className="announce">
      <div className="shell">
        <p>For research use only. Not for human consumption.</p>
        <p>Prices in USD · Guest checkout</p>
      </div>
    </div>
  );
}

export const layout = {
  areaId: 'headerTop',
  sortOrder: 10
};
