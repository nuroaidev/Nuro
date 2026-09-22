import { useState } from "react";

const FAQS = [
  {
    q: "What is Nuro?",
    a: "A public private-inference network. The model can be open. The prompt is split so an untrusted node cannot recover what you typed. We published the recovery number in the Paper.",
  },
  {
    q: "Do I need capital to run a worker?",
    a: "No. You contribute a GPU — native or in the browser — and get paid per token. Users pay for inference. Workers do not front the size.",
  },
  {
    q: "Is privacy guaranteed?",
    a: "No product receipt yet. The measured gate: undefended 100%, open-weight obfuscation 100%, one MPC share 0.21% — chance is 0.2%. A cycle that does not meet the bound does not count as private.",
  },
  {
    q: "How are the numbers calculated?",
    a: "Against live model shares in the harness, not mid-price guesses. One share is scored for prompt recoverability. The figure and the cost (2.42 MiB per token) are in the Paper.",
  },
  {
    q: "What does Nuro charge?",
    a: "Inference is metered in $NURO. 30% of every settlement underwrites the research. Nothing is charged on a failed job.",
  },
  {
    q: "Why do prompts leak on a sharded network?",
    a: "A pool of GPUs only moves when someone runs a layer. That node still sees real activations — enough to reconstruct tokens. Splitting the model solved size, not privacy.",
  },
  {
    q: "Who holds the prompt?",
    a: "Nobody between hops. The engine does not keep a prompt history. One share is noise. Entry and exit still see the most — that is in the Paper, not hidden.",
  },
  {
    q: "What is $NURO?",
    a: "The metering token. The CA is in the footer. Any other address that claims to be $NURO is not ours.",
  },
  {
    q: "How do I start?",
    a: "Open Chat to try a run. Earn to attach a worker. The Paper if you want the bound. Questions: Nuro on X.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState(-1);
  const mid = Math.ceil(FAQS.length / 2);
  const columns = [FAQS.slice(0, mid), FAQS.slice(mid)] as const;

  return (
    <section id="faq" className="relative">
      <div className="page-shell py-20 md:py-28">
        <h2 className="text-center text-[clamp(2.4rem,5.5vw,4.25rem)] font-semibold tracking-[-0.03em]">
          We give a FAQ
        </h2>

        <div className="faq-grid">
          {columns.map((col, colIdx) => (
            <div key={colIdx} className="faq-col">
              {col.map((item, local) => {
                const i = colIdx === 0 ? local : mid + local;
                const on = open === i;
                return (
                  <div key={item.q} className="faq-row">
                    <button
                      type="button"
                      aria-expanded={on}
                      className="faq-q"
                      onClick={() => setOpen(on ? -1 : i)}
                    >
                      <span>{item.q}</span>
                      <span className="faq-plus" aria-hidden>
                        {on ? "×" : "+"}
                      </span>
                    </button>
                    {on ? <p className="faq-a">{item.a}</p> : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-28 flex flex-col items-center gap-5 md:mt-36">
          <img
            src="/brand-mark.svg"
            alt=""
            className="brand-mark h-16 w-16 object-contain md:h-20 md:w-20"
            aria-hidden
          />
          <p className="font-display text-[clamp(2.5rem,8vw,5.5rem)] leading-none tracking-[0.14em]">
            nuro ai
          </p>
        </div>
      </div>
    </section>
  );
}
