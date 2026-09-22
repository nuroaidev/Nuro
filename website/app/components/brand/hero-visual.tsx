import { LifeField } from "./life-field";

/** Hero field: living lattice, no photograph. */
export function HeroVisual() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <LifeField />
      <div className="hero-scrim absolute inset-0" />
    </div>
  );
}
