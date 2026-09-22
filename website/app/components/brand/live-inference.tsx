import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const SAMPLE_RUNS = [
  {
    prompt: "Who sees my prompt on a sharded network?",
    output:
      "The node that runs a layer decrypts the activations it processes. Without a defense, that is enough to reconstruct a large fraction of your tokens. Nuro measures that recovery, drives it down, and writes the number on a receipt.",
  },
  {
    prompt: "Explain private inference in one sentence.",
    output:
      "A request is split across machines you do not control — and we can prove, per run, that those machines cannot recover the prompt.",
  },
  {
    prompt: "Prove the output is correct and the input stayed hidden.",
    output:
      "Correctness: the split run is bit-identical to the whole model. Privacy: one MPC share recovers the prompt at chance. Both scores go on the receipt.",
  },
];

const NODES = [
  { id: "entry", label: "Entry", layers: "0–15", trust: "operator", raw: 100 },
  { id: "n2", label: "Node 2", layers: "16–31", trust: "volunteer", raw: 98 },
  { id: "n3", label: "Node 3", layers: "32–47", trust: "volunteer", raw: 94 },
  { id: "exit", label: "Exit", layers: "48–63", trust: "operator", raw: 88 },
] as const;

const MPC_FLOOR = 0.2;
const STEP_MS = 900;
const STREAM_MS = 18;

type Phase =
  | "idle"
  | "embed"
  | "hop-0"
  | "hop-1"
  | "hop-2"
  | "hop-3"
  | "decode"
  | "receipt";

function hopIndex(phase: Phase): number {
  if (phase === "hop-0") return 0;
  if (phase === "hop-1") return 1;
  if (phase === "hop-2") return 2;
  if (phase === "hop-3") return 3;
  if (phase === "decode" || phase === "receipt") return 4;
  if (phase === "embed") return -0.3;
  return -1;
}

function fmtPct(n: number): string {
  if (n < 1) return `${n.toFixed(1)}%`;
  return `${n.toFixed(0)}%`;
}

