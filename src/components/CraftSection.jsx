import { useEffect, useRef, useState } from "react";

const CODE_LINES = [
  { tokens: [{ type: "cm", text: "// How this site was built" }] },
  { tokens: [] },
  {
    tokens: [
      { type: "kw", text: "const " },
      { type: "fn", text: "approach" },
      { type: "op", text: " = " },
      { type: "str", text: '"constraints first"' },
    ],
  },
  { tokens: [] },
  {
    tokens: [
      { type: "kw", text: "function " },
      { type: "fn", text: "buildProduct" },
      { type: "", text: "(" },
      { type: "type", text: "idea" },
      { type: "", text: ") {" },
    ],
  },
  {
    tokens: [
      { type: "", text: "  " },
      { type: "kw", text: "const " },
      { type: "", text: "scope " },
      { type: "op", text: "= " },
      { type: "fn", text: "defineOutcome" },
      { type: "", text: "(idea)" },
    ],
  },
  {
    tokens: [
      { type: "", text: "  " },
      { type: "kw", text: "const " },
      { type: "", text: "constraints " },
      { type: "op", text: "= " },
      { type: "", text: "[" },
      { type: "str", text: '"a11y"' },
      { type: "", text: ", " },
      { type: "str", text: '"perf"' },
      { type: "", text: ", " },
      { type: "str", text: '"no regressions"' },
      { type: "", text: "]" },
    ],
  },
  { tokens: [] },
  {
    tokens: [
      { type: "", text: "  " },
      { type: "cm", text: "// Ship the smallest thing that works" },
    ],
  },
  {
    tokens: [
      { type: "", text: "  " },
      { type: "kw", text: "const " },
      { type: "", text: "solution " },
      { type: "op", text: "= " },
      { type: "fn", text: "iterate" },
      { type: "", text: "(scope, constraints)" },
    ],
  },
  { tokens: [] },
  {
    tokens: [
      { type: "", text: "  " },
      { type: "kw", text: "return " },
      { type: "fn", text: "deploy" },
      { type: "", text: "(solution, {" },
    ],
  },
  {
    tokens: [
      { type: "", text: "    " },
      { type: "prop", text: "monitored" },
      { type: "", text: ": " },
      { type: "num", text: "true" },
      { type: "", text: "," },
    ],
  },
  {
    tokens: [
      { type: "", text: "    " },
      { type: "prop", text: "reversible" },
      { type: "", text: ": " },
      { type: "num", text: "true" },
      { type: "", text: "," },
    ],
  },
  {
    tokens: [
      { type: "", text: "    " },
      { type: "prop", text: "featureFlagged" },
      { type: "", text: ": " },
      { type: "num", text: "true" },
    ],
  },
  { tokens: [{ type: "", text: "  })" }] },
  { tokens: [{ type: "", text: "}" }] },
];

const METRICS = [
  { value: "5", label: "Shipped Products" },
  { value: "1st", label: "Hackathon Finish" },
  { value: "4", label: "Industries Shipped In" },
];

function CodeLine({ tokens, visible, delay }) {
  return (
    <div
      className={`craft-code-line ${visible ? "visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {tokens.length === 0 ? (
        "\u00A0"
      ) : (
        tokens.map((token, i) => (
          <span key={i} className={token.type || undefined}>
            {token.text}
          </span>
        ))
      )}
    </div>
  );
}

export default function CraftSection() {
  const sectionRef = useRef(null);
  const [visibleLines, setVisibleLines] = useState(0);
  const [metricsVisible, setMetricsVisible] = useState(false);
  const [gradientsVisible, setGradientsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setVisibleLines(CODE_LINES.length);
      setMetricsVisible(true);
      setGradientsVisible(true);
      return;
    }

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;

      // How far through the section we've scrolled (0 to 1)
      const scrolled = Math.max(
        0,
        Math.min(1, (viewportHeight - rect.top) / (sectionHeight + viewportHeight))
      );

      // Start showing code lines after 15% scroll, finish at 65%
      const codeProgress = Math.max(0, Math.min(1, (scrolled - 0.15) / 0.5));
      const linesToShow = Math.floor(codeProgress * CODE_LINES.length);
      setVisibleLines(linesToShow);

      // Show gradients when section comes into view
      setGradientsVisible(scrolled > 0.05);

      // Show metrics after code is mostly visible
      setMetricsVisible(codeProgress > 0.85);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="craft" className="craft-section section" ref={sectionRef}>
      <div className="craft-sticky">
        <div className="craft-bg" aria-hidden>
          <div
            className={`craft-bg-gradient craft-bg-gradient--blue ${gradientsVisible ? "visible" : ""}`}
          />
          <div
            className={`craft-bg-gradient craft-bg-gradient--purple ${gradientsVisible ? "visible" : ""}`}
          />
        </div>

        <p className="eyebrow reveal" style={{ color: "var(--accent)", position: "relative" }}>
          How I Work
        </p>
        <h2
          className="headline-md reveal"
          style={{ maxWidth: "20ch", marginBottom: 12, position: "relative" }}
        >
          Good software shows its thinking.
        </h2>
        <p
          className="body-md reveal"
          style={{ maxWidth: "44ch", position: "relative" }}
        >
          Constraints before features. Decisions before code. Then iterate until it holds.
        </p>

        <div className="craft-code-window" style={{ position: "relative" }}>
          <div className="craft-code-titlebar">
            <span className="craft-code-dot craft-code-dot--red" />
            <span className="craft-code-dot craft-code-dot--yellow" />
            <span className="craft-code-dot craft-code-dot--green" />
            <span className="craft-code-filename">approach.js</span>
          </div>
          <div className="craft-code-body">
            {CODE_LINES.map((line, i) => (
              <CodeLine
                key={i}
                tokens={line.tokens}
                visible={i < visibleLines}
                delay={i * 30}
              />
            ))}
          </div>
        </div>

        <div className="craft-metrics" style={{ position: "relative" }}>
          {METRICS.map((metric, i) => (
            <div
              key={metric.label}
              className={`craft-metric ${metricsVisible ? "visible" : ""}`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="craft-metric-value">
                {metric.value}
                {metric.suffix && (
                  <span style={{ color: "var(--accent)", fontSize: "0.7em" }}>
                    {metric.suffix}
                  </span>
                )}
              </div>
              <div className="craft-metric-label">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
