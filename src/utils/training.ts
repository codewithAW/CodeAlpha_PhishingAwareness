import type { Attempt, Progress, Question } from "../types.ts";
import { questions } from "../data/questions.ts";
import { lessons } from "../data/lessons.ts";
import { inbox, sites, scenarios } from "../data/labs.ts";
export const storageKey = "cybershield.progress.v1";
export const empty = (): Progress => ({
  version: 1,
  lessons: [],
  cases: [],
  attempts: [],
});
export const bank = new Map(questions.map((q) => [q.id, q]));
export function selectQuestions(
  pool: Question[],
  count = 15,
  random = Math.random,
) {
  if (!Number.isInteger(count) || count < 0 || count > pool.length)
    throw new RangeError("Invalid sample size");
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}
export function score(attempt: Pick<Attempt, "ids" | "picks">) {
  return attempt.ids.reduce(
    (sum, id, i) =>
      sum + Number(bank.has(id) && bank.get(id)?.correct === attempt.picks[i]),
    0,
  );
}
// Only reserved, single-label-suffix .example fixtures are supported here.
export function trainingDomain(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || !url.hostname.endsWith(".example"))
      return null;
    return url.hostname.split(".").slice(-2).join(".");
  } catch {
    return null;
  }
}
export function sameFlags(a: number[], b: number[]) {
  return a.length === b.length && b.every((x) => a.includes(x));
}
const allowedCases = new Set(
  [
    ["mail", inbox],
    ["url", sites],
    ["social", scenarios],
  ].flatMap(([kind, list]) =>
    Array.from({ length: list.length }, (_, i) => kind + "-" + i),
  ),
);
function validAttempt(a: Attempt): boolean {
  return (
    !!a &&
    typeof a.id === "string" &&
    typeof a.date === "string" &&
    Number.isFinite(Date.parse(a.date)) &&
    Array.isArray(a.ids) &&
    a.ids.length === 15 &&
    new Set(a.ids).size === 15 &&
    Array.isArray(a.picks) &&
    a.picks.length === 15 &&
    a.ids.every(
      (id, i) =>
        bank.has(id) &&
        Number.isInteger(a.picks[i]) &&
        a.picks[i] >= 0 &&
        a.picks[i] < bank.get(id)!.options.length,
    )
  );
}
export function decode(raw: string | null): Progress {
  try {
    const p = JSON.parse(raw || "null");
    if (p?.version !== 1) return empty();
    return {
      version: 1,
      lessons: [
        ...new Set<number>(
          (Array.isArray(p.lessons) ? p.lessons : []).filter(
            (x: number) => Number.isInteger(x) && x >= 0 && x < lessons.length,
          ),
        ),
      ],
      cases: [
        ...new Set<string>(
          (Array.isArray(p.cases) ? p.cases : []).filter((x: string) =>
            allowedCases.has(x),
          ),
        ),
      ],
      attempts: (Array.isArray(p.attempts) ? p.attempts : []).filter(
        validAttempt,
      ),
    };
  } catch {
    return empty();
  }
}
