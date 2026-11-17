import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BookOpen,
  Mail,
  Globe2,
  Users,
  Smartphone,
  ShieldCheck,
  ScanLine,
  Route,
  ArrowRight,
  Check,
} from "lucide-react";
import type { ReactNode } from "react";
export const lessonIcons = [
  BookOpen,
  Mail,
  Globe2,
  Users,
  Smartphone,
  ShieldCheck,
];
export const labs = [
  {
    slug: "mail",
    title: "Email detective",
    text: "Read between the lines of a simulated inbox.",
    count: 8,
    unit: "messages",
    Icon: Mail,
  },
  {
    slug: "url",
    title: "URL detective",
    text: "Trace the real destination behind an address.",
    count: 8,
    unit: "sites",
    Icon: ScanLine,
  },
  {
    slug: "social",
    title: "Decision lab",
    text: "Navigate requests under pressure.",
    count: 6,
    unit: "scenarios",
    Icon: Route,
  },
];
export function LabCards() {
  return (
    <div className="cards">
      {labs.map(({ slug, title, text, count, unit, Icon }) => (
        <Link key={slug} className="card lab-card" to={"/labs/" + slug}>
          <span className="lab-top">
            <span className={"iconbox " + slug}>
              <Icon size={25} />
            </span>
            <ArrowUpRight size={18} />
          </span>
          <h3>{title}</h3>
          <p>{text}</p>
          <small>
            {count} {unit}
          </small>
        </Link>
      ))}
    </div>
  );
}
export function Section({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        <div className="eyebrow">{label}</div>
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}
export function PageHead({
  label,
  title,
  sub,
}: {
  label: string;
  title: string;
  sub: string;
}) {
  return (
    <header className="pagehead">
      <div className="eyebrow">{label}</div>
      <h1>{title}</h1>
      <p>{sub}</p>
    </header>
  );
}
export function CTA({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link className="button primary" to={to}>
      {children}
      <ArrowRight size={17} />
    </Link>
  );
}
export function Choices({
  items,
  value,
  onPick,
}: {
  items: string[];
  value: number | null;
  onPick: (n: number) => void;
}) {
  return (
    <div className="choices">
      {items.map((s, i) => (
        <button
          aria-pressed={value === i}
          className={value === i ? "chosen" : ""}
          key={s}
          onClick={() => onPick(i)}
        >
          <span>{String.fromCharCode(65 + i)}</span>
          {s}
          {value === i && <Check size={16} />}
        </button>
      ))}
    </div>
  );
}
