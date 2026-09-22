import { SwarmPipelineIllustration } from "../brand/swarm-pipeline";
import { LiquidPanel } from "../brand/liquid-glass";
import {
  BoundIllustration,
  OpenPathIllustration,
  SwarmNodesIllustration,
} from "../brand/privacy-illustrations";
import { Reveal } from "../util/reveal";

export function PrivateInferenceSection() {
  return (
    <section id="private" className="border-t border-line">
      <div className="page-shell pb-16 pt-10 md:pb-24 md:pt-14">
        {/* 01 - The problem */}
        <Reveal>
          <div id="problem" className="max-w-3xl scroll-mt-24">
            <p className="section-index">01 / The problem</p>
            <h2 className="mt-4 text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.06] tracking-[-0.03em]">
              Sharding solved size.{" "}
              <span className="text-mute">Not privacy.</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-mute">
              Split a model across strangers&apos; GPUs and every node still
              touches raw activations - enough to reconstruct pieces of a prompt.
            </p>
          </div>
        </Reveal>

        {/* 02 - How it leaks: the big liquid-glass explainer */}
        <Reveal delay={80} variant="scale">
          <LiquidPanel className="mt-16 md:mt-20">
            <div className="p-8 md:p-14">
              <div className="max-w-2xl">
                <p className="section-index">02 / How it leaks</p>
                <h3 className="mt-4 text-2xl font-semibold leading-snug tracking-[-0.02em] md:text-3xl">
                  A request crosses machines you don&apos;t control.
                </h3>
              </div>

              <div className="mt-10 md:mt-12">
                <SwarmPipelineIllustration />
              </div>

              <p className="mt-10 max-w-2xl text-[15px] leading-relaxed text-mute md:text-base">
                Every node handles real activation tensors. Nuro exists to
                quantify that exposure - and close it.
              </p>
            </div>
          </LiquidPanel>
        </Reveal>

        <Reveal delay={60} variant="left">
          <article className="card glass-panel mt-6 rounded-[1.75rem] border-[rgba(126,214,255,0.18)] p-6 md:p-10">
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div>
                <p className="section-index text-accent">The measured one</p>
                <h3 className="mt-3 font-sans text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
                  Private
                </h3>
                <p className="mt-4 max-w-md text-base leading-relaxed text-mute">
                  A raw hop still reconstructs the prompt. One MPC share is
                  noise. The bound costs 2.42&nbsp;MiB per token. The figure is
                  in{" "}
                  <a href="/paper" className="text-accent hover:text-[var(--fg)]">
                    the Paper
                  </a>
                  .
                </p>
              </div>
              <BoundIllustration />
            </div>
          </article>
        </Reveal>

        <div className="mt-6 grid gap-4 md:grid-cols-2 md:gap-5">
          <Reveal delay={60} variant="left">
            <article className="card glass-panel flex h-full flex-col rounded-[1.75rem] p-6 md:p-8">
              <SwarmNodesIllustration />
              <h3 className="mt-5 font-sans text-xl font-semibold tracking-[-0.03em]">
                Decentralized
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-mute">
                Anyone&apos;s GPU, pooled into swarms. No datacenter.
              </p>
            </article>
          </Reveal>
          <Reveal delay={120} variant="right">
            <article className="card glass-panel flex h-full flex-col rounded-[1.75rem] p-6 md:p-8">
              <OpenPathIllustration />
              <h3 className="mt-5 font-sans text-xl font-semibold tracking-[-0.03em]">
                Uncensored
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-mute">
                Any model. No content-policy layer in the way.
              </p>
            </article>
          </Reveal>
        </div>

        {/* Close */}
        <Reveal variant="fade">
          <p className="mt-14 max-w-2xl text-lg leading-relaxed text-mute md:mt-16 md:text-xl">
            Privacy isn&apos;t a feature to bolt on later. It&apos;s the open
            problem - and the one{" "}
            <span className="text-[var(--fg)]">Nuro exists to close.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
