import type { ReactNode } from "react";
import type { Route } from "./+types/paper";
import { SiteFooter, SiteHeader } from "../components/layout/site-chrome";
import { Reveal } from "../components/util/reveal";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Paper — Private inference, actually proven · Nuro AI" },
    {
      name: "description",
      content:
        "Nuro's paper: treat privacy like correctness — a measured, adversarial, per-run property with a receipt a skeptic can check.",
    },
    { property: "og:url", content: "https://nuroai.xyz/paper" },
    { property: "og:title", content: "Private inference, actually proven" },
    {
      property: "og:description",
      content:
        "A reconstruction adversary, leakage reduced by construction, and a privacy receipt. The Nuro paper.",
    },
  ];
}

function Section({
  id,
  index,
  title,
  children,
}: {
  id: string;
  index: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <p className="section-index">{index}</p>
      <h2 className="mt-4 text-[clamp(1.75rem,3.4vw,2.35rem)] font-semibold leading-tight tracking-[-0.02em]">
        {title}
      </h2>
      <div className="paper-body mt-6 space-y-5 text-[16px] leading-[1.75] text-[#a3a3a3] md:text-[17px]">
        {children}
      </div>
    </section>
  );
}

function Pull({ children }: { children: ReactNode }) {
  return (
    <blockquote className="border-l border-[#7ED6FF]/40 pl-5 text-[17px] leading-relaxed text-[#d4d4d4] md:text-lg">
      {children}
    </blockquote>
  );
}

function Result({
  label,
  before,
  after,
  note,
}: {
  label: string;
  before: string;
  after: string;
  note: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-black/40 p-5">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#5c5c5c]">
        {label}
      </p>
      <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1 font-mono text-sm">
        <span className="text-[#8a8a8a]">{before}</span>
        <span className="text-[#5c5c5c]">→</span>
        <span className="text-[#5ce6a5]">{after}</span>
      </div>
      <p className="mt-3 text-[14px] leading-relaxed text-[#8a8a8a]">{note}</p>
    </div>
  );
}

