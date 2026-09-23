/** The centered assistant mascot — the Nuro mark inside a soft liquid-glass
 * glow, echoing the reference composition but on-brand. */
export function AssistantMascot({ size = 116 }: { size?: number }) {
  return (
    <div
      className="relative grid place-items-center"
      style={{ width: size, height: size }}
    >
      <div className="assistant-glow absolute inset-0 rounded-full blur-2xl" aria-hidden />
      <div
        className="assistant-orb relative grid place-items-center rounded-full"
        style={{ width: size * 0.82, height: size * 0.82 }}
      >
        <img
          src="/brand-mark.svg"
          alt="Nuro"
          className="brand-mark object-contain"
          style={{ width: size * 0.5, height: size * 0.5 }}
        />
      </div>
    </div>
  );
}
