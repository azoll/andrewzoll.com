// Offline unit tests for the router + eval gate. No network — feed the gate mock
// "signals" objects (what the model would extract about its own answer) and the
// router mock task/policy, then assert the routing choice and the verdict.
// Run: `node --test`
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  PROVIDERS, route, normalizeSignals, resolvePolicy, evaluate, decide, rollup,
} from "../lib/anthropic-router-core.mjs";

// --- Router ---------------------------------------------------------------------

test("router: grounded must-cite + low latency routes to Anthropic", () => {
  const r = route("grounded_qa", { lowLatency: true, requireCitation: true });
  assert.equal(r.provider, "anthropic");
  assert.equal(r.model, PROVIDERS.anthropic.id);
  assert.equal(r.pinned, false);
});

test("router: an explicit pin overrides the score", () => {
  const r = route("grounded_qa", { lowLatency: true }, "openai");
  assert.equal(r.provider, "openai");
  assert.equal(r.pinned, true);
  assert.match(r.reason, /pinned/i);
});

test("router: a pin to an unknown provider is ignored, falls back to scoring", () => {
  const r = route("grounded_qa", {}, "nonsense-vendor");
  assert.ok(PROVIDERS[r.provider], "must resolve to a real provider");
  assert.equal(r.pinned, false);
});

test("router: unknown task type falls back to the default, never crashes", () => {
  const r = route("does-not-exist", {});
  assert.equal(r.task, "grounded_qa");
  assert.ok(PROVIDERS[r.provider]);
});

test("router: reasoning task rewards the higher-reasoning provider", () => {
  const r = route("reasoning", {});
  // google + openai carry reasoning 3/2; google wins on the reasoning weight.
  assert.ok(["google", "openai", "anthropic"].includes(r.provider));
  assert.ok(r.scores.length === Object.keys(PROVIDERS).length);
});

test("router: cost-sensitive policy raises cheaper providers' scores", () => {
  const base = route("drafting", {});
  const cheap = route("drafting", { costSensitive: true });
  const baseGoogle = base.scores.find((s) => s.provider === "google").score;
  const cheapGoogle = cheap.scores.find((s) => s.provider === "google").score;
  assert.ok(cheapGoogle > baseGoogle, "cost weight should lift cost-3 providers");
});

// --- Signal normalization (fail-closed coercion) --------------------------------

test("normalizeSignals coerces a malformed object to a safe shape", () => {
  const s = normalizeSignals({ refused: "yes", pii_kinds: "ssn", answer_present: 1 });
  assert.equal(s.refused, false);        // only literal true counts
  assert.equal(s.answer_present, false); // 1 is not true
  assert.deepEqual(s.pii_kinds, []);     // string, not array -> dropped
});

test("normalizeSignals on null/garbage returns all-false (forces a reject downstream)", () => {
  const s = normalizeSignals(null);
  assert.equal(s.answer_present, false);
  const r = evaluate(s, resolvePolicy("grounded_qa"));
  assert.equal(r.verdict, "reject");
});

// --- Eval gate ------------------------------------------------------------------

const clean = {
  refused: false, answer_present: true, contains_citation: true,
  contains_pii: false, pii_kinds: [], hedged: false, on_topic: true,
  self_contradiction: false,
};

test("gate: clean answer meeting all policy passes", () => {
  const r = decide("grounded_qa", clean);
  assert.equal(r.verdict, "pass");
});

test("gate: missing citation when policy requires it is a REJECT (fail closed)", () => {
  const r = decide("grounded_qa", { ...clean, contains_citation: false });
  assert.equal(r.verdict, "reject");
  assert.ok(r.checks.find((c) => c.name === "Citation present" && c.status === "reject"));
});

test("gate: PII present with forbidPii on is a REJECT", () => {
  const r = decide("drafting", { ...clean, contains_pii: true, pii_kinds: ["email", "ssn"] }, { forbidPii: true });
  assert.equal(r.verdict, "reject");
  assert.match(r.checks.find((c) => c.name === "No PII leaked").detail, /email/);
});

test("gate: a model refusal is a REJECT, never a silent pass", () => {
  const r = decide("drafting", { ...clean, refused: true }, { requireCitation: false });
  assert.equal(r.verdict, "reject");
});

test("gate: an empty answer is a REJECT (fail closed)", () => {
  const r = decide("drafting", { ...clean, answer_present: false }, { requireCitation: false });
  assert.equal(r.verdict, "reject");
});

test("gate: off-topic answer is a REJECT", () => {
  const r = decide("extraction", { ...clean, on_topic: false });
  assert.equal(r.verdict, "reject");
});

test("gate: self-contradiction is a REJECT", () => {
  const r = decide("extraction", { ...clean, self_contradiction: true });
  assert.equal(r.verdict, "reject");
});

test("gate: hedged answer where confidence is required is a REVIEW, not a reject", () => {
  const r = decide("grounded_qa", { ...clean, hedged: true }, { requireConfidence: true });
  assert.equal(r.verdict, "review");
  assert.ok(r.checks.find((c) => c.name === "Confidence" && c.status === "review"));
});

test("gate: hedged answer without a confidence requirement is a non-blocking REVIEW", () => {
  const r = decide("drafting", { ...clean, hedged: true }, { requireCitation: false });
  assert.equal(r.verdict, "review");
});

test("gate: reject dominates review in the rollup", () => {
  assert.equal(rollup([{ status: "pass" }, { status: "review" }, { status: "reject" }]), "reject");
  assert.equal(rollup([{ status: "pass" }, { status: "review" }]), "review");
  assert.equal(rollup([{ status: "pass" }, { status: "pass" }]), "pass");
});

// --- Stability (same signals -> same verdict, every time) -----------------------

test("gate: identical signals yield an identical verdict across repeated runs", () => {
  const first = JSON.stringify(decide("grounded_qa", clean));
  for (let i = 0; i < 25; i++) {
    assert.equal(JSON.stringify(decide("grounded_qa", clean)), first);
  }
});

test("policy: forbidPii and requireOnTopic default ON (fail closed by default)", () => {
  const p = resolvePolicy("drafting");
  assert.equal(p.forbidPii, true);
  assert.equal(p.requireOnTopic, true);
});
