import { useEffect, useState } from "react";
import "./index.css";
import "./App.css";
import Carousel from "./components/Carousel.jsx";
import Modal from "./components/Modal.jsx";
import CraftSection from "./components/CraftSection.jsx";

/* ── Data ─────────────────────────────────────────────── */

const NAV_LINKS = [
  { href: "#work", label: "Work" },
  { href: "#craft", label: "Craft" },
  { href: "#contact", label: "Contact" },
];

const PROJECTS = [
  {
    id: "infinimatch",
    eyebrow: "Mobile App",
    name: "Infinimatch",
    tagline: "AI-powered movie discovery that learns what you love.",
    description:
      "A native mobile app where every swipe trains a recommendation model. Built from first prototype to TestFlight beta — each session gets smarter than the last.",
    stack: ["Angular", "Ionic", "TypeScript", "AI/ML", "TestFlight"],
    link: { url: "https://infinimatch.app/", label: "Visit Infinimatch" },
    images: [
      "/infinimatch/infinimatch-left.png",
      "/infinimatch/infinimatch-right.png",
      "/infinimatch/infinimatch-swiper.png",
      "/infinimatch/infinimatch-expanded.png",
      "/infinimatch/infinimatch-liked.png",
      "/infinimatch/infinimatch-review.png",
      "/infinimatch/infinimatch-profile.png",
    ],
    portrait: true,
    accent: "#2997ff",
  },
  {
    id: "redmesa",
    eyebrow: "AI Consulting",
    name: "Red Mesa",
    tagline: "Custom models built to fit your data.",
    description:
      "Tailored machine learning solutions — not off-the-shelf. Built for specific data, infrastructure, and workflows. Deployable on-prem or cloud.",
    stack: ["Python", "TensorFlow", "Project Management"],
    link: { url: "https://redmesa.dev/", label: "Visit Red Mesa" },
    images: [
      "/redmesa/redmesa1.png",
      "/redmesa/redmesa2.png",
      "/redmesa/redmesa3.png",
    ],
    accent: "#ff453a",
  },
  {
    id: "dialdynamics",
    eyebrow: "SaaS Platform",
    name: "DialDynamics",
    tagline: "AI cold-call training with real-time feedback.",
    description:
      "Sales simulation platform with live performance analytics. Reps practice against AI before making real calls.",
    stack: ["Next.js", "React", "Node.js", "UX Research"],
    link: { url: "https://www.dialdynamics.ca/", label: "Visit DialDynamics" },
    video: "/dialdynamics-demo.mp4",
    accent: "#30d158",
  },
  {
    id: "planty",
    eyebrow: "Hackathon Winner",
    name: "Planty",
    tagline: "First place. 24 hours. Zero hardware experience.",
    description:
      "A LEGO plant that responds to your habits — thrives when you're consistent, droops when you fall off. Built at MRU Hacks against 100+ teams.",
    stack: ["Arduino", "Python", "Raspberry Pi"],
    link: {
      url: "https://github.com/kelwa413/Planty",
      label: "View on GitHub",
    },
    video: "/hackathon-video.mp4",
    accent: "#ff9f0a",
  },
  {
    id: "csi",
    eyebrow: "Clinical SaaS",
    name: "CSI Dry Eye",
    tagline: "Precision tooling for ophthalmology practices.",
    description:
      "Full-stack clinical platform — patient assessments, treatment planning, invoicing, and export workflows built on Angular and AWS.",
    stack: ["Angular", "TypeScript", "AWS Lambda", "DynamoDB"],
    images: [
      "/csi/csi-dashboard.png",
      "/csi/csi-invoice-create.png",
      "/csi/csi-invoice-export.png",
      "/csi/csi-packages.png",
      "/csi/csi-pricing.png",
      "/csi/csi-treatment-plan.png",
      "/csi/csi-treatment-plan-status.png",
    ],
    accent: "#5e5ce6",
  },
];

const SECTION_IDS = ["#work", "#craft", "#contact"];

/* ── Hooks ────────────────────────────────────────────── */

function useScrollProgress() {
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
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const nodes = Array.from(document.querySelectorAll(".reveal"));
    nodes.forEach((node, idx) => {
      node.style.setProperty("--delay", `${(idx % 8) * 60}ms`);
    });

    if (reduced) {
      nodes.forEach((n) => n.classList.add("in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
}

function useScrollSpy(ids) {
  const [active, setActive] = useState("");

  useEffect(() => {
    const sects = ids.map((sel) => document.querySelector(sel)).filter(Boolean);

    const compute = () => {
      const mid = window.innerHeight / 2;
      let best = { id: "", d: Infinity };
      for (const el of sects) {
        const d = Math.abs(el.getBoundingClientRect().top - mid);
        if (d < best.d) best = { id: `#${el.id}`, d };
      }
      setActive((prev) => (prev === best.id ? prev : best.id));
    };

    compute();
    window.addEventListener("scroll", compute, { passive: true });
    return () => window.removeEventListener("scroll", compute);
  }, [ids]);

  return active;
}

function useAutoPlayVideos() {
  useEffect(() => {
    const vids = Array.from(document.querySelectorAll("section video"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const v = e.target;
          if (!(v instanceof HTMLVideoElement)) return;
          e.isIntersecting ? v.play().catch(() => {}) : v.pause();
        });
      },
      { threshold: 0.5 },
    );
    vids.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, []);
}

/* ── Components ───────────────────────────────────────── */

function GalleryModal({ open, onClose, images }) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="lightbox">
        <Carousel interval={5000} controls images={images} />
      </div>
    </Modal>
  );
}

