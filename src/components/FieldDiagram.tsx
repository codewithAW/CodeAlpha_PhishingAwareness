import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

// Independent strokes keep the dots from drawing unwanted connecting lines.
const shapes = [
  [
    "M-48 -32 H48 Q54 -32 54 -26 V26 Q54 32 48 32 H-48 Q-54 32 -54 26 V-26 Q-54 -32 -48 -32 Z",
    "M-51 -27 L-5 7 Q0 11 5 7 L51 -27",
  ],
  [
    "M0 -44 A44 44 0 1 1 0 44 A44 44 0 1 1 0 -44Z",
    "M0 -44 C-31 -19 -31 19 0 44 C31 19 31 -19 0 -44Z",
    "M-43 -2 H43",
  ],
  [
    "M0 -45 C12 -37 24 -33 39 -31 V-5 Q39 26 0 47 Q-39 26 -39 -5 V-31 Q-18 -34 0 -45Z",
    "M-18 0 L-5 13 L19 -12",
  ],
  [
    "M-29 -5 H29 Q35 -5 35 1 V35 Q35 40 29 40 H-29 Q-35 40 -35 35 V1 Q-35 -5 -29 -5Z",
    "M-22 -5 V-23 A22 22 0 0 1 22 -23 V-5",
    "M0 12 V24",
  ],
];
const count = 128;
const period = 4600;
function sample(strokes: string[]) {
  const paths = strokes.map((d) => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d);
    return { path, length: path.getTotalLength() };
  });
  const total = paths.reduce((sum, p) => sum + p.length, 0);
  return Array.from({ length: count }, (_, i) => {
    let distance = ((i + 0.5) * total) / count;
    for (const { path, length } of paths) {
      if (distance <= length) return path.getPointAtLength(distance);
      distance -= length;
    }
    return paths[0].path.getPointAtLength(0);
  });
}
function frame(
  x: number,
  y: number,
  opacity: number,
  offset: number,
  easing = "linear",
) {
  return {
    transform: "translate(" + x + "px," + y + "px)",
    opacity,
    offset,
    easing,
  };
}
export function FieldDiagram() {
  const layer = useRef<SVGGElement>(null);
  const motions = useRef<Animation[]>([]);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(media.matches);
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    const dots = Array.from(layer.current!.children) as SVGCircleElement[];
    const outlines = shapes.map(sample);
    dots.forEach((dot, i) => {
      const point = outlines[0][i];
      dot.style.transform = frame(point.x, point.y, 1, 0).transform;
      if (reduced) return;
      const angle = i * 2.39996323;
      const dx = Math.cos(angle),
        dy = Math.sin(angle);
      const reach = Math.min(
        205 / Math.max(0.001, Math.abs(dx)),
        103 / Math.max(0.001, Math.abs(dy)),
      );
      const edgeX = dx * reach,
        edgeY = dy * reach;
      const lag = (i % 11) * 0.006;
      const keys: Keyframe[] = [];
      outlines.forEach((outline, k) => {
        const p = outline[(i * 37 + k * 17) % count];
        const offset = (v: number) => (k + v) / outlines.length;
        keys.push(
          frame(edgeX, edgeY, 0.18, offset(0)),
          frame(
            edgeX * 0.86 - dy * 12,
            edgeY * 0.86 + dx * 12,
            0.52,
            offset(0.08 + lag),
            "cubic-bezier(.18,.76,.2,1)",
          ),
          frame(p.x, p.y, 1, offset(0.34 + lag)),
          frame(p.x, p.y, 1, offset(0.7 + lag), "cubic-bezier(.58,0,.85,.55)"),
          frame(
            edgeX * 0.74 + dy * 17,
            edgeY * 0.74 - dx * 17,
            0.5,
            offset(0.93),
          ),
        );
      });
      keys.push(frame(edgeX, edgeY, 0.18, 1));
      const motion = dot.animate(keys, {
        duration: period * shapes.length,
        iterations: Infinity,
      });
      motions.current.push(motion);
    });
    return () => {
      motions.current.forEach((a) => a.cancel());
      motions.current = [];
    };
  }, [reduced]);
  useEffect(() => {
    const panel = layer.current!.ownerSVGElement!;
    let visible = true;
    const sync = () =>
      motions.current.forEach((a) => {
        if (paused || document.hidden || !visible) a.pause();
        else a.play();
      });
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(panel);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [paused, reduced]);
  return (
    <div className="field">
      <div className="field-cap">
        <span>Fig. 01</span>
        <span>Signal inspection</span>
      </div>
      <div className="signal-stage">
        <div className="reticle" aria-hidden="true">
          <div className="orbit o1" />
          <div className="orbit o2" />
        </div>
        <svg
          className="signal-dots"
          role="img"
          aria-label={
            reduced
              ? "An envelope drawn in mint dots"
              : "Particles forming an envelope, globe, shield and padlock"
          }
          viewBox="-205 -105 410 210"
        >
          <g ref={layer}>
            {Array.from({ length: count }, (_, i) => (
              <circle
                key={i}
                r={i % 5 === 0 ? 1.55 : 1.28}
                fill={i % 4 === 0 ? "#86d9b0" : "#c8f8d8"}
              />
            ))}
          </g>
        </svg>
      </div>
      <div className="field-foot">
        <span>Phishing awareness</span>
        {!reduced && (
          <button
            className="motion-toggle"
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Play icon animation" : "Pause icon animation"}
          >
            {paused ? <Play size={14} /> : <Pause size={14} />}
          </button>
        )}
      </div>
    </div>
  );
}
