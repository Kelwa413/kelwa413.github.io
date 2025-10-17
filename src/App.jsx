import { useEffect, useMemo, useRef, useState } from "react";
import "./index.css";
import "./App.css";
import Carousel from "./components/Carousel.jsx";
import Modal from "./components/Modal.jsx";

const NAV = [
  { href: "#about", label: "About" },
  { href: "#infinimatch", label: "Infinimatch" },
  { href: "#redmesa", label: "Red Mesa" },
  { href: "#dialdynamics", label: "DialDynamics" },
  { href: "#planty", label: "Planty" },
  { href: "#csi", label: "CSI Dry Eye" },
  { href: "#contact", label: "Contact" },
];

const RED_IMAGES = [
  "/redmesa/redmesa1.png",
  "/redmesa/redmesa2.png",
  "/redmesa/redmesa3.png",
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

function useScrollSpy(ids, offset = 84) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const sects = ids.map((sel) => document.querySelector(sel)).filter(Boolean);

    const compute = () => {
      const mid = window.innerHeight / 2;
      let best = { id: ids[0], d: Infinity };

      for (const el of sects) {
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.top - offset - mid);
        if (d < best.d) best = { id: `#${el.id}`, d };
      }
      setActive(best.id);
    };

    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    window.addEventListener("hashchange", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
      window.removeEventListener("hashchange", compute);
    };
  }, [ids, offset]);

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
  const [csiOpen, setCsiOpen] = useState(false);
  const [redOpen, setRedOpen] = useState(false);

  useProgress();
  useReveals();
  const active = useScrollSpy(
    [
      "#about",
      "#infinimatch",
      "#redmesa",
      "#dialdynamics",
      "#planty",
      "#csi",
      "#contact",
    ],
    84
  );
  useThemeSwap([
    { id: "infinimatch", theme: "infinimatch" },
    { id: "redmesa", theme: "redmesa" },
    { id: "dialdynamics", theme: "dialdynamics" },
    { id: "csi", theme: "csi" },
  ]);
  useAutoPlayVideos("section video");

  return (
    <>
      {/* Scroll progress */}
      <div className="progress" aria-hidden />

      {/* Sticky Nav */}
      <div className="nav">
        <div className="container nav-inner">
          <div className="brand">Khalaf Elwadya</div>
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
            <img src="src\assets\headshot2bw.jpeg" alt="Portrait" />
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
            I’m a full-stack developer passionate about turning ideas into real,
            usable products. Over the past few years, I’ve co-founded startups,
            helped launch apps from whiteboard sketches, and built production
            systems from client conversations alone. I love the challenge of
            taking an early concept, translating it into a working prototype,
            and scaling it into something people actually use.
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
                A mobile app that uses AI to recommend movies. Built from a
                whiteboard sketch to a beta-tested app on TestFlight.
              </p>
              <div className="pills">
                {[
                  "Angular",
                  "Ionic",
                  "TypeScript",
                  "API integration",
                  "AI/ML",
                  "UX design",
                  "App development",
                ].map((t) => (
                  <span className="pill" key={t}>
                    {t}
                  </span>
                ))}
              </div>
              <div className="actions">
                <a
                  className="btn primary"
                  href="https://infinimatch.app/"
                  target="_blank"
                  rel="noreferrer"
                >
                  View Website
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Red Mesa */}
        <section id="redmesa" className="section anchor">
          <h2 className="reveal">Red Mesa</h2>

          <div className="project flip reveal">
            {/* Clickable media opens modal */}
            <div
              className="project-media reveal clickable"
              data-slow
              role="button"
              tabIndex={0}
              onClick={() => setRedOpen(true)}
              onKeyDown={(e) => e.key === "Enter" && setRedOpen(true)}
            >
              <Carousel interval={4000} images={RED_IMAGES} />
            </div>

            <div className="project-body reveal">
              <h3>Custom Recommendation Engines</h3>
              <p>
                Focused on rapid integration and measurable lift for startup
                funnels. Talk outcomes: CTR, retention, conversion, revenue.
              </p>
              <div className="pills">
                {[
                  "Python",
                  "TensorFlow",
                  "Project Management",
                  "Requirements Gathering",
                ].map((t) => (
                  <span className="pill" key={t}>
                    {t}
                  </span>
                ))}
              </div>
              <div className="actions">
                <a
                  className="btn primary"
                  href="https://redmesa.dev/"
                  target="_blank"
                  rel="noreferrer"
                >
                  View Website
                </a>
              </div>
            </div>
          </div>
        </section>

        <Modal open={redOpen} onClose={() => setRedOpen(false)}>
          <div className="lightbox">
            <Carousel interval={5000} controls images={RED_IMAGES} />
          </div>
        </Modal>

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
                <source src="public/dialdynamics-demo.mp4" type="video/mp4" />
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

        {/* Hackathon Win — Planty */}
        <section id="planty" className="section anchor">
          <h2 className="reveal">Hackathon Win — Planty</h2>
          <div className="project flip reveal">
            <div className="project-media portrait fit reveal" data-slow>
              <video
                playsInline
                muted
                controls
                preload="metadata"
                poster="/media/planty-thumb.png"
              >
                <source src="/hackathon-video.mp4" type="video/mp4" />
              </video>
            </div>

            <div className="project-body reveal">
              <h3>🏆 MRU Hacks 2025 — “Planty”</h3>
              <p>
                A real LEGO plant that reacts to your habits — stay consistent
                and it thrives, fall off and it droops. Built in 24 hours with
                zero hardware experience; won first place out of over 100
                participants.
              </p>
              <div className="pills">
                {["Arduino", "Python", "LEGO", "Hardware", "Raspberry Pi"].map(
                  (t) => (
                    <span className="pill" key={t}>
                      {t}
                    </span>
                  )
                )}
              </div>
              <div className="actions">
                <a
                  className="btn primary"
                  href="https://github.com/kelwa413/Planty"
                  target="_blank"
                  rel="noreferrer"
                >
                  View GitHub Repo
                </a>
                <a className="btn" href="#" aria-disabled>
                  Demo Video
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CSI Dry Eye section */}
        <section id="csi" className="section anchor">
          <h2 className="reveal">CSI Dry Eye</h2>

          <div className="project reveal">
            {/* Clickable media opens modal */}
            <div
              className="project-media reveal clickable"
              data-slow
              role="button"
              tabIndex={0}
              onClick={() => setCsiOpen(true)}
              onKeyDown={(e) => e.key === "Enter" && setCsiOpen(true)}
            >
              <Carousel
                interval={4000}
                images={[
                  "/csi/csi-dashboard.png",
                  "/csi/csi-invoice-create.png",
                  "/csi/csi-invoice-export.png",
                  "/csi/csi-packages.png",
                  "/csi/csi-pricing.png",
                  "/csi/csi-treatment-plan.png",
                  "/csi/csi-treatment-plan-status.png",
                ]}
              />
            </div>

            <div className="project-body reveal">
              <h3>Clinical SaaS for Dry Eye Workflows</h3>
              <p>
                CSI Dry Eye is a clinical SaaS platform for ophthalmology
                practices, supporting assessments, invoicing, and treatment
                planning. I design and implement full-stack features across
                Angular and AWS to optimize reliability and clinic efficiency.
              </p>

              <div className="pills">
                {[
                  "Angular",
                  "TypeScript",
                  "AWS Lambda",
                  "DynamoDB",
                  "UX Design",
                ].map((t) => (
                  <span className="pill" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CSI modal lightbox */}
        <Modal open={csiOpen} onClose={() => setCsiOpen(false)}>
          <div className="lightbox">
            <Carousel
              interval={5000}
              controls
              images={[
                "/csi/csi-dashboard.png",
                "/csi/csi-invoice-create.png",
                "/csi/csi-invoice-export.png",
                "/csi/csi-packages.png",
                "/csi/csi-pricing.png",
                "/csi/csi-treatment-plan.png",
                "/csi/csi-treatment-plan-status.png",
              ]}
            />
          </div>
        </Modal>

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
