import { useMemo, useState } from "react";
import {
  asLatin1,
  combineBytes,
  decodePrompt,
  encodePrompt,
  hexPreview,
  splitBytes,
} from "../../lib/share-bytes";

const SAMPLES = [
  "Meet me behind the old library at midnight.",
  "The model is public. The prompt is not.",
  "Transfer twelve thousand from escrow on Friday.",
];

const MAX = 180;

type Shares = { s0: Uint8Array; s1: Uint8Array };

export function ShareSplit() {
  const [draft, setDraft] = useState(SAMPLES[0]);
  const [shares, setShares] = useState<Shares | null>(null);
  const [collude, setCollude] = useState(false);
  const [copied, setCopied] = useState<"s0" | "s1" | null>(null);

  const split = () => {
    const text = draft.trim().slice(0, MAX);
    if (!text) return;
    setShares(splitBytes(encodePrompt(text)));
    setCollude(false);
  };

  const revealed = useMemo(() => {
    if (!shares || !collude) return null;
    return decodePrompt(combineBytes(shares.s0, shares.s1));
  }, [shares, collude]);

  const copyShare = async (which: "s0" | "s1") => {
    if (!shares) return;
    const hex = Array.from(shares[which], (b) => b.toString(16).padStart(2, "0")).join("");
    await navigator.clipboard?.writeText(hex);
    setCopied(which);
    window.setTimeout(() => setCopied(null), 1400);
  };

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-index text-[#5ce6a5]/80">The split</p>
          <h3 className="mt-3 text-2xl font-semibold leading-snug tracking-[-0.02em] md:text-3xl">
            One worker holds noise. Two reconstruct.
          </h3>
        </div>
      </div>
      <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-[#8a8a8a] md:text-[15px]">
        Type a secret. We XOR-split the UTF-8 bytes in your browser. Each
        share is uniform noise — the same information theory as one MPC
        activation share. This is the primitive, not a production receipt.
      </p>

      <label className="mt-8 block">
        <span className="text-[11px] uppercase tracking-[0.18em] text-[#5c5c5c]">
          Your prompt
        </span>
        <textarea
          value={draft}
          maxLength={MAX}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          className="mt-2 w-full resize-none rounded-2xl border border-white/[0.08] bg-black/50 px-4 py-3 font-mono text-sm text-[#D4F3FF] outline-none focus:border-[#7ED6FF]/40"
        />
      </label>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {SAMPLES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setDraft(s);
              setShares(null);
              setCollude(false);
            }}
            className="rounded-full border border-white/[0.08] px-3 py-1 text-[11px] text-[#8a8a8a] hover:border-white/25 hover:text-white"
          >
            {s.length > 36 ? `${s.slice(0, 34)}…` : s}
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={split} className="btn-primary px-5 py-2 text-xs">
          Split into two shares
        </button>
        {shares && (
          <button
            type="button"
            onClick={() => setCollude((v) => !v)}
            className="btn-secondary px-5 py-2 text-xs"
          >
            {collude ? "Hide collusion" : "Give both shares to the adversary"}
          </button>
        )}
      </div>

      {shares && (
        <>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <ShareCard
              title="Worker 0"
              subtitle="holds s0 only"
              bytes={shares.s0}
              copied={copied === "s0"}
              onCopy={() => void copyShare("s0")}
            />
            <ShareCard
              title="Worker 1"
              subtitle="holds s1 only"
              bytes={shares.s1}
              copied={copied === "s1"}
              onCopy={() => void copyShare("s1")}
            />
          </div>

          <div className="mt-4 rounded-2xl border border-white/[0.06] bg-black/40 p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#5c5c5c]">
              Adversary view
            </p>
            {collude && revealed !== null ? (
              <>
                <p className="mt-3 font-mono text-sm text-[#5ce6a5] md:text-[15px]">
                  {revealed}
                </p>
                <p className="mt-2 text-[13px] text-[#8a8a8a]">
                  Both shares combined. Recovery 100%. Privacy lives in
                  non-collusion.
                </p>
              </>
            ) : (
              <p className="mt-3 text-[14px] text-[#6f6f6f]">
                One share is empty. Copy either hex dump and try to read the
                sentence. You cannot.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function ShareCard({
  title,
  subtitle,
  bytes,
  copied,
  onCopy,
}: {
  title: string;
  subtitle: string;
  bytes: Uint8Array;
  copied: boolean;
  onCopy: () => void;
}) {
  const garbage = asLatin1(bytes);
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-black/40 p-5">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#8a8a8a]">
            {title}
          </p>
          <p className="mt-1 font-mono text-[11px] text-[#5c5c5c]">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={onCopy}
          className="text-[11px] text-[#7ED6FF] hover:text-white"
        >
          {copied ? "Copied" : "Copy hex"}
        </button>
      </div>
      <p className="mt-4 break-all font-mono text-[13px] leading-relaxed text-[#d4d4d4]">
        {garbage}
      </p>
      <p className="mt-3 break-all font-mono text-[11px] text-[#5c5c5c]">
        {hexPreview(bytes, 64)}
      </p>
      <p className="mt-3 text-[12px] text-[#6f6f6f]">
        Decoded as latin-1. It is not your prompt. It is a mask.
      </p>
    </div>
  );
}
