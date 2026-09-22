import { OsWindow } from "./os-window";
import { StippleField } from "./stipple-field";

const LADDER = [
  { id: "UNDEFENDED", w: "100%", note: "100%" },
  { id: "OBFUSC", w: "100%", note: "100%" },
  { id: "ONE SHARE", w: "3%", note: "0.21%", accent: true },
] as const;

/** The published bound: a raw hop still leaks; one share is noise. */
export function BoundIllustration() {
  return (
    <div
      className="bound-illust"
      role="img"
      aria-label="Undefended and open-weight obfuscation recover 100 percent of the prompt. One MPC share recovers 0.21 percent."
    >
      <div className="grid grid-cols-2 gap-2">
        <OsWindow title="RAW">
          <p>Meet me behind</p>
          <p>the old library</p>
          <p>at midnight.</p>
          <p className="mt-2 text-mute">recover 100%</p>
        </OsWindow>
        <OsWindow title="SHARE 0" featured>
          <div className="relative h-[4.75rem] overflow-hidden">
            <StippleField seed={0x0d210021} />
          </div>
          <p className="mt-2 text-accent">0.21% · chance</p>
        </OsWindow>
      </div>

      <div className="bound-ladder" aria-hidden>
        {LADDER.map((row) => (
          <div
            key={row.id}
            className={`bound-ladder-row ${row.accent ? "is-accent" : ""}`}
          >
            <span className="bound-ladder-id">{row.id}</span>
            <span className="os-table-bar">
              <i style={{ width: row.w }} />
            </span>
            <span className="tabular-nums">{row.note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Loose GPU swarm — not a rack. */
export function SwarmNodesIllustration() {
  return (
    <svg
      viewBox="0 0 320 128"
      fill="none"
      className="h-32 w-full"
      role="img"
      aria-label="GPUs pooled as a swarm, not a datacenter."
    >
      <g stroke="currentColor" strokeOpacity="0.22" strokeWidth="1">
        <path d="M58 38 L118 28 L168 52 L214 34 L262 58" />
        <path d="M72 86 L128 70 L176 92 L230 78" />
        <path d="M118 28 L128 70 M168 52 L176 92 M214 34 L230 78" />
      </g>
      {[
        [52, 32, false],
        [112, 22, true],
        [164, 46, false],
        [210, 28, false],
        [258, 52, true],
        [68, 80, false],
        [124, 64, false],
        [172, 86, true],
        [226, 72, false],
      ].map(([x, y, hot], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <rect
            x="-16"
            y="-10"
            width="32"
            height="20"
            rx="3"
            fill="var(--bg)"
            stroke={hot ? "var(--accent)" : "currentColor"}
            strokeWidth="1.2"
          />
          <path
            d="M-8 0 H8"
            stroke={hot ? "var(--accent)" : "currentColor"}
            strokeOpacity={hot ? 1 : 0.45}
            strokeWidth="1.2"
          />
        </g>
      ))}
    </svg>
  );
}

/** No policy gate on the model path. */
export function OpenPathIllustration() {
  return (
    <svg
      viewBox="0 0 320 128"
      fill="none"
      className="h-32 w-full"
      role="img"
      aria-label="Any model, no content-policy layer in the way."
    >
      <rect
        x="118"
        y="18"
        width="84"
        height="92"
        rx="4"
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeDasharray="3 3"
      />
      <text
        x="160"
        y="36"
        textAnchor="middle"
        fill="currentColor"
        fillOpacity="0.35"
        fontFamily="ui-monospace, monospace"
        fontSize="8"
        letterSpacing="0.16em"
      >
        POLICY
      </text>
      <path
        d="M132 48 L188 80 M188 48 L132 80"
        stroke="currentColor"
        strokeOpacity="0.28"
        strokeWidth="1.2"
      />

      {[
        [28, 40, "QWEN"],
        [28, 72, "LLAMA"],
        [236, 40, "ANY"],
        [236, 72, "MODEL"],
      ].map(([x, y, label]) => (
        <g key={String(label)} transform={`translate(${x} ${y})`}>
          <rect
            width="56"
            height="22"
            rx="3"
            fill="var(--bg)"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <text
            x="28"
            y="15"
            textAnchor="middle"
            fill="currentColor"
            fontFamily="ui-monospace, monospace"
            fontSize="8"
            letterSpacing="0.12em"
          >
            {String(label)}
          </text>
        </g>
      ))}

      <path
        d="M84 51 H118 M202 51 H236 M84 83 H118 M202 83 H236"
        stroke="var(--accent)"
        strokeWidth="1.2"
      />
      <circle cx="118" cy="51" r="2" fill="var(--accent)" />
      <circle cx="202" cy="51" r="2" fill="var(--accent)" />
      <circle cx="118" cy="83" r="2" fill="var(--accent)" />
      <circle cx="202" cy="83" r="2" fill="var(--accent)" />
    </svg>
  );
}
