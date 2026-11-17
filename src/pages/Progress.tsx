import { useState } from "react";
import { Link } from "react-router-dom";
import { Printer } from "lucide-react";
import { PageHead, Section } from "../components/UI";
import { useProgress } from "../hooks/useProgress";
import { lessons } from "../data/lessons";
import { bank, empty, score } from "../utils/training";
import { Review } from "./Assessment";
export function Record() {
  const { p, update } = useProgress(),
    [confirm, ask] = useState(false);
  const totals = lessons.map(() => ({ right: 0, seen: 0 }));
  p.attempts.forEach((a) =>
    a.ids.forEach((id, i) => {
      const q = bank.get(id)!;
      totals[q.topic].seen++;
      totals[q.topic].right += Number(q.correct === a.picks[i]);
    }),
  );
  return (
    <>
      <PageHead
        label="Learning record"
        title="Your progress"
        sub="A personal record of the training you have completed in this browser."
      />
      <div className="stats">
        {[
          ["Modules", p.lessons.length + "/6"],
          ["Lab cases", p.cases.length + "/22"],
          ["Assessments", p.attempts.length],
          [
            "Best score",
            p.attempts.length
              ? Math.max(...p.attempts.map(score)) + "/15"
              : "—",
          ],
        ].map(([k, v]) => (
          <div className="card" key={k}>
            <small>{k}</small>
            <h2>{v}</h2>
          </div>
        ))}
      </div>
      <Section
        label="Completion summary"
        title={
          p.lessons.length === 6 && p.attempts.length
            ? "Coursework completed"
            : "Coursework in progress"
        }
      />
      <p>
        Unofficial project achievement. CodeAlpha does not issue this summary as
        a certificate.
      </p>
      <div className="card article">
        {lessons.map((l, i) => (
          <div className="record-row" key={i}>
            <Link to={"/learn/" + i}>{l.title}</Link>
            <span>{p.lessons.includes(i) ? "Completed" : "Pending"}</span>
          </div>
        ))}
      </div>
      <Section label="Assessment evidence" title="Skill breakdown" />
      {p.attempts.length ? (
        <div className="card article">
          {totals.map(({ right, seen }, i) => (
            <div className="record-row" key={i}>
              <strong>{lessons[i].topic}</strong>
              <span>
                {seen
                  ? right +
                    "/" +
                    seen +
                    " correct · " +
                    (right / seen >= 0.8 ? "Strength" : "Practice area")
                  : "Unassessed"}
              </span>
            </div>
          ))}
          <p>
            Strength indicates at least 80% correct across answered questions in
            that topic.
          </p>
        </div>
      ) : (
        <p>Complete an assessment to see strengths and practice areas.</p>
      )}
      <Section label="Assessment history" title="Completed attempts" />
      {p.attempts.length ? (
        [...p.attempts].reverse().map((a) => (
          <details className="history card" key={a.id}>
            <summary>
              {new Date(a.date).toLocaleString()} · {score(a)}/15
            </summary>
            <Review a={a} />
          </details>
        ))
      ) : (
        <Link className="plain" to="/assessment">
          Take your first assessment →
        </Link>
      )}
      <div className="actions no-print">
        <button className="button" onClick={() => window.print()}>
          <Printer size={17} /> Print summary
        </button>
        <button className="plain" onClick={() => ask(true)}>
          Reset progress
        </button>
      </div>
      {confirm && (
        <section className="notice no-print" aria-label="Confirm reset">
          <h3>Erase this browser’s training record?</h3>
          <p>
            This removes completed lessons, lab cases, and assessment attempts.
          </p>
          <div className="actions">
            <button autoFocus className="button" onClick={() => ask(false)}>
              Keep progress
            </button>
            <button
              className="button danger"
              onClick={() => {
                update(() => empty());
                ask(false);
              }}
            >
              Erase progress
            </button>
          </div>
        </section>
      )}
    </>
  );
}