export default function PaperPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-black">
      <SiteHeader />
      <main className="page-shell relative pt-20 pb-28 md:pt-28">
        <article className="mx-auto max-w-3xl">
          <Reveal>
            <p className="label-caps">The paper</p>
            <h1 className="mt-5 text-[clamp(2.4rem,6vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
              Private inference,
              <br />
              <span className="text-gradient">actually proven.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#8a8a8a] md:text-xl">
              Treat privacy the way prior work treated correctness — as a
              measured, adversarial, per-run property with a number a skeptic
              can re-check. Not a promise.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-[13px] text-[#6f6f6f]">
              <span>Nuro AI</span>
              <span>Theoretical model + measured gates</span>
              <span>2026</span>
            </div>
          </Reveal>

          <div className="mt-16 space-y-16 md:mt-20 md:space-y-20">
            <Reveal>
              <Section id="claim" index="01 / Abstract" title="The claim">
                <Pull>
                  A user&apos;s prompt cannot be recovered by the nodes that
                  serve their request — and we can prove it, per run, to a
                  skeptic.
                </Pull>
                <p>
                  Prior proven work (Shard) established that a model too big for
                  any single card can be served across untrusted machines over
                  the open internet, fast and <em className="text-[#d4d4d4]">correct</em>,
                  with a receipt anyone can check. It also established the
                  counter-fact that motivates us: a node running your layer{" "}
                  <strong className="font-medium text-white">
                    decrypts to compute
                  </strong>
                  , and from the activations it sees it can reconstruct a large
                  fraction of your tokens. Sealing the wire does not touch this.
                </p>
                <p>
                  Our model is one move applied rigorously: treat privacy as a
                  measured property with a reproducible number. Shard proved
                  sharded inference can be correct. Nuro&apos;s job is to turn
                  the remaining leak into a number, drive that number down by
                  construction, and put it in a receipt.
                </p>
              </Section>
            </Reveal>

            <Reveal>
              <Section
                id="adversary"
                index="02 / Pillar I"
                title="A concrete adversary"
              >
                <p>
                  Privacy is meaningless without an attacker. We define a
                  first-class reconstruction adversary:
                </p>
                <Pull>
                  Given exactly the activations a given node processes for a
                  request — its block&apos;s inputs and outputs — how much of
                  the user&apos;s input can it recover?
                </Pull>
                <p>
                  The load-bearing metric is the{" "}
                  <strong className="font-medium text-white">
                    fraction of input tokens reconstructed
                  </strong>
                  , with a distributional variant (top-k recovery) for partial
                  leaks. Prior work&apos;s baseline is roughly 35–59%. That is
                  the number we exist to drive down.
                </p>
                <p>
                  We measure two threat tiers: honest-but-curious (logs what it
                  legitimately sees) and malicious (runs the best available
                  inversion). Both are measured. We never assume good faith. A
                  defense is only real once it lowers this attacker&apos;s
                  score.
                </p>
              </Section>
            </Reveal>

            <Reveal>
              <Section
                id="defenses"
                index="03 / Pillar II"
                title="Reduce leakage by construction"
              >
                <p>
                  Layered defenses, each independently measured against the
                  adversary:
                </p>
                <p>
                  <strong className="font-medium text-white">
                    Boundary pinning.
                  </strong>{" "}
                  Embedding and final layers carry the most recoverable signal.
                  Keep those blocks on trusted or staked nodes; let untrusted
                  volunteers hold only middle blocks. This changes the shape of
                  what any single untrusted node can see — it does not, by
                  itself, bound a middle node. Residual-stream embeddings
                  persist at every depth.
                </p>
                <p>
                  <strong className="font-medium text-white">
                    Activation obfuscation
                  </strong>{" "}
                  (proprietary weights only). A per-request invertible
                  transform — orthogonal rotation or signed hidden-dimension
                  permutation — is applied by the trusted head and inverted
                  downstream. The untrusted node processes scrambled
                  activations. Measurement shows this is lossless-correct and
                  drops recovery to chance. Measurement also shows it fails on
                  open weights: a node holding public{" "}
                  <span className="font-mono text-[#c9c9c9]">W</span> and
                  conjugated{" "}
                  <span className="font-mono text-[#c9c9c9]">W′ = W·R</span>{" "}
                  recovers the secret basis in closed form (
                  <span className="font-mono text-[#c9c9c9]">R = W⁻¹·W′</span>
                  ). Recovery returns to ~100%. This lever is real privacy only
                  when the serving node does not have the base weights.
                </p>
                <p>
                  <strong className="font-medium text-white">
                    Secret-sharing MPC
                  </strong>{" "}
                  (open-weight privacy — the core mechanism). Split every
                  activation additively across two non-colluding nodes{" "}
                  <span className="font-mono text-[#c9c9c9]">x = s₀ + s₁</span>.
                  A single share is uniformly random, so its leakage is zero by
                  construction — information-theoretic, not an assumption an
                  attacker can undo. Public-weight linear layers are free under
                  sharing; only non-linearities interact. One share-holder
                  recovers the prompt at chance even holding the public weights
                  and replaying the basis-recovery attack. The honest cost:
                  compute is replicated, output is correct within tolerance, and
                  communication rounds are slow over a wide-area network.
                </p>
                <p>
                  <strong className="font-medium text-white">
                    Edge containment.
                  </strong>{" "}
                  Raw tokens never leave a trusted boundary. Embedding and
                  detokenization stay on the trusted head, so only hidden
                  states — never token ids — cross the wire.
                </p>
                <p>
                  <strong className="font-medium text-white">
                    Trusted routing
                  </strong>{" "}
                  is a per-request option: trade some decentralization for a
                  stronger bound on demand.
                </p>
                <p>
                  Ordering: pin the boundaries, contain the edge, disclose
                  honestly. Offer trusted routing. Use obfuscation only for
                  proprietary-weight serving. For open weights, secret-sharing
                  MPC is the mechanism that earns the claim.
                </p>
              </Section>
            </Reveal>

            <Reveal>
              <Section
                id="receipt"
                index="04 / Pillar III"
                title="The privacy receipt"
              >
                <p>
                  The artifact that makes “proven” literal. Every run can emit
                  a privacy receipt recording the layer-to-node assignment,
                  each node&apos;s trust tier, the transform class on each
                  edge, and — the load-bearing field — the measured
                  reconstruction score, obtained by running the adversary
                  against the activations each node saw.
                </p>
                <p>
                  A skeptic re-runs the adversary on the recorded activations
                  and confirms the score sits under the claimed threshold.
                  Correctness receipts prove the output was right. Privacy
                  receipts prove the input stayed hidden. Same discipline,
                  different property.
                </p>
                <pre className="overflow-x-auto rounded-2xl border border-white/[0.06] bg-black/50 p-5 font-mono text-[12px] leading-relaxed text-[#c9c9c9] md:text-[13px]">
{`{
  "run_id": "...",
  "utc": "...",
  "model": "...",
  "nodes": [
    {
      "role": "head | stage | tail",
      "layer_range": [a, b],
      "trust_tier": "operator | staked | volunteer"
    }
  ],
  "defenses": {
    "boundary_pinning": true,
    "edge_containment": true,
    "activation_transform": "orthogonal-rotation@per-request"
  },
  "privacy_eval": {
    "adversary": "gradient-inversion + token-classifier",
    "worst_untrusted_recovery": 0.06,
    "threshold": 0.10,
    "pass": true
  }
}`}
                </pre>
              </Section>
            </Reveal>

            <Reveal>
              <Section id="results" index="05 / Results" title="What the gates measure">
                <p>
                  The following are measured on controlled transformers and, for
                  the open-weight case, on a real pretrained model
                  (Qwen2.5-0.5B). They prove the mechanism. They are not a
                  blanket guarantee for every production request.
                </p>
                <div className="space-y-3">
                  <Result
                    label="Gate A — correctness"
                    before="whole model"
                    after="bit-identical split run"
                    note="Two processes, sealed wire, no node holds the whole model. Logits max |Δ| = 0. Greedy tokens identical."
                  />
                  <Result
                    label="Gate D — obfuscation (proprietary weights)"
                    before="100% prompt recovery"
                    after="0.3% (chance ≈ 0.2%)"
                    note="Output stays token-identical. The untrusted node never learns the secret basis — only if it does not hold the base weights."
                  />
                  <Result
                    label="Gate D audit — open weights"
                    before="0.3% while obfuscated"
                    after="~100% after R = W⁻¹·W′"
                    note="On an open model the node has both W and W′. The secret basis is recovered in closed form. Obfuscation is not enough here."
                  />
                  <Result
                    label="Gate E — secret-sharing MPC (open weights)"
                    before="100% from the true residual"
                    after="0.2% from one share (chance)"
                    note="Basis-recovery replay also stays at chance. Collusion of both shares returns ~99%. Privacy lives in non-collusion. Output agrees within tolerance, not bit-identity."
                  />
                  <Result
                    label="Gate E — Qwen2.5-0.5B"
                    before="100% on raw activations"
                    after="0.000% from one MPC share"
                    note="Information-theoretic per share, independent of how the activation was produced. Holds at embedding and mid-depth."
                  />
                </div>
              </Section>
            </Reveal>

            <Reveal>
              <Section
                id="honesty"
                index="06 / Discipline"
                title="The honesty rule"
              >
                <Pull>
                  “Private” earns its word phase by phase, never on day one.
                </Pull>
                <p>
                  We publish the reconstruction number even while it is bad, and
                  show it falling. A receipt proves a specific run was private
                  to a measured degree. It is not a blanket privacy guarantee,
                  and we never present it as one. Over-claiming privacy is the
                  one failure mode that would make the whole thesis worthless.
                </p>
              </Section>
            </Reveal>

            <Reveal>
              <Section
                id="network"
                index="07 / The network"
                title="How this maps onto Nuro"
              >
                <p>
                  A stage node is a worker holding a contiguous block of
                  layers. The orchestrator assembles the pipeline, fits blocks
                  to each worker&apos;s memory, and — new for this thesis —
                  enforces trust-tier placement so boundary layers land on
                  trusted nodes and the receipt&apos;s assumptions actually
                  hold.
                </p>
                <p>
                  The live network at nuroai.xyz is the product built on this
                  model: contributed GPUs, an OpenAI-compatible API, and a
                  public data board. Privacy is not bolted on later. It is the
                  open problem this paper exists to close.
                </p>
                <p>
                  <a href="/earn" className="text-[#7ED6FF] hover:text-white">
                    Contribute compute
                  </a>
                  <span className="text-[#5c5c5c]"> · </span>
                  <a
                    href="https://docs.nuroai.xyz"
                    className="text-[#7ED6FF] hover:text-white"
                  >
                    Read the docs
                  </a>
                  <span className="text-[#5c5c5c]"> · </span>
                  <a
                    href="https://data.nuroai.xyz"
                    className="text-[#7ED6FF] hover:text-white"
                  >
                    Live data
                  </a>
                </p>
              </Section>
            </Reveal>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
