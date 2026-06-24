// Reference architecture core — multi-provider model router + fail-closed eval gate.
// Pure logic, no I/O. Imported by the Cloudflare Pages Function AND by the Node test
// suite, so the rules that ROUTE a request and DECIDE its verdict are exercised the
// same way in prod and in tests.
//
// Design choice (the one that makes this defensible): the AI model only EXTRACTS
// structured signals about its own answer. Every routing decision and every
// pass/review/reject verdict below is deterministic JavaScript — testable,
// explainable, and stable across runs. This is the pattern a partner / system
// integrator reuses: route with a policy, gate with code, fail closed.

// --- Provider registry ---------------------------------------------------------
// A reference policy table. Each model carries the traits a router scores against.
// Real model IDs that are live through the Vercel AI Gateway, so a routed request
// actually hits the provider it names.
export const PROVIDERS = {
  anthropic: {
    id: "anthropic/claude-haiku-4.5",
    label: "Claude Haiku 4.5",
    vendor: "Anthropic",
    // Traits the router scores. Strong instruction-following + citation discipline,
    // low latency. The default for grounded, must-cite, safety-sensitive work.
    traits: { grounded: 3, latency: 3, reasoning: 2, cost: 2 },
  },
  openai: {
    id: "openai/gpt-4o-mini",
    label: "GPT-4o mini",
    vendor: "OpenAI",
    traits: { grounded: 2, latency: 3, reasoning: 2, cost: 3 },
  },
  google: {
    id: "google/gemini-2.5-flash",
    label: "Gemini 2.5 Flash",
    vendor: "Google",
    traits: { grounded: 2, latency: 3, reasoning: 3, cost: 3 },
  },
};

export const DEFAULT_PROVIDER = "anthropic";

// --- Task profiles -------------------------------------------------------------
// Each task type declares what the router should optimize for. A partner edits this
// table to encode their own routing policy; the engine stays the same.
export const TASK_PROFILES = {
  grounded_qa: {
    label: "Grounded Q&A (must cite)",
    weights: { grounded: 3, latency: 2, reasoning: 1, cost: 1 },
    requireCitation: true,
  },
  extraction: {
    label: "Structured extraction",
    weights: { grounded: 3, latency: 2, reasoning: 1, cost: 2 },
    requireCitation: false,
  },
  reasoning: {
    label: "Multi-step reasoning",
    weights: { grounded: 1, latency: 1, reasoning: 3, cost: 1 },
    requireCitation: false,
  },
  drafting: {
    label: "Content drafting",
    weights: { grounded: 1, latency: 2, reasoning: 2, cost: 3 },
    requireCitation: false,
  },
};

export const DEFAULT_TASK = "grounded_qa";

// --- Router --------------------------------------------------------------------
// Deterministic. Given a task type and policy, score every provider and pick the
// best, with a hard override when the caller pins a provider. Returns the choice
// AND the score table, so the UI can show WHY this model was chosen (explainability
// is the whole point for a reference architecture).
export function route(taskType, policy = {}, pin = null) {
  const task = TASK_PROFILES[taskType] || TASK_PROFILES[DEFAULT_TASK];
  const usedTask = TASK_PROFILES[taskType] ? taskType : DEFAULT_TASK;

  // Explicit pin wins, but only if it names a real provider.
  if (pin && PROVIDERS[pin]) {
    return {
      provider: pin,
      model: PROVIDERS[pin].id,
      task: usedTask,
      reason: `Provider pinned to ${PROVIDERS[pin].vendor} by the caller (policy override).`,
      scores: scoreAll(task, policy),
      pinned: true,
    };
  }

  const scores = scoreAll(task, policy);
  // Highest score wins; ties break toward the registry order (Anthropic first),
  // which is deterministic because scoreAll preserves PROVIDERS key order.
  let best = scores[0];
  for (const s of scores) if (s.score > best.score) best = s;

  const reasonBits = [`task "${task.label}"`];
  if (policy.lowLatency) reasonBits.push("latency-sensitive");
  if (policy.requireCitation || task.requireCitation) reasonBits.push("citation required");
  return {
    provider: best.provider,
    model: PROVIDERS[best.provider].id,
    task: usedTask,
    reason: `Routed to ${PROVIDERS[best.provider].vendor} for ${reasonBits.join(", ")}.`,
    scores,
    pinned: false,
  };
}

function scoreAll(task, policy) {
  const w = { ...task.weights };
  // Policy levers nudge the weights. A partner's constraint becomes a number.
  if (policy.lowLatency) w.latency = (w.latency || 0) + 3;
  if (policy.costSensitive) w.cost = (w.cost || 0) + 3;
  if (policy.requireCitation) w.grounded = (w.grounded || 0) + 2;

  return Object.keys(PROVIDERS).map((key) => {
    const t = PROVIDERS[key].traits;
    const score =
      (w.grounded || 0) * t.grounded +
      (w.latency || 0) * t.latency +
      (w.reasoning || 0) * t.reasoning +
      (w.cost || 0) * t.cost;
    return { provider: key, vendor: PROVIDERS[key].vendor, model: PROVIDERS[key].id, score };
  });
}

