import { Link } from "react-router";
import { LiquidPanel } from "../brand/liquid-glass";
import { LiveInference } from "../brand/live-inference";
import { Reveal } from "../util/reveal";

export function LiveInferenceSection() {
  return (
    <section id="live" className="relative border-t border-white/[0.06]">
      <div className="page-shell relative section-gap">
        <Reveal>
          <div className="max-w-2xl">
            <p className="section-index">03 / Live run</p>
            <h2 className="mt-4 text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.06] tracking-[-0.03em]">
              Watch a request{" "}
              <span className="text-gradient">stay private.</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#8a8a8a]">
              Entry and exit still see the most. The middle is where volunteers
              sit. This is the leak — and the close — playing in real time.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80} variant="scale">
          <LiquidPanel className="mt-12 md:mt-14">
            <div className="p-6 md:p-12">
              <LiveInference />
              <p className="mt-8 text-[13px] text-[#6f6f6f]">
                Full screen at{" "}
                <Link to="/live" className="text-[#7ED6FF] hover:text-white">
                  /live
                </Link>
                {" · "}
                The model is in{" "}
                <Link to="/paper" className="text-[#7ED6FF] hover:text-white">
                  the Paper
                </Link>
                .
              </p>
            </div>
          </LiquidPanel>
        </Reveal>
      </div>
    </section>
  );
}
