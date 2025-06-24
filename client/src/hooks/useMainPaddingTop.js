import { useEffect } from "react";

export default function useMainPaddingTop() {
  useEffect(() => {
    const header = document.querySelector(".main-header");
    const main = document.querySelector("main");

    if (!header || !main) return;

    const setPaddingTop = () => {
      main.style.paddingTop = `${header.offsetHeight}px`;
    };

    setPaddingTop();

    // Observe changes to header's size
    const observer = new ResizeObserver(() => {
      setPaddingTop();
    });

    observer.observe(header);

    return () => observer.disconnect();
  }, []);
}