// --- Eval / guardrail gate -----------------------------------------------------
// The fail-closed gate. It takes the deterministic SIGNALS extracted from the
// model's answer plus the policy, and renders one verdict. Every rule cites the
// signal it fired on, so a reviewer can trace any verdict to a line of code.
//
// Fail-closed principle: when a required property is MISSING or AMBIGUOUS, the
// verdict defaults to REJECT, never a silent PASS. This is the exact discipline
// that dragged a real LLM verifier's false-positive rate from ~30% to under 5%:
// the cost of a wrong "ship it" is far higher than the cost of a human glance.

export function asBool(v) {
  return v === true;
}

// Coerce an extracted signal object to a known shape so a malformed model response
// degrades to "reject for review" instead of crashing the gate.
export function normalizeSignals(raw) {
  const s = raw && typeof raw === "object" ? raw : {};
  return {
    refused: asBool(s.refused),
    answer_present: asBool(s.answer_present),
    contains_citation: asBool(s.contains_citation),
    contains_pii: asBool(s.contains_pii),
    pii_kinds: Array.isArray(s.pii_kinds) ? s.pii_kinds.filter((x) => typeof x === "string").slice(0, 10) : [],
    hedged: asBool(s.hedged),
    on_topic: asBool(s.on_topic),
    self_contradiction: asBool(s.self_contradiction),
  };
}

// Build the active policy from the task profile + caller overrides.
export function resolvePolicy(taskType, override = {}) {
  const task = TASK_PROFILES[taskType] || TASK_PROFILES[DEFAULT_TASK];
  return {
    requireCitation: override.requireCitation === true || task.requireCitation === true,
    forbidPii: override.forbidPii !== false, // default ON — fail closed on PII
    requireOnTopic: override.requireOnTopic !== false, // default ON
    requireConfidence: override.requireConfidence === true,
  };
}

export function evaluate(rawSignals, policy) {
  const s = normalizeSignals(rawSignals);
  const checks = [];
  const push = (name, status, detail) => checks.push({ name, status, detail });

  // 1. Refusal / empty answer -> hard reject. Never let an empty answer ship.
  if (s.refused) {
    push("Answer produced", "reject", "The model refused or declined to answer. Routed to a human.");
  } else if (!s.answer_present) {
    push("Answer produced", "reject", "No usable answer was returned. Fail closed — never ship an empty result.");
  } else {
    push("Answer produced", "pass", "The model returned a usable answer.");
  }

  // 2. On-topic guardrail.
  if (policy.requireOnTopic) {
    if (s.on_topic) push("On topic", "pass", "Answer addresses the request.");
    else push("On topic", "reject", "Answer drifts off the request. Fail closed.");
  }

  // 3. Citation requirement (the grounding gate).
  if (policy.requireCitation) {
    if (s.contains_citation) push("Citation present", "pass", "Answer cites a source as policy requires.");
    else push("Citation present", "reject", "Policy requires a citation and none was found. Fail closed.");
  }

  // 4. PII guardrail.
  if (policy.forbidPii) {
    if (s.contains_pii)
      push("No PII leaked", "reject",
        `Answer appears to contain PII (${s.pii_kinds.join(", ") || "unspecified"}). Fail closed.`);
    else push("No PII leaked", "pass", "No personally identifiable information detected.");
  }

  // 5. Self-contradiction -> reject (a contradiction is never shippable).
  if (s.self_contradiction)
    push("Internally consistent", "reject", "Answer contradicts itself. Fail closed.");
  else push("Internally consistent", "pass", "No internal contradiction detected.");

  // 6. Confidence/hedging -> graded review, not auto-reject, where a human should look.
  if (policy.requireConfidence) {
    if (s.hedged)
      push("Confidence", "review", "Answer is hedged where the policy wants a firm result. Send to a human.");
    else push("Confidence", "pass", "Answer is stated with the required confidence.");
  } else if (s.hedged) {
    push("Confidence", "review", "Answer is hedged. Flagged for a human glance (not blocking).");
  }

  return { verdict: rollup(checks), checks };
}

// Roll the per-check statuses into one verdict. Reject dominates; then review.
export function rollup(checks) {
  if (checks.some((c) => c.status === "reject")) return "reject";
  if (checks.some((c) => c.status === "review")) return "review";
  return "pass";
}

// One call the function layer uses: route, then (after extraction) evaluate.
// Kept here so the same pipeline shape is unit-tested offline.
export function decide(taskType, signals, policyOverride = {}) {
  const policy = resolvePolicy(taskType, policyOverride);
  return evaluate(signals, policy);
}
