import React from 'react';

const Elune: React.FC = () => {
  return (
    <section className="relative overflow-hidden py-10 md:py-16">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="page-width relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>High-Purity Bio-Intelligence Reference Compounds</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4 leading-tight">
            PRECISION SYNTHESIS FOR <br className="hidden md:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-300 to-accent">
              BIOHACKER RESEARCH
            </span>
          </h1>

          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8">
            Analytical-grade peptides, SARMs, and nootropic compounds verified by HPLC and mass spectrometry. Packaged in sterile borosilicate vials for laboratory research.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="/peptides"
              className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-primary text-primary-foreground font-semibold text-sm shadow-[0_0_20px_rgba(0,240,255,0.35)] hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all duration-200 cursor-pointer no-underline"
            >
              Explore Peptides Catalog
            </a>
            <a
              href="/nootropics"
              className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-border bg-card/60 backdrop-blur-sm text-foreground hover:bg-card hover:border-muted-foreground/40 font-medium text-sm transition-all duration-150 cursor-pointer no-underline"
            >
              View Nootropics
            </a>
          </div>
        </div>

        {/* Category Tri-Accent Showcase Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Peptides Card */}
          <a
            href="/peptides"
            className="group block p-6 rounded-lg border border-border/80 bg-card hover:border-cyan-500/60 hover:shadow-[0_0_25px_-5px_rgba(0,240,255,0.25)] transition-all duration-200 no-underline"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-cyan-400">
                Category 01
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00F0FF]" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-cyan-400 transition-colors">
              Peptides
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              Lyophilized peptide vials (BPC-157, TB-500, CJC-1295, Ipamorelin) with pure crystalline cakes.
            </p>
            <div className="text-xs font-mono text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Browse Peptides &rarr;
            </div>
          </a>

          {/* SARMs Card */}
          <a
            href="/sarms"
            className="group block p-6 rounded-lg border border-border/80 bg-card hover:border-amber-500/60 hover:shadow-[0_0_25px_-5px_rgba(255,179,0,0.25)] transition-all duration-200 no-underline"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-amber-400">
                Category 02
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#FFB300]" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-amber-400 transition-colors">
              SARMs
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              Selective androgen receptor modulators (RAD-140, Ostarine, LGD-4033, Cardarine, MK-677).
            </p>
            <div className="text-xs font-mono text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Browse SARMs &rarr;
            </div>
          </a>

          {/* Nootropics Card */}
          <a
            href="/nootropics"
            className="group block p-6 rounded-lg border border-border/80 bg-card hover:border-emerald-500/60 hover:shadow-[0_0_25px_-5px_rgba(0,255,157,0.25)] transition-all duration-200 no-underline"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-emerald-400">
                Category 03
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#00FF9D]" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-emerald-400 transition-colors">
              Nootropics
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              High-affinity cognitive substrates (Phenylpiracetam, Alpha-GPC, Citicoline, L-Theanine).
            </p>
            <div className="text-xs font-mono text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Browse Nootropics &rarr;
            </div>
          </a>
        </div>

        {/* Quality & Trust Bar */}
        <div className="rounded-lg border border-border/60 bg-card/40 p-4 md:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg md:text-xl font-bold font-mono text-cyan-400">≥99.2%</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">HPLC Purity Tested</div>
          </div>
          <div>
            <div className="text-lg md:text-xl font-bold font-mono text-foreground">Borosilicate</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Type I Sealed Vials</div>
          </div>
          <div>
            <div className="text-lg md:text-xl font-bold font-mono text-emerald-400">BTC · USDT · ETH</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Crypto on Delivery</div>
          </div>
          <div>
            <div className="text-lg md:text-xl font-bold font-mono text-amber-400">RUO Certified</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Research Use Only</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const layout = {
  areaId: 'content',
  sortOrder: 10
};

export default Elune;
