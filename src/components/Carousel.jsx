import { useEffect, useRef, useState } from "react";

export default function Carousel({
  images = [],
  interval = 4000,
  controls = false,
}) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    if (!images.length) return;

    const start = () => {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setIndex((i) => (i + 1) % images.length);
      }, interval);
    };
    const stop = () => clearInterval(timerRef.current);

    start();
    const el = carouselRef.current;
    el?.addEventListener("mouseenter", stop);
    el?.addEventListener("mouseleave", start);
    return () => {
      stop();
      el?.removeEventListener("mouseenter", stop);
      el?.removeEventListener("mouseleave", start);
    };
  }, [images.length, interval]);

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div className="carousel" ref={carouselRef}>
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className={`slide ${i === index ? "active" : ""}`}
        />
      ))}
      {controls && (
        <>
          <button
            className="carousel__ctrl left"
            onClick={prev}
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            className="carousel__ctrl right"
            onClick={next}
            aria-label="Next slide"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}
