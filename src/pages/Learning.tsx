import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Crosshair,
  Fingerprint,
  ClipboardCheck,
} from "lucide-react";
import { lessons } from "../data/lessons";
import { questions } from "../data/questions";
import { useProgress } from "../hooks/useProgress";
import {
  CTA,
  Choices,
  LabCards,
  PageHead,
  Section,
  lessonIcons,
} from "../components/UI";
import { FieldDiagram } from "../components/FieldDiagram";
export function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <i /> PHISHING AWARENESS TRAINING
          </div>
          <h1>
            Spot the signal.
            <br />
            <em>See the scam.</em>
          </h1>
          <p>
            Build the judgment to recognize phishing, inspect suspicious
            messages, and respond with confidence.
          </p>
          <div className="actions">
            <CTA to="/learn">Start learning</CTA>
            <Link className="ghost" to="/assessment">
              Test your awareness <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
        <FieldDiagram />
      </section>
      <div className="strip">
        {[
          [BookOpen, "6 guided modules"],
          [Crosshair, "3 practice labs"],
          [ClipboardCheck, "15-question assessment"],
        ].map(([Icon, label]) => {
          const I = Icon as typeof BookOpen;
          return (
            <span key={String(label)}>
              <I size={17} />
              {String(label)}
            </span>
          );
        })}
      </div>
      <Section label="Applied learning" title="The practice labs" />
      <LabCards />
      <Section label="Your curriculum" title="How the training works" />
      <div className="steps">
        {[
          [
            "Learn the signals",
            "Study six short lessons and check your understanding.",
            "/learn",
          ],
          [
            "Examine the evidence",
            "Practice with messages, URLs and branching decisions.",
            "/labs",
          ],
          [
            "Measure your progress",
            "Take the assessment and review every answer.",
            "/assessment",
          ],
        ].map(([title, sub, to], i) => (
          <Link key={to} to={to}>
            <small>STEP 0{i + 1}</small>
            <h3>{title}</h3>
            <p>{sub}</p>
          </Link>
        ))}
      </div>
      <div className="topic-links" aria-label="Lesson topics">
        {lessons.map((lesson, i) => (
          <Link key={lesson.topic} to={"/learn/" + i}>
            {lesson.topic}
            <ArrowUpRight size={13} />
          </Link>
        ))}
      </div>
    </>
  );
}
export function Dashboard() {
  const { p } = useProgress();
  const next = lessons.findIndex((_, i) => !p.lessons.includes(i));
  return (
    <>
      <PageHead
        label="Training dashboard"
        title="Your learning path"
        sub="Work through the modules in order or pick a skill to revisit."
      />
      <div className="banner">
        <div>
          <small>MODULE PROGRESS</small>
          <h2>{p.lessons.length} of 6 complete</h2>
          <progress
            value={p.lessons.length}
            max={6}
            aria-label="Modules completed"
          />
        </div>
        <CTA to={"/learn/" + (next < 0 ? 0 : next)}>
          {next < 0
            ? "Review lessons"
            : p.lessons.length
              ? "Continue learning"
              : "Begin first lesson"}
        </CTA>
      </div>
      <p className="dashboard-meta">
        {p.cases.length} of 22 lab cases solved · {p.attempts.length}{" "}
        assessments completed
      </p>
      <Section label="Curriculum" title="Training modules" />
      <div className="module-list">
        {lessons.map((l, i) => {
          const Icon = lessonIcons[i];
          return (
            <Link key={l.title} to={"/learn/" + i}>
              <span className="iconbox">
                <Icon />
              </span>
              <div>
                <small>MODULE 0{i + 1}</small>
                <h3>{l.title}</h3>
                <p>{l.intro}</p>
              </div>
              <span className="end">
                {p.lessons.includes(i) ? (
                  <>
                    <Check /> Complete
                  </>
                ) : (
                  <ArrowRight />
                )}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
export function LessonRoute() {
  const { id } = useParams();
  const n = Number(id);
  return String(n) === id && lessons[n] ? (
    <Lesson key={n} n={n} />
  ) : (
    <Missing />
  );
}
export function Missing() {
  return (
    <>
      <PageHead
        label="Navigation"
        title="Page unavailable"
        sub="Return to your training dashboard to pick up a lesson."
      />
      <CTA to="/learn">Open dashboard</CTA>
    </>
  );
}
const evidencePairs = [
  [
    "Recognizable detail",
    "Your course and instructor",
    "Unverified action",
    "Approve a new file share",
  ],
  [
    "Familiar context",
    "Existing invoice thread",
    "Changed instruction",
    "New receiving account",
  ],
  [
    "Subdomain",
    "northstar.example",
    "Controlling domain",
    "billing-desk.example",
  ],
  [
    "Claimed authority",
    "Team lead",
    "Bypassed control",
    "Private voucher purchase",
  ],
  [
    "Physical clue",
    "Sticker over printed code",
    "Unknown destination",
    "Replacement payment page",
  ],
  [
    "Exposure",
    "Password submitted",
    "Containment",
    "Reset and revoke sessions",
  ],
];
function Lesson({ n }: { n: number }) {
  const { p, update } = useProgress();
  const l = lessons[n],
    q = questions.find((q) => q.topic === n)!;
  const Icon = lessonIcons[n];
  const [pick, set] = useState<number | null>(null);
  const complete = p.lessons.includes(n);
  function choose(i: number) {
    set(i);
    if (i === q.correct && !complete)
      update((p) => ({ ...p, lessons: [...new Set([...p.lessons, n])] }));
  }
  return (
    <article className="reading">
      <Link className="back" to="/learn">
        ← All modules
      </Link>
      <PageHead
        label={"Module 0" + (n + 1) + " / 06"}
        title={l.title}
        sub={l.intro}
      />
      <div className="card article">
        <Icon className="ink" />
        <h2>What to look for</h2>
        <p>{l.principle}</p>
        <div className="example">
          <Fingerprint />
          <div>
            <small>FIELD EXAMPLE</small>
            <p>{l.example}</p>
            <dl className="evidence-pair">
              {[0, 2].map((i) => (
                <div key={i}>
                  <dt>{evidencePairs[n][i]}</dt>
                  <dd>{evidencePairs[n][i + 1]}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <h3>Put it into practice</h3>
        <p>{l.action}</p>
      </div>
      <div className="card article">
        <small>KNOWLEDGE CHECK</small>
        <h2>{q.prompt}</h2>
        <Choices items={q.options} value={pick} onPick={choose} />
        <div aria-live="polite">
          {pick !== null && (
            <p className="notice">
              {pick === q.correct
                ? "Correct. Module completed. " + q.why
                : "Try again. " + q.why}
            </p>
          )}
        </div>
        {complete && (
          <CTA to={n < 5 ? "/learn/" + (n + 1) : "/assessment"}>
            {n < 5 ? "Next module" : "Take assessment"}
          </CTA>
        )}
      </div>
    </article>
  );
}
