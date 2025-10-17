import { useEffect, useMemo, useRef, useState } from "react";
import "./index.css";
import "./App.css";

const NAV = [
  { href: "#about", label: "About" },
  { href: "#infinimatch", label: "Infinimatch" },
  { href: "#redmesa", label: "Red Mesa" },
  { href: "#dialdynamics", label: "DialDynamics" },
  { href: "#contact", label: "Contact" },
];

function useProgress() {
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      h.style.setProperty("--scroll", String(scrolled));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
}

function useReveals() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => e.isIntersecting && e.target.classList.add("in")
        ),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useScrollSpy(ids) {
  const [active, setActive] = useState("");
  useEffect(() => {
    const sections = ids
      .map((id) => document.querySelector(id))
      .filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive("#" + visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

function useThemeSwap(map) {
  // map: [{id, theme}]
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries.find((en) => en.isIntersecting);
        if (!e) return;
        const theme = map.find((m) => m.id === e.target.id)?.theme;
        if (theme) document.body.setAttribute("data-theme", theme);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0.3 }
    );
    map.forEach((m) => {
      const el = document.getElementById(m.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [map]);
}

function useAutoPlayVideos(selectors) {
  useEffect(() => {
    const vids = Array.from(document.querySelectorAll(selectors));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const v = e.target;
          if (!(v instanceof HTMLVideoElement)) return;
          if (e.isIntersecting) {
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        });
      },
      { threshold: 0.6 }
    );
    vids.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, [selectors]);
}

export default function App() {
  useProgress();
  useReveals();
  const active = useScrollSpy([
    "#about",
    "#infinimatch",
    "#redmesa",
    "#dialdynamics",
    "#contact",
  ]);
  useThemeSwap([
    { id: "infinimatch", theme: "infinimatch" },
    { id: "redmesa", theme: "redmesa" },
    { id: "dialdynamics", theme: "dialdynamics" },
  ]);
  useAutoPlayVideos("section video");

  return (
    <>
      {/* Scroll progress */}
      <div className="progress" aria-hidden />

      {/* Sticky Nav */}
      <div className="nav">
        <div className="container nav-inner">
          <div className="brand">Khalaf El Wadya</div>
          <nav>
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className={active === n.href ? "active" : ""}
                aria-label={n.label}
              >
                {n.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Hero */}
      <header className="container section" id="top">
        <div className="hero">
          <div className="reveal" data-slow>
            <div className="kicker">Full-Stack Engineer • Product-minded</div>
            <h1 className="h1">
              Design-level engineering for teams that demand polish & velocity.
            </h1>
            <p className="lead">
              Angular & React front-ends. Serverless on AWS. Clean data flows.
              Thoughtful details that feel inevitable.
            </p>
            <div className="actions" style={{ marginTop: 18 }}>
              <a
                className="btn primary"
                href="/resume.pdf"
                target="_blank"
                rel="noreferrer"
              >
                Download Résumé
              </a>
              <a className="btn" href="#infinimatch">
                View Projects
              </a>
            </div>
          </div>
          <div className="hero-media reveal" aria-label="Portrait">
            {/* Replace with your real photo */}
            <img
              src="https://picsum.photos/880/1100?grayscale"
              alt="Portrait"
            />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container">
        {/* About */}
        <section id="about" className="section anchor reveal">
          <h2>About</h2>
          <p
            className="lead"
            style={{ color: "var(--muted)", maxWidth: "70ch", marginTop: 8 }}
          >
            Brief positioning statement about your craft and philosophy. Keep it
            high-signal and product-oriented. Mention the outcomes you drive,
            not just tools.
          </p>
        </section>

        {/* Infinimatch */}
        <section id="infinimatch" className="section anchor">
          <h2 className="reveal">Infinimatch</h2>
          <div className="project reveal">
            <div className="project-media reveal" data-slow>
              <video
                playsInline
                muted
                controls
                poster="https://picsum.photos/1280/800?random=11"
              >
                <source src="/media/infinimatch-demo.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="project-body reveal">
              <h3>Personalized Discovery Engine</h3>
              <p>
                One-line elevator pitch. A few sentences of concise, confident
                description—what it is, who it’s for, and the measurable
                benefit.
              </p>
              <div className="pills">
                {["React", "TypeScript", "API integration", "Analytics"].map(
                  (t) => (
                    <span className="pill" key={t}>
                      {t}
                    </span>
                  )
                )}
              </div>
              <div className="actions">
                <a
                  className="btn"
                  href="https://github.com/kelwa413"
                  target="_blank"
                  rel="noreferrer"
                >
                  Code
                </a>
                <a className="btn" href="#" aria-disabled>
                  Live Demo
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Red Mesa */}
        <section id="redmesa" className="section anchor">
          <h2 className="reveal">Red Mesa</h2>
          <div className="project flip reveal">
            <div className="project-media reveal" data-slow>
              <video
                playsInline
                muted
                controls
                poster="https://picsum.photos/1280/800?random=22"
              >
                <source src="/media/redmesa-demo.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="project-body reveal">
              <h3>Custom Recommendation Engines</h3>
              <p>
                Focused on rapid integration and measurable lift for startup
                funnels. Talk outcomes: CTR, retention, conversion, revenue.
              </p>
              <div className="pills">
                {["Python", "FastAPI", "Postgres", "Docker"].map((t) => (
                  <span className="pill" key={t}>
                    {t}
                  </span>
                ))}
              </div>
              <div className="actions">
                <a
                  className="btn"
                  href="https://github.com/kelwa413"
                  target="_blank"
                  rel="noreferrer"
                >
                  Code
                </a>
                <a className="btn" href="#" aria-disabled>
                  Case Study
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* DialDynamics */}
        <section id="dialdynamics" className="section anchor">
          <h2 className="reveal">DialDynamics</h2>
          <div className="project reveal">
            <div className="project-media reveal" data-slow>
              <video
                playsInline
                muted
                controls
                poster="https://picsum.photos/1280/800?random=33"
              >
                <source src="/media/dialdynamics-demo.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="project-body reveal">
              <h3>AI-Aided Cold-Calling Trainer</h3>
              <p>
                A clear single paragraph that sells the problem, solution, and
                result. Keep it buyer-friendly: what changed for users after
                adopting it?
              </p>
              <div className="pills">
                {["Next.js/React", "Node", "Scoring engine", "UX research"].map(
                  (t) => (
                    <span className="pill" key={t}>
                      {t}
                    </span>
                  )
                )}
              </div>
              <div className="actions">
                <a
                  className="btn"
                  href="https://github.com/kelwa413"
                  target="_blank"
                  rel="noreferrer"
                >
                  Code
                </a>
                <a className="btn" href="#" aria-disabled>
                  Live Demo
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="section anchor reveal">
          <h2>Contact</h2>
          <p className="lead" style={{ color: "var(--muted)" }}>
            Open to roles where quality and velocity matter. Prefer
            product-focused teams.
          </p>
          <div className="actions" style={{ marginTop: 12 }}>
            <a className="btn primary" href="mailto:khalafelwadya@example.com">
              Email me
            </a>
            <a
              className="btn"
              href="https://github.com/kelwa413"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <a
              className="btn"
              href="https://linkedin.com/in/khalafelwadya"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        © {new Date().getFullYear()} Khalaf El Wadya — Built with intent.
      </footer>
    </>
  );
}
