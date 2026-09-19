import type { Route } from "./+types/quickstart";
import { DocsLayout } from "../components/layout/docs-shell";
import { DocHeader, Callout, CodeBlock } from "../components/docs/primitives";
import type { TocItem } from "../components/util/toc";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Quickstart - Nuro Docs" },
    {
      name: "description",
      content:
        "Call the Nuro inference API, read the Paper, or contribute a GPU to the swarm.",
    },
  ];
}

const toc: TocItem[] = [
  { id: "call", text: "Call the API", depth: 2 },
  { id: "proofs", text: "The paper", depth: 2 },
  { id: "contribute", text: "Contribute a GPU", depth: 2 },
  { id: "stake", text: "Stake $NURO", depth: 2 },
];

export default function Quickstart() {
  return (
    <DocsLayout toc={toc}>
      <DocHeader
        eyebrow="Getting started"
        title="Quickstart"
        lead="Three ways in: use the network, verify the claims yourself, or contribute compute and earn."
      />

      <div className="prose-docs">
        <h2 id="call">Call the API</h2>
        <p>
          The inference endpoint is OpenAI-compatible, so most existing SDKs and
          tools work by changing the base URL. Prompts are billed in tokens and
          are not attached to a profile.
        </p>
        <CodeBlock>{`curl https://api.nuroai.xyz/v1/chat/completions \\
  -H "Authorization: Bearer $NURO_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "nuro-max-27b",
    "messages": [{ "role": "user", "content": "Explain private inference." }]
  }'`}</CodeBlock>
        <Callout tone="info" title="Models">
          Native GPU workers advertise larger models (for example{" "}
          <code>nuro-max-27b</code>); in-browser WebGPU workers advertise
          lighter ones (for example <code>nuro-browser-8b</code>). Availability
          depends on who is online in the swarm.
        </Callout>

        <h2 id="proofs">The paper</h2>
        <p>
          The privacy and correctness claims are not asks for trust. The full
          write-up — adversary, defenses, receipt, and measured gates — is the
          Paper on the site.
        </p>
        <p>
          <a href="https://nuroai.xyz/paper">nuroai.xyz/paper</a>
        </p>
        <Callout tone="success" title="What the gates show">
          Gate A: the split run is bit-identical to the whole model. Gate D:
          obfuscation drops recovery to chance on proprietary weights, and
          fails on open weights. Gate E: one MPC share recovers the prompt at
          chance even with public weights.
        </Callout>

        <h2 id="contribute">Contribute a GPU</h2>
        <p>
          A worker is a small client that connects to the orchestrator over a
          WebSocket and serves inference jobs. There are two ways to run one:
        </p>
        <ul>
          <li>
            <strong>Native.</strong> Point the worker at a local Ollama install
            with a capable model. Best throughput, best earnings.
          </li>
          <li>
            <strong>Browser.</strong> Open the <code>/earn</code> page on a
            WebGPU-capable browser and it becomes a worker with zero install.
          </li>
        </ul>
        <p>
          See <a href="/workers">Workers and earning</a> for setup, model
          classes, and how payouts work.
        </p>

        <h2 id="stake">Stake $NURO</h2>
        <p>
          If you would rather back the network than run it, stake $NURO from
          self-custody and earn a share of real network revenue. Only your
          wallet can unstake or claim. See{" "}
          <a href="/economics">Staking and treasury</a>.
        </p>
      </div>
    </DocsLayout>
  );
}
