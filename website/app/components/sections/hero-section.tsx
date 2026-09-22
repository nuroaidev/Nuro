import { HeroVisual } from "../brand/hero-visual";

export function HeroSection() {
  return (
    <section className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden">
      <HeroVisual />
      <div className="page-shell relative z-10 w-full py-24 text-center">
        <p
          className="load-rise label-caps"
          style={{ animationDelay: "0.05s" }}
        >
          Private inference network
        </p>
        <h1
          className="hero-title load-rise mx-auto mt-6 font-semibold"
          style={{ animationDelay: "0.12s" }}
        >
          <span className="hero-title-line">The model is public.</span>
          <span className="hero-title-line">
            The prompt is <span className="text-gradient">not.</span>
          </span>
        </h1>
        <p
          className="load-rise mx-auto mt-8 max-w-xl text-lg leading-relaxed text-mute md:text-xl"
          style={{ animationDelay: "0.2s" }}
        >
          Uncensored and decentralized — the first network built to prove an
          untrusted node cannot recover what you typed.
        </p>
        <div
          className="load-rise mt-10 flex flex-wrap justify-center gap-4"
          style={{ animationDelay: "0.28s" }}
        >
          <a href="/paper" className="btn-primary">
            Read the paper
          </a>
          <a href="#products" className="btn-secondary">
            Use the network
          </a>
        </div>
        <p
          className="load-fade mt-16 font-mono text-[11px] uppercase tracking-[0.22em] text-mute"
          style={{ animationDelay: "0.55s" }}
        >
          Share lattice · Game of Life
        </p>
      </div>
    </section>
  );
}
