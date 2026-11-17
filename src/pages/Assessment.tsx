import { useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardCheck } from "lucide-react";
import { questions } from "../data/questions";
import { Choices, PageHead } from "../components/UI";
import { useProgress } from "../hooks/useProgress";
import { selectQuestions, score, bank } from "../utils/training";
import type { Attempt, Question } from "../types";
export function Review({ a }: { a: Attempt }) {
  return (
    <div className="review">
      {a.ids.map((id, i) => {
        const q = bank.get(id)!;
        return (
          <details key={id}>
            <summary>
              <b>{a.picks[i] === q.correct ? "Correct" : "Review"}</b>{" "}
              {q.prompt}
            </summary>
            <p>Your answer: {q.options[a.picks[i]]}</p>
            <p>
              <strong>Correct answer:</strong> {q.options[q.correct]}
            </p>
            <p>{q.why}</p>
          </details>
        );
      })}
    </div>
  );
}
export function Assessment() {
  const { update } = useProgress();
  const [pool, setPool] = useState<Question[]>([]),
    [picks, setPicks] = useState<number[]>([]),
    [pos, go] = useState(0),
    [done, setDone] = useState<Attempt | null>(null);
  function start() {
    setDone(null);
    setPool(selectQuestions(questions));
    setPicks([]);
    go(0);
  }
  function advance() {
    if (pos < pool.length - 1) {
      go(pos + 1);
      return;
    }
    const a = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      ids: pool.map((q) => q.id),
      picks: [...picks],
    };
    update((p) => ({ ...p, attempts: [...p.attempts, a] }));
    setDone(a);
  }
  return (
    <div className="reading">
      <PageHead
        label="Skills assessment"
        title={done ? "Assessment results" : "Test your awareness"}
        sub={
          done
            ? "Review the evidence and reasoning behind each answer."
            : "Apply what you know to everyday phishing decisions."
        }
      />
      {done ? (
        <>
          <div className="banner">
            <div>
              <small>YOUR SCORE</small>
              <h2>{score(done)} / 15</h2>
            </div>
            <button className="button primary" onClick={start}>
              Try again
            </button>
          </div>
          <Link className="plain" to="/progress">
            View learning record →
          </Link>
          <Review a={done} />
        </>
      ) : pool.length === 0 ? (
        <section className="card article">
          <span className="iconbox">
            <ClipboardCheck />
          </span>
          <h2>Final assessment</h2>
          <p>
            Answer 15 questions drawn from a bank of 30. Work at your own pace.
            You can revisit earlier answers before submitting. Completed
            attempts are saved on this browser.
          </p>
          <button className="button primary" onClick={start}>
            Begin assessment
          </button>
        </section>
      ) : (
        <section className="card article">
          <small>QUESTION {pos + 1} OF 15</small>
          <progress aria-label="Assessment progress" value={pos + 1} max={15} />
          <h2 aria-live="polite">{pool[pos].prompt}</h2>
          <Choices
            items={pool[pos].options}
            value={picks[pos] ?? null}
            onPick={(i) => {
              const next = [...picks];
              next[pos] = i;
              setPicks(next);
            }}
          />
          <div className="actions">
            <button
              className="button"
              disabled={pos === 0}
              onClick={() => go(pos - 1)}
            >
              Previous
            </button>
            <button
              className="button primary"
              disabled={picks[pos] === undefined}
              onClick={advance}
            >
              {pos === 14 ? "Submit assessment" : "Next question"}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