function ProductMedia({ project, onImageClick }) {
  if (project.video) {
    return (
      <div className="product-showcase product-showcase--video">
        <video
          playsInline
          muted
          controls
          preload="metadata"
        >
          <source src={project.video} type="video/mp4" />
        </video>
      </div>
    );
  }

  if (project.images) {
    return (
      <div
        className={`product-showcase ${project.portrait ? "product-showcase--portrait" : ""}`}
        role="button"
        tabIndex={0}
        onClick={onImageClick}
        onKeyDown={(e) => e.key === "Enter" && onImageClick()}
        style={{ cursor: "zoom-in" }}
      >
        <div
          className={`product-carousel ${project.portrait ? "product-carousel--portrait" : ""}`}
        >
          <Carousel interval={4000} images={project.images} />
        </div>
      </div>
    );
  }

  return null;
}

function ProductCard({ project }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section
        id={project.id}
        className="product container"
        style={{ "--product-accent": project.accent }}
      >
        <div className="product-intro reveal">
          <p className="eyebrow">{project.eyebrow}</p>
          <h2 className="headline-lg">{project.name}</h2>
          <p className="body-lg">{project.tagline}</p>
        </div>

        <div className="reveal">
          <ProductMedia
            project={project}
            onImageClick={() => setModalOpen(true)}
          />
        </div>

        <div className="product-details reveal">
          <div className="product-description">
            <p className="body-md">{project.description}</p>
            {project.link && (
              <a
                className="product-link"
                href={project.link.url}
                target="_blank"
                rel="noreferrer"
              >
                {project.link.label}
              </a>
            )}
          </div>
          <div>
            <div className="product-stack stagger reveal">
              {project.stack.map((tech) => (
                <span className="product-stack-pill" key={tech}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {project.images && (
        <GalleryModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          images={project.images}
        />
      )}
    </>
  );
}

/* ── App ──────────────────────────────────────────────── */

export default function App() {
  useScrollProgress();
  useReveals();
  const active = useScrollSpy(SECTION_IDS);
  useAutoPlayVideos();

  const isWorkActive =
    PROJECTS.some((p) => active === `#${p.id}`) || active === "#work";

  return (
    <>
      <div className="progress" aria-hidden />

      {/* Nav */}
      <nav className="nav">
        <div className="container nav-inner">
          <a href="#" className="nav-brand">
            Khalaf Elwadya
          </a>
          <div className="nav-links">
            {NAV_LINKS.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className={
                  n.href === "#work"
                    ? isWorkActive
                      ? "active"
                      : ""
                    : active === n.href
                      ? "active"
                      : ""
                }
              >
                {n.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="hero container">
        <p className="eyebrow hero-eyebrow reveal">Full-Stack Developer</p>
        <h1 className="headline-xl hero-name reveal">Khalaf Elwadya</h1>
        <p className="hero-tagline reveal">Build it right. Ship it fast.</p>
        <p className="body-lg hero-sub reveal">
          Products across mobile, web, and cloud — from blank canvas to
          production.
        </p>
        <div className="hero-cta reveal">
          <a
            className="btn btn--primary"
            href="resume.pdf"
            download="resume.pdf"
          >
            Resume
          </a>
          <a className="btn btn--ghost" href="#work">
            See the work
          </a>
        </div>
      </header>

      {/* Work */}
      <div id="work">
        {PROJECTS.map((project) => (
          <ProductCard key={project.id} project={project} />
        ))}
      </div>

      {/* Craft — this is the "how did he do that" section */}
      <CraftSection />

      {/* Contact */}
      <section id="contact" className="section contact container">
        <h2 className="headline-lg reveal">Get in touch.</h2>
        <p className="body-lg reveal">
          Open to interesting problems and product-focused teams.
        </p>
        <div className="contact-links reveal">
          <a className="btn btn--primary" href="mailto:khalafelwadya@gmail.com">
            Email me
          </a>
          <a
            className="btn btn--outline"
            href="https://github.com/kelwa413"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a
            className="btn btn--outline"
            href="https://www.linkedin.com/in/khalaf-elwadya"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </section>

      <footer className="footer">Khalaf Elwadya - Built With Intent</footer>
    </>
  );
}
