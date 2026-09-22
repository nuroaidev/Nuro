import { useEffect, useRef } from "react";

/** Conway's Game of Life — same class of hero motion as ArbiStocks, Nuro-colored. */
const CELL = 11;
const TICK = 140;

const GLIDER = [
  [0, 1, 0],
  [0, 0, 1],
  [1, 1, 1],
];

function stamp(grid: Uint8Array, cols: number, rows: number, pattern: number[][], x: number, y: number) {
  for (let r = 0; r < pattern.length; r++) {
    for (let c = 0; c < pattern[r].length; c++) {
      if (!pattern[r][c]) continue;
      const yy = (y + r + rows) % rows;
      const xx = (x + c + cols) % cols;
      grid[yy * cols + xx] = 1;
    }
  }
}

export function LifeField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cols = 0;
    let rows = 0;
    let grid = new Uint8Array(0);
    let next = new Uint8Array(0);
    let raf = 0;
    let last = 0;
    let running = true;

    const color = () =>
      getComputedStyle(document.documentElement).getPropertyValue("--life-cell").trim() ||
      "rgba(126,214,255,0.55)";

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.max(8, Math.floor(w / CELL));
      rows = Math.max(8, Math.floor(h / CELL));
      grid = new Uint8Array(cols * rows);
      next = new Uint8Array(cols * rows);
      for (let i = 0; i < grid.length; i++) grid[i] = Math.random() < 0.16 ? 1 : 0;
      stamp(grid, cols, rows, GLIDER, 4, 4);
      stamp(grid, cols, rows, GLIDER, Math.floor(cols * 0.62), Math.floor(rows * 0.28));
      stamp(grid, cols, rows, GLIDER, Math.floor(cols * 0.38), Math.floor(rows * 0.7));
    };

    const step = () => {
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let n = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue;
              const yy = (y + dy + rows) % rows;
              const xx = (x + dx + cols) % cols;
              n += grid[yy * cols + xx];
            }
          }
          const alive = grid[y * cols + x] === 1;
          next[y * cols + x] = (alive && (n === 2 || n === 3)) || (!alive && n === 3) ? 1 : 0;
        }
      }
      const tmp = grid;
      grid = next;
      next = tmp;
    };

    const paint = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color();
      const cw = w / cols;
      const ch = h / rows;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          if (!grid[y * cols + x]) continue;
          ctx.fillRect(x * cw + 1, y * ch + 1, cw - 2, ch - 2);
        }
      }
    };

    const loop = (t: number) => {
      if (!running) return;
      if (!last || t - last >= TICK) {
        if (!reduced) step();
        paint();
        last = t;
      }
      raf = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    paint();
    if (!reduced) raf = requestAnimationFrame(loop);

    const onTheme = () => paint();
    const obs = new MutationObserver(onTheme);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      obs.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}
