import { useEffect, useRef } from "react";

/**
 * Random 1px stipple with two denser clouds — the ArbiStocks field, in Nuro ink.
 */
const STEP = 1.22;
const CLOUDS = [
  { x: 0.26, y: 0.38, r: 0.38 },
  { x: 0.78, y: 0.64, r: 0.36 },
];

function density(nx: number, ny: number) {
  let d = 0.2;
  for (const c of CLOUDS) {
    const dx = (nx - c.x) / c.r;
    const dy = (ny - c.y) / (c.r * 0.88);
    d += 0.74 * Math.exp(-(dx * dx + dy * dy) * 1.85);
  }
  return Math.min(0.96, d);
}

function rng(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function parseInk(raw: string): [number, number, number, number] {
  const m = raw.match(
    /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/,
  );
  if (!m) return [12, 12, 12, 0.8];
  return [Number(m[1]), Number(m[2]), Number(m[3]), m[4] === undefined ? 1 : Number(m[4])];
}

export function StippleField({ seed = 0x9e3779b9 }: { seed?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const paint = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w < 2 || h < 2) return;
      const pw = Math.floor(w * dpr);
      const ph = Math.floor(h * dpr);
      canvas.width = pw;
      canvas.height = ph;
      const [r, g, b, a] = parseInk(
        getComputedStyle(canvas).getPropertyValue("--stipple-ink").trim() ||
          "rgba(12,12,12,0.8)",
      );
      const img = ctx.createImageData(pw, ph);
      const data = img.data;
      const rand = rng(seed);
      const step = Math.max(1, STEP * dpr);
      for (let y = 0; y < ph; y += step) {
        for (let x = 0; x < pw; x += step) {
          const jx = Math.min(pw - 1, Math.floor(x + rand() * step));
          const jy = Math.min(ph - 1, Math.floor(y + rand() * step));
          if (rand() >= density(jx / pw, jy / ph)) continue;
          const i = (jy * pw + jx) * 4;
          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;
          data[i + 3] = Math.round(a * 255);
        }
      }
      ctx.putImageData(img, 0, 0);
    };

    const ro = new ResizeObserver(paint);
    ro.observe(canvas);
    paint();
    const mo = new MutationObserver(paint);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => {
      ro.disconnect();
      mo.disconnect();
    };
  }, [seed]);

  return <canvas ref={canvasRef} className="os-field-noise" aria-hidden />;
}
