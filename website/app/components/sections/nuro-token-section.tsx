import { Reveal } from "../util/reveal";
import { ContractAddress } from "../layout/site-chrome";
import { NURO_DEX_URL } from "../../lib/token";

const tokenPillars = [
  {
    number: "01",
    anchorId: "token-metering",
    title: "Metered, not monitored",
    line: "Tokens are the billing unit. No prompt history, no profiles.",
  },
  {
    number: "02",
    anchorId: "token-treasury",
    title: "Treasury funds privacy",
    line: "30% of every settlement underwrites the research that proves it.",
  },
];

export function NuroTokenSection() {
  return (
    <section id="token" className="border-t border-line">
      <div className="page-shell section-gap">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="label-caps">Private inference economy</p>
            <h2 className="mt-5 text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-tight tracking-[-0.02em]">
              The <span className="text-gradient">$NURO</span> token
            </h2>
            <p className="mt-5 text-base leading-relaxed text-mute md:text-lg">
              What crosses the chain is metering. What never leaves the job is
              your prompt.
            </p>
            <div className="mt-6 flex justify-center">
              <ContractAddress />
            </div>
          </div>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-3xl gap-5 md:grid-cols-2">
          {tokenPillars.map((pillar, i) => (
            <Reveal
              key={pillar.number}
              delay={i * 60}
              variant="scale"
              className="h-full"
            >
              <article
                id={pillar.anchorId}
                className="card glass-panel flex h-full flex-col rounded-[1.75rem] p-8 scroll-mt-24"
              >
                <span className="text-4xl font-medium tracking-tight text-[var(--fg)]/15">
                  {pillar.number}
                </span>
                <h3 className="mt-6 text-lg font-semibold tracking-[-0.02em] md:text-xl">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-mute">
                  {pillar.line}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal variant="fade">
          <div className="mx-auto mt-12 flex flex-col items-center gap-4">
            <a
              href={NURO_DEX_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-primary px-8"
            >
              Dex
            </a>
            <a
              href="https://docs.nuroai.xyz/token"
              className="inline-flex items-center gap-2 text-sm text-accent transition-colors duration-300 hover:text-[var(--fg)]"
            >
              Learn more about $NURO
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
