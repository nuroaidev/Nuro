import type { Route } from "./+types/split";
import { Link } from "react-router";
import { SiteFooter, SiteHeader } from "../components/layout/site-chrome";
import { ShareSplit } from "../components/brand/share-split";
import { Reveal } from "../components/util/reveal";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Split — what a worker actually holds · Nuro AI" },
    {
      name: "description",
      content:
        "Type a secret. Split it. Each Nuro worker holds noise. Combine both shares and the prompt comes back.",
    },
    { property: "og:url", content: "https://nuroai.xyz/split" },
    { property: "og:title", content: "What a worker actually holds" },
    {
      property: "og:description",
      content:
        "One share is empty. Two shares reconstruct. Try it in the browser.",
    },
  ];
}

export default function SplitPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-black">
      <SiteHeader />
      <main className="page-shell relative pt-20 pb-28 md:pt-28">
        <Reveal>
          <p className="label-caps">Build</p>
          <h1 className="mt-5 text-[clamp(2.4rem,6vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
            What a worker
            <br />
            <span className="text-gradient">actually holds.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#8a8a8a]">
            Not a policy. A split. One share is uniformly random. Two shares
            are the prompt. Same fact as the paper — you can touch it.
          </p>
        </Reveal>
        <Reveal delay={80} variant="scale">
          <div className="card glass-panel mt-12 rounded-[2rem] p-6 md:mt-14 md:p-12">
            <ShareSplit />
          </div>
        </Reveal>
        <p className="mt-8 max-w-2xl text-[13px] leading-relaxed text-[#6f6f6f]">
          The measured gates share hidden states, not typed bytes. The
          invariant is the same: a single share carries no information.{" "}
          <Link to="/paper" className="text-[#7ED6FF] hover:text-white">
            The Paper
          </Link>
          {" · "}
          <Link to="/live" className="text-[#7ED6FF] hover:text-white">
            Live run
          </Link>
          .
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
