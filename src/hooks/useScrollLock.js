import { useEffect } from "react";

export default function useScrollLock(locked) {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (locked) {
      html.classList.add("no-scroll");
      body.classList.add("no-scroll");
    } else {
      html.classList.remove("no-scroll");
      body.classList.remove("no-scroll");
    }

    return () => {
      html.classList.remove("no-scroll");
      body.classList.remove("no-scroll");
    };
  }, [locked]);
}
