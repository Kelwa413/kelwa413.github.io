import { useEffect, useRef, useState } from "react";
import "./ModalCarousel.css";

export default function Carousel({
  images = [],
  interval = 4000,
  controls = false,
  className = "",
}) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);
  const wrapRef = useRef(null);

  const len = images.length;

  const clear = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const start = () => {
    clear();
    if (interval > 0 && len > 1) {
      timerRef.current = setTimeout(() => {
        setIndex((i) => (i + 1) % len);
      }, interval);
    }
  };

  // restart timer whenever slide changes or interval changes
  useEffect(() => {
    start();
    return clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, interval, len]);

  // pause on hover; resume on leave
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onEnter = () => clear();
    const onLeave = () => start();
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [len, interval]);

  // handlers that CLEAR first, then navigate
  const go = (i) => {
    clear();
    setIndex(((i % len) + len) % len);
  };
  const next = () => go(index + 1);
  const prev = () => go(index - 1);

  return (
    <div className={`carousel ${className}`} ref={wrapRef}>
      {images.map((src, i) => (
        <img
          key={src || i}
          src={src}
          alt=""
          className={`slide ${i === index ? "active" : ""}`}
          loading="lazy"
          draggable="false"
        />
      ))}

      {controls && len > 1 && (
        <>
          <button
            className="carousel__btn prev"
            type="button"
            onClick={prev}
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            className="carousel__btn next"
            type="button"
            onClick={next}
            aria-label="Next slide"
          >
            ›
          </button>
        </>
      )}

      {len > 1 && (
        <div className="carousel__dots">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`dot ${i === index ? "on" : ""}`}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => go(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
