import { useEffect, useRef } from "react";

const MemoryFlowBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrameId = 0;

    const center = {
      x: width / 2,
      y: height / 2,
    };

    const PATH_COUNT = 70;

    type Particle = {
      t: number;
      speed: number;
    };

    type FlowPath = {
      side: "left" | "right";
      startYRatio: number;
      particle: Particle;
    };

    const paths: FlowPath[] = [];

    for (let i = 0; i < PATH_COUNT; i++) {
      paths.push({
        side: i % 2 === 0 ? "left" : "right",

        startYRatio:
          i / PATH_COUNT +
          (Math.random() - 0.5) * 0.03,

        particle: {
          t: Math.random(),
          speed: 0.001 + Math.random() * 0.0015,
        },
      });
    }

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      center.x = width / 2;
      center.y = height / 2;
    };

    const cubicBezier = (
      t: number,
      p0: { x: number; y: number },
      p1: { x: number; y: number },
      p2: { x: number; y: number },
      p3: { x: number; y: number }
    ) => {
      const u = 1 - t;

      return {
        x:
          u * u * u * p0.x +
          3 * u * u * t * p1.x +
          3 * u * t * t * p2.x +
          t * t * t * p3.x,

        y:
          u * u * u * p0.y +
          3 * u * u * t * p1.y +
          3 * u * t * t * p2.y +
          t * t * t * p3.y,
      };
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      paths.forEach((path) => {
        const isLeft = path.side === "left";

        const startY =
          path.startYRatio * height -
          height * 0.05;

        const p0 = {
          x: isLeft ? -50 : width + 50,
          y: startY,
        };

        const p1 = {
          x: isLeft
            ? width * 0.24
            : width * 0.76,
          y: startY,
        };

        const p2 = {
          x: isLeft
            ? width * 0.38
            : width * 0.62,
          y: center.y,
        };

        const p3 = {
          x: center.x,
          y: center.y,
        };

        ctx.beginPath();

        ctx.moveTo(p0.x, p0.y);

        ctx.bezierCurveTo(
          p1.x,
          p1.y,
          p2.x,
          p2.y,
          p3.x,
          p3.y
        );

        ctx.strokeStyle = "rgba(255,255,255,0.10)";
        ctx.lineWidth = 0.7;

        ctx.setLineDash([1, 6]);

        ctx.stroke();

        ctx.setLineDash([]);

        path.particle.t += path.particle.speed;

        if (path.particle.t > 1) {
          path.particle.t = 0;
        }

        const particlePosition = cubicBezier(
          path.particle.t,
          p0,
          p1,
          p2,
          p3
        );

        const fade =
          0.2 +
          path.particle.t * 0.8;

        ctx.fillStyle = `rgba(255,255,255,${fade})`;

        ctx.beginPath();

        ctx.arc(
          particlePosition.x,
          particlePosition.y,
          1.4,
          0,
          Math.PI * 2
        );

        ctx.fill();
      });

      // central memory core
      const pulse =
        3 +
        Math.sin(Date.now() * 0.002) * 0.8;

      ctx.beginPath();

      ctx.arc(
        center.x,
        center.y,
        pulse,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = "rgba(255,255,255,0.85)";

      ctx.shadowBlur = 16;
      ctx.shadowColor = "rgba(255,255,255,0.4)";

      ctx.fill();

      ctx.shadowBlur = 0;

      animationFrameId =
        requestAnimationFrame(render);
    };

    resizeCanvas();

    window.addEventListener(
      "resize",
      resizeCanvas
    );

    render();

    return () => {
      window.removeEventListener(
        "resize",
        resizeCanvas
      );

      cancelAnimationFrame(
        animationFrameId
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
};

export default MemoryFlowBackground;