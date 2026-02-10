import { useEffect, useRef, useState } from "react";
import explosao from "./arte/Boom.mp4";

export function ExplosaoVideo({ onFinish }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let animationId;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    video.play();

    function draw() {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = frame.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        if (g > 120 && g > r * 1.2 && g > b * 1.2) {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(frame, 0, 0);
      animationId = requestAnimationFrame(draw);
    }

    draw();

    // ⏳ Trigger fade 2 seconds before end
    video.ontimeupdate = () => {
      if (
        video.duration &&
        video.currentTime >= video.duration - 2
      ) {
        setFadeOut(true);
      }
    };

    video.onended = () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      onFinish?.();
    };

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [onFinish]);

  return (
    <>
      <video
        ref={videoRef}
        src={explosao}
        style={{ display: "none" }}
        playsInline
      />

      <canvas
        ref={canvasRef}
        className={`ascensao-canvas ${fadeOut ? "fade-out" : ""}`}
      />
    </>
  );
}
