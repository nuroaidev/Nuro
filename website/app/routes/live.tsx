import type { Route } from "./+types/live";
import { SiteFooter, SiteHeader } from "../components/layout/site-chrome";
import { LiveInference } from "../components/brand/live-inference";
import { Reveal } from "../components/util/reveal";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Live run — Private inference · Nuro AI" },
    {
      name: "description",
      content:
        "Watch a simulated private inference run: a prompt crosses four shards, recovery collapses to chance, a receipt is issued.",
    },
    { property: "og:url", content: "https://nuroai.xyz/live" },
    { property: "og:title", content: "Watch a private run" },
    {
      property: "og:description",
      content:
        "A live simulation of Nuro private inference — measured recovery, then a receipt.",
    },
  ];
}

export default function LivePage() {
  return (
    <div className="page-root">
      <SiteHeader />
      <main className="page-shell relative pt-20 pb-28 md:pt-28">
        <Reveal>
          <p className="label-caps">Exciting update</p>
          <h1 className="mt-5 text-[clamp(2.4rem,6vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
            Private inference,
            <br />
            <span className="text-gradient">live.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-mute">
            A prompt enters machines you do not control. Watch the
            reconstruction number fall. Then read the receipt. Or{" "}
            <a href="/split" className="text-accent hover:text-[var(--fg)]">
              split a secret yourself
            </a>
            .
          </p>
        </Reveal>
        <Reveal delay={80} variant="scale">
          <div className="card glass-panel mt-12 rounded-[2rem] p-6 md:mt-14 md:p-12">
            <LiveInference />
          </div>
        </Reveal>
      </main>
      <SiteFooter />
    </div>
  );
}
