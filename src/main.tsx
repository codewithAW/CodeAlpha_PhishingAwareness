import { createRoot } from "react-dom/client";
import { useEffect, useRef, useState } from "react";
import {
  HashRouter,
  Routes,
  Route,
  Link,
  NavLink,
  useLocation,
} from "react-router-dom";
import {
  ShieldCheck,
  Menu,
  X,
  ChartNoAxesColumnIncreasing,
} from "lucide-react";
import { ProgressProvider, useProgress } from "./hooks/useProgress";
import { Home, Dashboard, LessonRoute, Missing } from "./pages/Learning";
import { LabIndex, LabRoute } from "./pages/Labs";
import { Assessment } from "./pages/Assessment";
import { Record } from "./pages/Progress";
import "./style.css";
function Brand() {
  return (
    <Link className="brand" to="/">
      <span className="brand-mark">
        <ShieldCheck size={25} />
      </span>
      <span>
        CyberShield <b>Academy</b>
      </span>
    </Link>
  );
}
function App() {
  const [menu, open] = useState(false);
  const { pathname } = useLocation();
  const main = useRef<HTMLElement>(null);
  const { temporary } = useProgress();
  useEffect(() => {
    window.scrollTo(0, 0);
    main.current?.focus({ preventScroll: true });
    document.title =
      (document.querySelector("h1")?.textContent || "Training") +
      " · CyberShield Academy";
  }, [pathname]);
  return (
    <>
      <a
        className="skip"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          main.current?.focus();
        }}
      >
        Skip to content
      </a>
      <header className="top">
        <div className="top-inner">
          <Brand />
          <button
            className="menu-btn"
            aria-label={menu ? "Close navigation" : "Open navigation"}
            aria-controls="primary-nav"
            aria-expanded={menu}
            onClick={() => open(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
          <nav
            id="primary-nav"
            className={menu ? "open" : ""}
            aria-label="Main navigation"
            onClick={() => open(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                open(false);
                document.querySelector<HTMLButtonElement>(".menu-btn")?.focus();
              }
            }}
          >
            {[
              ["/", "Overview"],
              ["/learn", "Learning path"],
              ["/labs", "Practice labs"],
              ["/assessment", "Assessment"],
              ["/progress", "My progress"],
            ].map(([to, t]) => (
              <NavLink key={to} to={to} end={to === "/"}>
                {to === "/progress" && (
                  <ChartNoAxesColumnIncreasing size={15} />
                )}{" "}
                {t}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main id="main" ref={main} tabIndex={-1}>
        {temporary && (
          <p role="status" className="notice">
            Browser storage is unavailable. Progress is held for this session.
          </p>
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<Dashboard />} />
          <Route path="/learn/:id" element={<LessonRoute />} />
          <Route path="/labs" element={<LabIndex />} />
          <Route path="/labs/:kind" element={<LabRoute />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/progress" element={<Record />} />
          <Route path="*" element={<Missing />} />
        </Routes>
      </main>
      <footer>
        <div>
          <Brand />
          <p>CodeAlpha Cyber Security Internship · Task 2</p>
        </div>
        <Link to="/progress">Learning record ↗</Link>
      </footer>
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <HashRouter>
    <ProgressProvider>
      <App />
    </ProgressProvider>
  </HashRouter>,
);
