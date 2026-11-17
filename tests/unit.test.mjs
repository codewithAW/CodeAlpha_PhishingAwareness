import test from "node:test";
import assert from "node:assert/strict";
import {
  score,
  selectQuestions,
  trainingDomain,
  sameFlags,
  decode,
  empty,
} from "../src/utils/training.ts";
import { questions } from "../src/data/questions.ts";
import { sites, inbox, scenarios } from "../src/data/labs.ts";
test("assessment samples 15 distinct original questions without mutating the bank", () => {
  const original = questions.map((q) => q.id);
  for (let i = 0; i < 100; i++)
    assert.equal(new Set(selectQuestions(questions).map((q) => q.id)).size, 15);
  assert.deepEqual(
    questions.map((q) => q.id),
    original,
  );
  assert.throws(() => selectQuestions(questions, 31), RangeError);
});
const sample = questions.slice(0, 15);
const perfect = {
  id: "test",
  date: "2026-01-01T00:00:00Z",
  ids: sample.map((q) => q.id),
  picks: sample.map((q) => q.correct),
};
test("scoring uses the sampled order and counts each correct answer once", () => {
  assert.equal(score(perfect), 15);
  assert.equal(
    score({ ...perfect, picks: sample.map((q) => (q.correct + 1) % 3) }),
    0,
  );
  assert.equal(score({ ...perfect, picks: perfect.picks.slice(0, 7) }), 7);
});
test("URL fixtures separate host from path and include a correct registrable choice", () => {
  for (const site of sites)
    assert.ok(site.choices.includes(trainingDomain(site.url)));
  assert.equal(
    trainingDomain("https://shop.example.bill.example/shop.example"),
    "bill.example",
  );
  for (const value of ["https://example.com", "garbage", "http://desk.example"])
    assert.equal(trainingDomain(value), null);
});
test("indicator classification requires all and only observed signals", () => {
  assert.ok(sameFlags([2, 0], [0, 2]));
  assert.ok(sameFlags([], []));
  assert.ok(!sameFlags([0], [0, 1]));
  assert.ok(!sameFlags([0, 1], []));
});
test("storage recovers from malformed, missing and unsupported records", () => {
  for (const raw of [null, "{", "null", '{"version":2}', "[]"])
    assert.deepEqual(decode(raw), empty());
  const cleaned = decode(
    JSON.stringify({
      version: 1,
      lessons: [0, 0, -1, 6, "2"],
      cases: ["url-1", "mail-9", "social-6"],
      attempts: [
        null,
        {},
        perfect,
        { ...perfect, picks: [] },
        { ...perfect, ids: Array(15).fill("1-1") },
      ],
    }),
  );
  assert.deepEqual(cleaned, {
    version: 1,
    lessons: [0],
    cases: ["url-1"],
    attempts: [perfect],
  });
  assert.deepEqual(decode(JSON.stringify(cleaned)), cleaned);
});
test("curriculum bank and practice content cover all six topics", () => {
  assert.equal(new Set(questions.map((q) => q.id)).size, 30);
  for (let topic = 0; topic < 6; topic++)
    assert.equal(questions.filter((q) => q.topic === topic).length, 5);
  for (const q of questions)
    assert.ok(q.options[q.correct] && q.why.length > 20);
  assert.equal(inbox.length, 8);
  assert.equal(sites.length, 8);
  assert.equal(scenarios.length, 6);
});
