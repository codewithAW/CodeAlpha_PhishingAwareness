import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Mail, Monitor, Route } from "lucide-react";
import { inbox, signals, sites, siteSignals, scenarios } from "../data/labs";
import { trainingDomain, sameFlags } from "../utils/training";
import { useProgress } from "../hooks/useProgress";
import { LabCards, PageHead, Choices, labs } from "../components/UI";
import { Missing } from "./Learning";
export function LabIndex() {
  return (
    <>
      <PageHead
        label="Field exercises"
        title="Practice labs"
        sub="Inspect the evidence and make a decision. Every case is a local simulation."
      />
      <LabCards />
    </>
  );
}
export function LabRoute() {
  const { kind } = useParams();
  return labs.some((x) => x.slug === kind) ? (
    <Workbench key={kind} kind={kind!} />
  ) : (
    <Missing />
  );
}
function Workbench({ kind }: { kind: string }) {
  const { p, update } = useProgress();
  const [n, select] = useState(0);
  const lab = labs.find((x) => x.slug === kind)!;
  const titles =
    kind === "mail"
      ? inbox.map((x) => x.subject)
      : kind === "url"
        ? sites.map((x) => x.title)
        : scenarios.map((x) => x.title);
  const mark = () =>
    update((p) => ({
      ...p,
      cases: [...new Set([...p.cases, kind + "-" + n])],
    }));
  return (
    <>
      <Link className="back" to="/labs">
        ← Practice labs
      </Link>
      <PageHead
        label="Interactive simulation"
        title={lab.title}
        sub={lab.text}
      />
      <div className="workbench">
        <aside className="case-list">
          <small>CASE FILES</small>
          {titles.map((title, i) => (
            <button
              key={title}
              aria-current={i === n ? "true" : undefined}
              onClick={() => select(i)}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
              {title}
              {p.cases.includes(kind + "-" + i) && (
                <b aria-label="Completed">✓</b>
              )}
            </button>
          ))}
        </aside>
        <section key={n} className="card article">
          {kind === "social" ? (
            <Branch n={n} mark={mark} />
          ) : (
            <Detect kind={kind} n={n} mark={mark} />
          )}
          <div className="case-nav">
            {n < titles.length - 1 ? (
              <button className="plain" onClick={() => select(n + 1)}>
                Next case →
              </button>
            ) : (
              <Link className="plain" to="/progress">
                View progress →
              </Link>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
function Detect({
  kind,
  n,
  mark,
}: {
  kind: string;
  n: number;
  mark: () => void;
}) {
  const email = kind === "mail";
  const m = inbox[n],
    s = sites[n];
  const [pick, setPick] = useState<number | null>(null),
    [flags, setFlags] = useState<number[]>([]),
    [sig, setSig] = useState<number | null>(null),
    [result, setResult] = useState<boolean | null>(null);
  function submit() {
    const ok = email
      ? pick === Number(m.flags.length > 0) && sameFlags(flags, m.flags)
      : s.choices[pick!] === trainingDomain(s.url) &&
        siteSignals[sig!] === s.signal;
    setResult(ok);
    if (ok) mark();
  }
  return (
    <>
      <div className="eyebrow">
        {email ? <Mail size={16} /> : <Monitor size={16} />}{" "}
        {email ? "Simulated inbox" : "Simulated browser"}
      </div>
      <h2>{email ? m.subject : s.title}</h2>
      {email ? (
        <>
          <div className="context">
            <b>Case context</b>
            <p>{m.context}</p>
          </div>
          <div className="specimen">
            <strong>{m.sender}</strong>
            <code>{m.address}</code>
            <p>{m.body}</p>
            <code>{m.destination}</code>
          </div>
        </>
      ) : (
        <>
          <p>
            The expected service domain is <code>{s.service}</code>.
          </p>
          <div className="browser-mock">
            <code>◉ &nbsp;{s.url}</code>
            <div>
              <Monitor />
              <h3>{s.title}</h3>
              <p>{s.service.split(".")[0]} · Member services</p>
            </div>
          </div>
        </>
      )}
      <h3>
        {email
          ? "Classify this message"
          : "Select the registered training domain"}
      </h3>
      <Choices
        items={email ? ["Likely legitimate", "Suspicious"] : s.choices}
        value={pick}
        onPick={(i) => {
          setPick(i);
          setResult(null);
        }}
      />
      <h3>
        {email
          ? "Select all observed warning signs"
          : "Identify the address pattern"}
      </h3>
      {email ? (
        <>
          <p>Leave unchecked when none apply.</p>
          {signals.map((v, i) => (
            <label className="check" key={v}>
              <input
                type="checkbox"
                checked={flags.includes(i)}
                onChange={() => {
                  setFlags(
                    flags.includes(i)
                      ? flags.filter((x) => x !== i)
                      : [...flags, i],
                  );
                  setResult(null);
                }}
              />
              {v}
            </label>
          ))}
        </>
      ) : (
        <Choices
          items={siteSignals}
          value={sig}
          onPick={(i) => {
            setSig(i);
            setResult(null);
          }}
        />
      )}
      <button
        className="button primary"
        disabled={pick === null || (!email && sig === null)}
        onClick={submit}
      >
        Check findings
      </button>
      <div aria-live="polite">
        {result !== null && (
          <div className="notice">
            <b>{result ? "Correct findings" : "Revisit your findings"}</b>
            <p>{email ? m.finding : s.why}</p>
            <small>
              {email
                ? m.flags.map((i) => signals[i]).join(" · ") ||
                  "No listed warning signs"
                : trainingDomain(s.url) + " · " + s.signal}
            </small>
          </div>
        )}
      </div>
    </>
  );
}
function Branch({ n, mark }: { n: number; mark: () => void }) {
  const s = scenarios[n];
  const [choice, set] = useState<number | null>(null),
    [end, finish] = useState<number | null>(null);
  const safe = n % 2;
  return (
    <>
      <div className="eyebrow">
        <Route size={16} />
        {s.setting}
      </div>
      <h2>{s.title}</h2>
      <p>{s.request}</p>
      <Choices
        items={safe ? [s.risky, s.safe] : [s.safe, s.risky]}
        value={choice}
        onPick={(i) => {
          set(i);
          finish(null);
        }}
      />
      {choice !== null && (
        <div aria-live="polite">
          <div className="notice">
            <b>{choice === safe ? "Verification path" : "Recovery path"}</b>
            <p>
              {s.reason} {choice === safe ? s.verified : s.recovery}
            </p>
          </div>
          <h3>What do you do next?</h3>
          <Choices
            items={safe ? [s.finish, s.mistake] : [s.mistake, s.finish]}
            value={end}
            onPick={(i) => {
              finish(i);
              if (i === 1 - safe && choice === safe) mark();
            }}
          />
          {end !== null && (
            <p className="notice">
              {end !== 1 - safe
                ? "That leaves the risk unresolved. Review the response options."
                : choice !== safe
                  ? "That helps contain the harm. Revisit the first decision to practice prevention."
                  : "Case completed. You verified independently and escalated through the appropriate channel."}
            </p>
          )}
        </div>
      )}
    </>
  );
}
