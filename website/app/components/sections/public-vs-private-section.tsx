import { useEffect, useState } from "react";
import { LifeField } from "../brand/life-field";
import { OsWindow } from "../brand/os-window";
import { StippleField } from "../brand/stipple-field";
import { Reveal } from "../util/reveal";

const ROWS = [
  { id: "API", kind: "hosted", recover: "100%", note: "logged" },
  { id: "WEIGHTS", kind: "local", recover: "100%", note: "raw" },
  { id: "OBFUSC", kind: "open", recover: "100%", note: "invertible" },
  { id: "SHARD", kind: "multi", recover: "94–100%", note: "activations" },
  { id: "NURO", kind: "2PC", recover: "0.21%", note: "chance", accent: true },
] as const;

function FieldClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const date = now
    ? now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";
  const time = now
    ? now.toLocaleTimeString("en-US", { hour12: false })
    : "00:00:00";

  return (
    <>
      <p>{date}</p>
      <p className="mt-1 tabular-nums">{time}</p>
    </>
  );
}

function CompareTable() {
  return (
    <div className="os-table" role="table" aria-label="Prompt recovery by setup">
      {ROWS.map((row) => (
        <div
          key={row.id}
          role="row"
          className={`os-table-row ${row.accent ? "is-accent" : ""}`}
        >
          <span className="os-table-id">{row.id}</span>
          <span className="text-mute">{row.kind}</span>
          <span className="os-table-bar" aria-hidden>
            <i style={{ width: row.accent ? "3%" : "100%" }} />
          </span>
          <span className="tabular-nums">{row.recover}</span>
          <span className={row.accent ? "text-accent" : "text-mute"}>
            {row.note}
          </span>
        </div>
      ))}
    </div>
  );
}

export function PublicVsPrivateSection() {
  return (
    <section id="compare" className="relative border-t border-line">
      <Reveal variant="fade">
        <div className="os-field relative overflow-hidden">
          <StippleField />

          <div className="page-shell relative z-[1] pt-8 pb-2 md:pt-10">
            <p className="section-index">03 / Public vs private</p>
            <h2 className="mt-3 text-[clamp(1.75rem,3.6vw,2.5rem)] font-semibold leading-[1.1]">
              Public models.{" "}
              <span className="text-mute">Private prompts.</span>
            </h2>
          </div>

          <div className="relative z-[1] flex flex-col gap-2 p-3 md:hidden">
            <OsWindow title="NURO" featured>
              <p>private run</p>
              <p>one share is noise</p>
              <p className="text-accent">0.21% · chance</p>
            </OsWindow>
            <OsWindow title="RECOVERY">
              <CompareTable />
            </OsWindow>
          </div>

          <div className="relative z-[1] mx-auto hidden h-[540px] max-w-[920px] md:block">
            <OsWindow
              className="absolute top-[36px] left-[12%] w-[168px]"
              title="API"
            >
              <p>hosted inference</p>
              <p className="text-mute">&lt;logged&gt;</p>
            </OsWindow>

            <OsWindow
              className="absolute top-[88px] left-[24%] w-[156px]"
              title="WEIGHTS"
            >
              <p>open weights</p>
              <p className="text-mute">raw activations</p>
            </OsWindow>

            <OsWindow
              className="absolute top-[28px] left-[42%] w-[176px]"
              title="SHARD"
            >
              <p>layers split</p>
              <p className="text-mute">every hop sees tensors</p>
            </OsWindow>

            <OsWindow
              className="absolute top-[28px] right-[10%] w-[168px]"
              title="CLOCK 1.1"
            >
              <FieldClock />
            </OsWindow>

            <OsWindow
              className="absolute top-[118px] left-[34%] z-20 w-[200px]"
              title="NURO"
              featured
            >
              <p>private run</p>
              <p>one share is noise</p>
              <p className="text-accent">0.21% · chance</p>
            </OsWindow>

            <OsWindow
              className="absolute top-[108px] left-[54%] z-10 w-[176px]"
              title="OBFUSC"
            >
              <p>open-weight obfuscation</p>
              <p className="text-mute">still 100%</p>
            </OsWindow>

            <OsWindow
              className="absolute top-[214px] left-1/2 z-10 w-[480px] -translate-x-1/2"
              title="RECOVERY"
            >
              <CompareTable />
            </OsWindow>

            <OsWindow
              className="absolute bottom-[28px] left-[12%] w-[188px]"
              title="NURO 0.01"
            >
              <p>Measured, not marketed.</p>
              <p className="text-mute">
                <a href="/paper">Paper →</a>
              </p>
            </OsWindow>

            <OsWindow
              className="absolute right-[10%] bottom-[28px] w-[150px]"
              title="LATTICE 1.1"
            >
              <div className="relative h-16 overflow-hidden">
                <LifeField />
              </div>
              <p className="text-mute">Game of Life</p>
            </OsWindow>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
