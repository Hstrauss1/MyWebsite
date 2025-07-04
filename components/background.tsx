/* components/Background.tsx */
"use client";

import { useEffect, useState, ReactNode } from "react";

const TILE = 300;

type Props = { children: ReactNode };

export default function Background({ children }: Props) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  /* sync with <html data-theme> */
  useEffect(() => {
    const sync = () =>
      setTheme(
        (document.documentElement.getAttribute("data-theme") as
          | "dark"
          | "light") ?? "light"
      );

    sync();
    const mo = new MutationObserver(sync);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => mo.disconnect();
  }, []);

  const img =
    theme === "dark" ? "/images/dark-pattern.svg" : "/images/pattern.svg";

  /* build the CSS string once per theme change */
  const css = `
    body::before {
      content: "";
      position: fixed;
      inset: 0;
      z-index: -1;
      pointer-events: none;
      background-image: url(${img}), url(${img});
      background-size: ${200}px ${TILE}px;
      background-position: 0 0, ${TILE / 2}px ${TILE / 2}px;
      background-repeat: repeat;
      opacity: .1;
    }
  `;

  return (
    <>
      {/* inject the background-painting rule */}
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {/* relay whatever was placed between <Background>…</Background> */}
      {children}
    </>
  );
}