export function LiveInference() {
  const [runIdx, setRunIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [typedOut, setTypedOut] = useState("");
  const [auto, setAuto] = useState(true);
  const timers = useRef<number[]>([]);
  const run = SAMPLE_RUNS[runIdx % SAMPLE_RUNS.length];

  const clearTimers = () => {
    for (const id of timers.current) window.clearTimeout(id);
    timers.current = [];
  };

  const later = (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const start = useCallback((nextIdx: number) => {
    clearTimers();
    const sample = SAMPLE_RUNS[nextIdx % SAMPLE_RUNS.length];
    setRunIdx(nextIdx);
    setTypedOut("");
    setPhase("embed");

    const hops: Phase[] = ["hop-0", "hop-1", "hop-2", "hop-3"];
    hops.forEach((hop, i) => {
      later(STEP_MS * (i + 1), () => setPhase(hop));
    });
    later(STEP_MS * 5, () => {
      setPhase("decode");
      let i = 0;
      const tick = () => {
        i += 1;
        setTypedOut(sample.output.slice(0, i));
        if (i < sample.output.length) later(STREAM_MS, tick);
        else later(400, () => setPhase("receipt"));
      };
      tick();
    });
  }, []);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setPhase("receipt");
      setTypedOut(run.output);
      return;
    }
    start(0);
    return clearTimers;
    // Mount-only autoplay.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!auto || phase !== "receipt") return;
    later(4200, () => start(runIdx + 1));
    return clearTimers;
  }, [auto, phase, runIdx, start]);

  const pulse = hopIndex(phase);
  const receiptReady = phase === "receipt";
  const runId = useMemo(
    () => `nuro-${(runIdx + 1).toString(16).padStart(4, "0")}-${1800 + runIdx}`,
    [runIdx],
  );

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5ce6a5] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#5ce6a5]" />
            </span>
            <p className="section-index text-[#5ce6a5]/80">Live simulation</p>
          </div>
          <h3 className="mt-3 text-2xl font-semibold leading-snug tracking-[-0.02em] md:text-3xl">
            A private run, in motion.
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setAuto(false);
              start(runIdx + 1);
            }}
            className="btn-secondary px-4 py-2 text-xs"
          >
            Next prompt
          </button>
          <button
            type="button"
            onClick={() => {
              setAuto((v) => !v);
              if (phase === "receipt") start(runIdx + 1);
            }}
            className="btn-primary px-4 py-2 text-xs"
          >
            {auto ? "Pause loop" : "Auto-run"}
          </button>
        </div>
      </div>

      <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-mute md:text-[15px]">
        Simulation of the measured gates — not a production receipt. Watch a
        prompt cross four shards, then see raw recovery collapse to chance on a
        single MPC share.
      </p>

      <div className="inset-panel mt-8 rounded-2xl p-4 md:p-5">
        <p className="text-[11px] uppercase tracking-[0.18em] text-mute">
          Prompt
        </p>
        <p className="mt-2 font-mono text-sm text-accent md:text-[15px]">
          {run.prompt}
        </p>
      </div>

      <div className="mt-8">
        <div className="relative grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          <div
            className="pointer-events-none absolute top-[34px] right-6 left-6 hidden h-px bg-[var(--line)] md:block"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute top-[34px] hidden h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#7ED6FF] shadow-[0_0_16px_rgba(126,214,255,0.9)] transition-[left] duration-700 ease-out md:block"
            style={{
              left:
                pulse < 0
                  ? "4%"
                  : pulse >= 4
                    ? "96%"
                    : `${12.5 + pulse * 25}%`,
            }}
            aria-hidden
          />
          {NODES.map((node, i) => {
            const active = pulse >= i;
            const defending = pulse > i || receiptReady;
            const recovery = defending ? MPC_FLOOR : active ? node.raw : 0;
            return (
              <div
                key={node.id}
                className={`relative rounded-2xl border p-4 transition-colors duration-500 ${
                  active
                    ? "border-[#7ED6FF]/35 bg-[#7ED6FF]/[0.06]"
                    : "border-line bg-[var(--inset)]"
                }`}
              >
                <div
                  className={`h-3 w-3 rounded-full ${
                    node.trust === "operator" ? "bg-[#F4E6C9]" : "bg-[#7ED6FF]"
                  } ${active ? "shadow-[0_0_14px_rgba(126,214,255,0.7)]" : "opacity-30"}`}
                />
                <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-mute">
                  {node.label}
                </p>
                <p className="mt-1 font-mono text-[11px] text-mute">
                  layers {node.layers}
                </p>
                <p className="mt-3 font-mono text-xl tabular-nums text-[var(--fg)]">
                  {active ? fmtPct(recovery) : "—"}
                </p>
                <p className="mt-1 text-[11px] text-mute">
                  {defending
                    ? "one share · chance"
                    : active
                      ? "raw activations"
                      : "waiting"}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        <div className="inset-panel rounded-2xl p-5 lg:col-span-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-mute">
            Output
          </p>
          <p className="mt-3 min-h-[7.5rem] text-[15px] leading-relaxed text-[var(--fg)]/85">
            {typedOut || (
              <span className="text-mute">
                Waiting for the tail to decode…
              </span>
            )}
            {phase === "decode" && (
              <span className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 animate-pulse bg-[#7ED6FF]" />
            )}
          </p>
        </div>

        <div className="inset-panel rounded-2xl p-5 lg:col-span-2">
          <p className="text-[11px] uppercase tracking-[0.18em] text-mute">
            Privacy receipt
          </p>
          {receiptReady ? (
            <dl className="mt-3 space-y-2 font-mono text-[12px]">
              <Row k="run" v={runId} />
              <Row k="worst untrusted" v="0.2%" accent />
              <Row k="threshold" v="10%" />
              <Row k="pass" v="true" accent />
              <Row k="defense" v="2-party MPC" />
            </dl>
          ) : (
            <p className="mt-3 text-[14px] text-mute">
              Issued when the tail emits the last token.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({
  k,
  v,
  accent,
}: {
  k: string;
  v: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-mute">{k}</dt>
      <dd className={accent ? "text-[#5ce6a5]" : "text-[var(--fg)]"}>{v}</dd>
    </div>
  );
}
