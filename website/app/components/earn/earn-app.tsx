import { useCallback, useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { SiteFooter, SiteHeader } from "../layout/site-chrome";
import { Reveal } from "../util/reveal";
import { useEarn } from "../../lib/use-earn";
import { useBrowserWorker } from "../../lib/use-browser-worker";
import { Link } from "react-router";
import {
  isValidEvmAddress,
  ORCHESTRATOR_WS_URL,
  PUBLIC_API_URL,
  type IssuedApiKey,
  type UserStats,
} from "../../lib/orchestrator";
import { ROBINHOOD_CHAIN_ID } from "../../lib/token";

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

function fmtUsdg(n: number | undefined) {
  const v = n ?? 0;
  // Online stipends and small jobs are sub-cent; keep them visible.
  if (v > 0 && v < 0.01) return `${v.toFixed(4)} USDG`;
  return `${v.toFixed(2)} USDG`;
}

function fmtUptime(seconds: number | undefined) {
  const s = Math.max(0, Math.floor(seconds ?? 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (v: number) => String(v).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(sec)}`;
}

export default function EarnApp() {
  const mounted = useMounted();
  const { authenticated, login } = usePrivy();
  const {
    stats,
    network,
    getToken,
    testJob,
    savePayoutAddress,
    withdraw,
    newApiKey,
    removeApiKey,
  } = useEarn();

  const online = (stats?.workersOnline ?? 0) > 0;

  return (
    <div className="page-root">
      <SiteHeader />
      <main className="page-shell relative pt-20 pb-24 md:pt-24">
        {/* Header */}
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="label-caps">Worker node</p>
              <h1 className="mt-4 text-[clamp(2.25rem,5vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
                Contribute compute,
                <br />
                <span className="text-gradient">earn.</span>
              </h1>
            </div>
            <NetworkBadge network={network} mounted={mounted} />
          </div>
        </Reveal>

        {/* Status + Network */}
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          <Reveal className="lg:col-span-2" variant="left">
            <StatusCard
              mounted={mounted}
              online={online}
              earnedToday={stats?.earnedTodayUsd}
              earnedTotal={stats?.earnedTotalUsd}
              uptime={stats?.uptimeSeconds}
              jobs={stats?.jobsCompleted}
              tokPerSec={stats?.tokensPerSecond}
            />
          </Reveal>
          <Reveal variant="right">
            <NetworkCard network={network} mounted={mounted} />
          </Reveal>
        </div>

        {/* Payout (only for signed-in users) */}
        {authenticated && stats && (
          <Reveal>
            <PayoutCard
              payout={stats.payout}
              save={savePayoutAddress}
              withdraw={withdraw}
            />
          </Reveal>
        )}

        {/* Test the network (only when the user has an online worker) */}
        {authenticated && online && (
          <Reveal>
            <TestJobPanel testJob={testJob} />
          </Reveal>
        )}

        {/* Start earning */}
        <Reveal>
          <div className="mt-16 max-w-2xl">
            <p className="section-index">Start earning</p>
            <h2 className="mt-4 text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-tight tracking-[-0.02em]">
              Two ways to contribute
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-mute md:text-base">
              You earn USDG for time online and for every job you serve.
              Withdrawals queue to your Robinhood wallet and settle once the
              paymaster vault is funded. Native serves the largest models;
              browser runs in this tab — one click, no terminal.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <Reveal variant="left">
            <NativeWorkerCard
              authenticated={authenticated}
              login={login}
              getToken={getToken}
            />
          </Reveal>
          <Reveal variant="right">
            <BrowserWorkerCard
              authenticated={authenticated}
              login={login}
              getToken={getToken}
            />
          </Reveal>
        </div>

        {/* Build on the network - the consumer side (API keys + playground) */}
        <Reveal>
          <div className="mt-20 max-w-2xl">
            <p className="section-index">Build on the network</p>
            <h2 className="mt-4 text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-tight tracking-[-0.02em]">
              Use the inference API
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-mute md:text-base">
              An OpenAI-compatible endpoint served by the network. Create a key,
              point any OpenAI client at it, or try it in the{" "}
              <Link to="/playground" className="text-accent underline-offset-4 hover:underline">
                playground
              </Link>
              .
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <Reveal variant="left">
            <ApiKeysCard
              authenticated={authenticated}
              login={login}
              keys={stats?.apiKeys ?? []}
              billing={stats?.billing}
              create={newApiKey}
              revoke={removeApiKey}
            />
          </Reveal>
          <Reveal variant="right">
            <ApiUsageCard />
          </Reveal>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function NetworkBadge({
  network,
  mounted,
}: {
  network: ReturnType<typeof useEarn>["network"];
  mounted: boolean;
}) {
  const connected = mounted && network != null;
  return (
    <div className="text-sm text-mute md:text-right">
      <div className="flex items-center gap-2 md:justify-end">
        <span
          className={`h-2 w-2 rounded-full ${
            connected ? "bg-[#5ce6a5]" : "bg-[var(--mute-soft)]"
          }`}
        />
        <span className={connected ? "text-[#5ce6a5]" : ""}>
          {connected ? "Connected to orchestrator" : "Connecting…"}
        </span>
      </div>
      {connected && network && (
        <p className="mt-1.5 text-[13px] text-mute">
          {network.workersOnline} workers online ({network.browserOnline} browser
          · {network.nativeOnline} native) · {network.jobsInQueue} in queue
        </p>
      )}
    </div>
  );
}

function StatusCard({
  mounted,
  online,
  earnedToday,
  earnedTotal,
  uptime,
  jobs,
  tokPerSec,
}: {
  mounted: boolean;
  online: boolean;
  earnedToday?: number;
  earnedTotal?: number;
  uptime?: number;
  jobs?: number;
  tokPerSec?: number;
}) {
  const cells = [
    { value: mounted ? fmtUsdg(earnedTotal) : "-", label: "earned (USDG)" },
    { value: mounted ? fmtUptime(uptime) : "-", label: "uptime" },
    { value: mounted ? String(jobs ?? 0) : "-", label: "jobs" },
    {
      value: mounted ? (tokPerSec ? tokPerSec.toFixed(1) : "-") : "-",
      label: "tok/s",
    },
  ];
  return (
    <div className="glass-panel h-full rounded-[1.75rem] p-7 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-[-0.02em]">Status</h2>
        <div className="flex items-center gap-2 text-sm">
          <span
            className={`h-2 w-2 rounded-full ${
              mounted && online ? "bg-[#5ce6a5]" : "bg-[var(--mute-soft)]"
            }`}
          />
          <span className={mounted && online ? "text-[#5ce6a5]" : "text-mute"}>
            {mounted && online ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cells.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-line bg-[var(--inset)] p-4 text-center"
          >
            <p className="text-2xl font-semibold tracking-[-0.02em]">{c.value}</p>
            <p className="mt-1 text-[13px] text-mute">{c.label}</p>
          </div>
        ))}
      </div>

      <p className="mt-6 text-sm text-mute">
        {mounted ? fmtUsdg(earnedToday) : "-"} earned today
      </p>
    </div>
  );
}

function NetworkCard({
  network,
  mounted,
}: {
  network: ReturnType<typeof useEarn>["network"];
  mounted: boolean;
}) {
  const others = mounted && network ? Math.max(0, network.workersOnline - 1) : 0;
  return (
    <div className="glass-panel h-full rounded-[1.75rem] p-7 md:p-8">
      <h2 className="text-lg font-semibold tracking-[-0.02em]">Network</h2>
      <div className="mt-6 flex flex-col items-center justify-center py-6">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-line bg-[var(--panel)]">
          <div className="h-3 w-3 rounded-full bg-[var(--accent)] shadow-[0_0_24px_rgba(126,214,255,0.8)]" />
          <div className="absolute inset-0 animate-[spin-slow_18s_linear_infinite] rounded-full border-t border-[rgba(126,214,255,0.4)]" />
        </div>
        <p className="mt-5 label-caps text-mute">Orchestrator</p>
        {mounted && others > 0 && (
          <p className="mt-1 text-[13px] text-mute">+{others} more</p>
        )}
      </div>
    </div>
  );
}

function PayoutCard({
  payout,
  save,
  withdraw,
}: {
  payout: UserStats["payout"];
  save: (address: string, chainId?: number) => Promise<void>;
  withdraw: () => Promise<void>;
}) {
  const [address, setAddress] = useState(payout.address ?? "");
  const [saving, setSaving] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const remaining = Math.max(0, payout.thresholdUsd - payout.availableUsd);
  const pct = Math.min(
    100,
    Math.round((payout.availableUsd / Math.max(payout.thresholdUsd, 0.01)) * 100),
  );
  const addressValid = isValidEvmAddress(address);
  const addressChanged = address.trim() !== (payout.address ?? "");

  const onSave = useCallback(async () => {
    if (!addressValid || saving) return;
    setSaving(true);
    setErr(null);
    setMsg(null);
    try {
      await save(address.trim(), ROBINHOOD_CHAIN_ID);
      setMsg("Payout address saved");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to save address");
    } finally {
      setSaving(false);
    }
  }, [address, addressValid, saving, save]);

  const onWithdraw = useCallback(async () => {
    if (withdrawing) return;
    setWithdrawing(true);
    setErr(null);
    setMsg(null);
    try {
      await withdraw();
      setMsg(
        "Payout queued. It stays pending until the paymaster vault is funded.",
      );
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to request payout");
    } finally {
      setWithdrawing(false);
    }
  }, [withdraw, withdrawing]);

  return (
    <div className="glass-panel mt-5 rounded-[1.75rem] p-7 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="section-index text-accent/70">Payout</p>
          <h3 className="mt-3 text-lg font-semibold tracking-[-0.02em]">
            {fmtUsdg(payout.availableUsd)}{" "}
            <span className="text-sm font-normal text-mute">available</span>
          </h3>
        </div>
        <span className="text-[13px] text-mute">
          Min payout {fmtUsdg(payout.thresholdUsd)}
        </span>
      </div>

      <div className="mt-5">
        {payout.availableUsd < payout.thresholdUsd && (
          <div className="mb-5">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--inset)]">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-3 text-[14px] text-mute">
              Earn {fmtUsdg(remaining)} more to withdraw. Stay online — USDG
              accrues while your worker is connected.
            </p>
          </div>
        )}
        <label className="text-[13px] text-mute">
          Payout address (Robinhood Chain)
        </label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="0x…"
            spellCheck={false}
            className="w-full rounded-2xl border border-line bg-[var(--inset)] px-4 py-3 font-mono text-sm text-[var(--fg)] outline-none placeholder:text-[var(--mute-soft)]"
          />
          <button
            type="button"
            onClick={onSave}
            disabled={!addressValid || !addressChanged || saving}
            className="btn-secondary shrink-0 px-6 disabled:opacity-40"
          >
            {saving ? "Saving…" : payout.address ? "Update" : "Save"}
          </button>
        </div>
        {address && !addressValid && (
          <p className="mt-2 text-xs text-[#ff9b9b]">
            Enter a valid EVM wallet address.
          </p>
        )}

        <button
          type="button"
          onClick={onWithdraw}
          disabled={!payout.canRequest || withdrawing || addressChanged}
          className="btn-primary mt-5 w-full disabled:opacity-40"
        >
          {withdrawing
            ? "Requesting…"
            : `Withdraw ${fmtUsdg(payout.availableUsd)}`}
        </button>
        <p className="mt-2 text-center text-xs text-mute">
          Queued withdrawals settle in USDG after the paymaster vault is funded.
        </p>
      </div>

      {msg && <p className="mt-3 text-xs text-[#5ce6a5]">{msg}</p>}
      {err && <p className="mt-3 text-xs text-[#ff9b9b]">{err}</p>}

      {payout.history.length > 0 && (
        <div className="mt-6 border-t border-line pt-5">
          <p className="section-index">Recent payouts</p>
          <ul className="mt-3 space-y-2">
            {payout.history.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-[var(--fg)]/70">{fmtUsdg(p.amountUsd)}</span>
                <span
                  className={`text-xs capitalize ${
                    p.status === "paid"
                      ? "text-[#5ce6a5]"
                      : p.status === "pending"
                        ? "text-accent"
                        : "text-mute"
                  }`}
                >
                  {p.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function TestJobPanel({
  testJob,
}: {
  testJob: ReturnType<typeof useEarn>["testJob"];
}) {
  const [prompt, setPrompt] = useState("Say hello from the Nuro network.");
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const run = useCallback(async () => {
    if (running || !prompt.trim()) return;
    setRunning(true);
    setOutput("");
    setErr(null);
    try {
      await testJob(prompt, {
        onToken: (t) => setOutput((prev) => prev + t),
        onDone: () => setRunning(false),
        onError: (m) => {
          setErr(m);
          setRunning(false);
        },
      });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
      setRunning(false);
    }
  }, [prompt, running, testJob]);

  return (
    <div className="glass-panel mt-5 rounded-[1.75rem] p-7 md:p-8">
      <p className="section-index text-accent/70">Prove the round-trip</p>
      <h3 className="mt-3 text-lg font-semibold tracking-[-0.02em]">
        Run a test job on your worker
      </h3>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full rounded-2xl border border-line bg-[var(--inset)] px-4 py-3 text-sm text-[var(--fg)] outline-none placeholder:text-[var(--mute-soft)]"
          placeholder="Ask your worker something…"
        />
        <button
          type="button"
          onClick={run}
          disabled={running}
          className="btn-primary shrink-0 px-6 disabled:opacity-40"
        >
          {running ? "Running…" : "Run test job"}
        </button>
      </div>
      {(output || err) && (
        <pre className="mt-4 max-h-52 overflow-auto whitespace-pre-wrap rounded-2xl border border-line bg-[var(--inset)] p-4 text-sm leading-relaxed text-[var(--fg)]/70">
          {err ? <span className="text-[#ff9b9b]">{err}</span> : output}
        </pre>
      )}
    </div>
  );
}

function ApiKeysCard({
  authenticated,
  login,
  keys,
  billing,
  create,
  revoke,
}: {
  authenticated: boolean;
  login: () => void;
  keys: UserStats["apiKeys"];
  billing: UserStats["billing"] | undefined;
  create: (label?: string) => Promise<IssuedApiKey>;
  revoke: (id: string) => Promise<void>;
}) {
  const [label, setLabel] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [fresh, setFresh] = useState<IssuedApiKey | null>(null);
  const [copied, setCopied] = useState(false);

  const live = keys.filter((k) => !k.revoked);

  const onCreate = useCallback(async () => {
    if (!authenticated) return login();
    if (busy) return;
    setBusy(true);
    setErr(null);
    setFresh(null);
    try {
      const issued = await create(label.trim() || undefined);
      setFresh(issued);
      setLabel("");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to create key");
    } finally {
      setBusy(false);
    }
  }, [authenticated, login, busy, create, label]);

  const copy = useCallback(() => {
    if (!fresh) return;
    void navigator.clipboard?.writeText(fresh.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [fresh]);

  return (
    <article className="card glass-panel flex h-full flex-col rounded-[1.75rem] p-8">
      <div className="flex items-start justify-between">
        <h3 className="text-xl font-semibold tracking-[-0.02em]">API keys</h3>
        <span className="glass-tag glass-tag-neutral">OpenAI-compatible</span>
      </div>
      <p className="mt-4 text-[15px] leading-relaxed text-mute">
        Authenticate requests to <code className="text-accent">/v1/chat/completions</code>.
        The full secret is shown once - store it safely.
      </p>

      {billing && <BillingStrip billing={billing} />}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Key label (optional) e.g. my-app"
          spellCheck={false}
          className="w-full rounded-2xl border border-line bg-[var(--inset)] px-4 py-3 text-sm text-[var(--fg)] outline-none placeholder:text-[var(--mute-soft)]"
        />
        <button
          type="button"
          onClick={onCreate}
          disabled={busy}
          className="btn-primary shrink-0 px-6 disabled:opacity-40"
        >
          {busy ? "Creating…" : authenticated ? "Create key" : "Sign in"}
        </button>
      </div>

      {fresh && (
        <div className="mt-4 rounded-2xl border border-[rgba(126,214,255,0.25)] bg-[var(--inset)] p-4">
          <p className="text-xs text-mute">
            Your new key (copy it now - you won&apos;t see it again):
          </p>
          <div className="mt-2 flex items-center gap-2">
            <code className="flex-1 overflow-x-auto text-xs text-accent">
              {fresh.key}
            </code>
            <button
              type="button"
              onClick={copy}
              className="shrink-0 rounded-full border border-line px-3 py-1 text-xs text-accent hover:border-[var(--fg)]/30"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      )}

      {err && <p className="mt-3 text-xs text-[#ff9b9b]">{err}</p>}

      {live.length > 0 && (
        <ul className="mt-6 space-y-2">
          {live.map((k) => (
            <li
              key={k.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-[var(--inset)] px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-mono text-sm text-[var(--fg)]/70">{k.key}</p>
                <p className="text-xs text-mute">
                  {k.label ? `${k.label} · ` : ""}
                  {k.lastUsedAt ? "used" : "never used"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void revoke(k.id)}
                className="shrink-0 rounded-full border border-line px-3 py-1 text-xs text-mute hover:border-[#ff9b9b]/40 hover:text-[#ff9b9b]"
              >
                Revoke
              </button>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function BillingStrip({ billing }: { billing: UserStats["billing"] }) {
  if (!billing.enabled) {
    return (
      <div className="mt-5 flex items-center gap-2 rounded-2xl border border-line bg-[var(--inset)] px-4 py-3 text-[13px] text-mute">
        <span className="h-2 w-2 rounded-full bg-[#5ce6a5]" />
        Free in this environment - no billing enforced.
      </div>
    );
  }
  const pct = Math.min(
    100,
    Math.round((billing.freeRemaining / Math.max(1, billing.freeTier)) * 100),
  );
  const outOfFree = billing.freeRemaining <= 0;
  // Prices are stored per 1K tokens; show the friendlier per-1M figure.
  const per1m = (v: number) => `$${(v * 1000).toFixed(2)}`;
  const tiers: Array<[string, { inputPer1k: number; outputPer1k: number }]> = [
    ["Small (~8B)", billing.tiers.small],
    ["Mid (~34B)", billing.tiers.mid],
    ["Large (~70B)", billing.tiers.large],
  ];
  return (
    <div className="mt-5 rounded-2xl border border-line bg-[var(--inset)] p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-[var(--fg)]/70">
          {billing.freeRemaining} / {billing.freeTier} free requests left
        </span>
        <span className="text-mute">
          Credits{" "}
          <span className="text-accent">${billing.creditsUsd.toFixed(2)}</span>
        </span>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--inset)]">
        <div
          className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-4 border-t border-line pt-3">
        <p className="text-[13px] text-mute">
          Pay per token in USDG or $NURO (per 1M tokens, in / out):
        </p>
        <ul className="mt-2 space-y-1 text-[13px]">
          {tiers.map(([name, p]) => (
            <li key={name} className="flex items-center justify-between">
              <span className="text-mute">{name}</span>
              <span className="font-mono text-[var(--fg)]/70">
                {per1m(p.inputPer1k)} / {per1m(p.outputPer1k)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {outOfFree && billing.creditsUsd <= 0 && (
        <p className="mt-3 text-[13px] text-mute">
          Free tier used - credit top-ups go live with the $NURO token deployment.
        </p>
      )}
    </div>
  );
}

function ApiUsageCard() {
  const [copied, setCopied] = useState(false);
  const snippet = `curl ${PUBLIC_API_URL}/v1/chat/completions \\
  -H "Authorization: Bearer $NURO_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "messages": [{"role": "user", "content": "Hello from Nuro"}],
    "stream": true
  }'`;

  const copy = useCallback(() => {
    void navigator.clipboard?.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [snippet]);

  return (
    <article className="card glass-panel flex h-full flex-col rounded-[1.75rem] p-8">
      <div className="flex items-start justify-between">
        <h3 className="text-xl font-semibold tracking-[-0.02em]">Quickstart</h3>
        <button
          type="button"
          onClick={copy}
          className="shrink-0 rounded-full border border-line px-3 py-1 text-xs text-accent hover:border-[var(--fg)]/30"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <p className="mt-4 text-[15px] leading-relaxed text-mute">
        Any OpenAI SDK works - just set the base URL and your key.
      </p>
      <pre className="mt-6 flex-1 overflow-x-auto rounded-2xl border border-line bg-[var(--inset)] p-4 text-xs leading-relaxed text-mute">
        <code>{snippet}</code>
      </pre>
      <p className="mt-4 text-xs text-mute">
        Base URL <code className="text-[var(--fg)]/70">{PUBLIC_API_URL}/v1</code> ·
        model optional (routed to an available worker).
      </p>
    </article>
  );
}

const NODE_INSTALL: Record<string, string> = {
  macOS: "brew install node",
  Windows: "winget install OpenJS.NodeJS",
  Linux: "sudo apt install -y nodejs npm",
};

function NativeWorkerCard({
  authenticated,
  login,
  getToken,
}: {
  authenticated: boolean;
  login: () => void;
  getToken: (c: "native" | "browser") => Promise<string>;
}) {
  const [command, setCommand] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [os, setOs] = useState<keyof typeof NODE_INSTALL>("macOS");
  const [copied, setCopied] = useState(false);

  const onGet = useCallback(async () => {
    if (!authenticated) return login();
    setBusy(true);
    setErr(null);
    try {
      const token = await getToken("native");
      setCommand(
        `npx @nuroaixyz/worker --token ${token} --orchestrator ${ORCHESTRATOR_WS_URL}`,
      );
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to get command");
    } finally {
      setBusy(false);
    }
  }, [authenticated, login, getToken]);

  const copy = useCallback(() => {
    if (!command) return;
    void navigator.clipboard?.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [command]);

  return (
    <article className="card glass-panel flex h-full flex-col rounded-[1.75rem] border-[rgba(126,214,255,0.18)] p-8">
      <div className="flex items-start justify-between">
        <h3 className="text-xl font-semibold tracking-[-0.02em]">
          Native Worker
        </h3>
        <span className="glass-tag">Recommended</span>
      </div>
      <p className="mt-4 text-2xl font-semibold text-accent">
        Highest rate <span className="text-sm text-mute">per token</span>
      </p>
      <p className="mt-1 text-[13px] text-mute">
        Serves the largest models — paid in USDG
      </p>
      <p className="mt-5 text-[15px] leading-relaxed text-mute">
        Runs the biggest models on your own GPU in the background via Ollama - no
        tab to keep open. The highest-paying jobs on the network.
      </p>

      <ol className="mt-6 space-y-2 text-[14px] text-mute">
        <li>1. Click below to get your command</li>
        <li>2. Paste it into your terminal</li>
        <li>3. You&apos;re earning - it connects automatically</li>
      </ol>

      {command ? (
        <div className="mt-6">
          <div className="flex items-center gap-2 rounded-2xl border border-line bg-[var(--inset)] p-4">
            <code className="flex-1 overflow-x-auto text-xs text-accent">
              {command}
            </code>
            <button
              type="button"
              onClick={copy}
              className="shrink-0 rounded-full border border-line px-3 py-1 text-xs text-accent hover:border-[var(--fg)]/30"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="mt-2 text-xs text-mute">
            Token is shown once - keep it safe. Needs Node.js 18+ and a compatible
            GPU (NVIDIA, AMD, Apple Silicon).
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={onGet}
          disabled={busy}
          className="btn-primary mt-6 w-full disabled:opacity-40"
        >
          {busy
            ? "Issuing token…"
            : authenticated
              ? "Get my command"
              : "Sign in to get command"}
        </button>
      )}

      {err && <p className="mt-3 text-xs text-[#ff9b9b]">{err}</p>}

      <div className="mt-auto pt-6">
        <p className="text-xs text-mute">Need Node.js 18+ first? Install it:</p>
        <div className="mt-2 flex gap-1.5">
          {(Object.keys(NODE_INSTALL) as Array<keyof typeof NODE_INSTALL>).map(
            (k) => (
              <button
                key={k}
                type="button"
                onClick={() => setOs(k)}
                className={`rounded-full px-3 py-1 text-xs transition-colors ${
                  os === k
                    ? "bg-white text-black"
                    : "border border-line text-mute hover:text-[var(--fg)]"
                }`}
              >
                {k}
              </button>
            ),
          )}
        </div>
        <pre className="mt-2 overflow-x-auto rounded-xl border border-line bg-[var(--inset)] p-3 text-xs text-mute">
          <code>{NODE_INSTALL[os]}</code>
        </pre>
      </div>
    </article>
  );
}

function BrowserWorkerCard({
  authenticated,
  login,
  getToken,
}: {
  authenticated: boolean;
  login: () => void;
  getToken: (c: "native" | "browser") => Promise<string>;
}) {
  const { status, progress, message, networked, start, stop } =
    useBrowserWorker();

  // The token fetch is best-effort inside the hook, so starting never hard-fails
  // on a backend/CORS error — the model still runs in the tab.
  const onStart = useCallback(async () => {
    if (!authenticated) return login();
    await start(() => getToken("browser"));
  }, [authenticated, login, getToken, start]);

  const loading = status === "loading";
  const online = status === "online";

  return (
    <article className="card glass-panel flex h-full flex-col rounded-[1.75rem] p-8">
      <div className="flex items-start justify-between">
        <h3 className="text-xl font-semibold tracking-[-0.02em]">
          Browser Worker
        </h3>
        <span className="glass-tag glass-tag-neutral">
          {online ? (networked ? "Online" : "Local") : "WebGPU"}
        </span>
      </div>
      <p className="mt-4 text-2xl font-semibold text-accent">
        Entry rate <span className="text-sm text-mute">per token</span>
      </p>
      <p className="mt-1 text-[13px] text-mute">Zero install - smaller models</p>
      <p className="mt-5 text-[15px] leading-relaxed text-mute">
        Runs a lightweight Qwen model right in this tab using WebGPU. Easiest to
        start - no install - but earns far less than native, and only while the
        tab stays open.
      </p>

      {(loading || online || message) && (
        <div className="mt-6 rounded-2xl border border-line bg-[var(--inset)] p-4">
          {loading && (
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--inset)]">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-300"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
          )}
          <p className="mt-2 text-xs text-mute">{message}</p>
        </div>
      )}

      <div className="mt-auto pt-6">
        {online ? (
          <button
            type="button"
            onClick={stop}
            className="btn-secondary w-full py-3"
          >
            Stop browser worker
          </button>
        ) : (
          <button
            type="button"
            onClick={onStart}
            disabled={loading}
            className="btn-primary w-full py-3 disabled:opacity-40"
          >
            {loading
              ? "Starting…"
              : authenticated
                ? "Start Browser Worker"
                : "Sign in to start"}
          </button>
        )}
      </div>
    </article>
  );
}
