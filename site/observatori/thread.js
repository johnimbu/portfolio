// The live page's threads (step 12), shared by the live page and, later, the replay. Pure functions over the feed's
// events, so they render the same way in a browser and in the tests.

export const AGENT_NAMES = {
  scout: 'Scout', researcher: 'Researcher', analyst: 'Analyst', skeptic: 'Skeptic', reviewer: 'Reviewer', editor: 'Editor',
  referee: 'Referee', check: 'Code',
};
export const AGENT_COLORS = {
  scout: '#5fcfb8', researcher: '#79b8ff', analyst: '#a9cfff', skeptic: '#f0a43a', reviewer: '#9fe3d3', editor: '#f2a7c3',
  referee: '#c9b6ff', check: '#d7dfec',
};
const STEP_NAMES = {
  search: 'searching', screen: 'screening what it found', fetch: 'reading the papers', assess: 'weighing each paper', claims: 'drafting claims',
  analysis: 'interpreting the claims', challenge_search: 'searching for evidence against the claims', challenge_screen: 'screening that evidence',
  challenge_fetch: 'reading that evidence', challenge_review: 'checking every claim', reply: 'answering a challenge', rebuttal: 'answering the reply',
  revise: 'rewriting a claim', draft: 'writing the brief', semantic_review: 'reading every sentence of the brief', referee: 'making a call',
  settle: 'settling what is left', approve: 'running the final checks',
};
export const SERVICES = { arxiv: 'arXiv', openalex: 'OpenAlex', europepmc: 'Europe PMC', pubmed: 'PubMed', crossref: 'Crossref', biorxiv: 'bioRxiv', medrxiv: 'medRxiv' };
const VERDICTS = { holds: 'holds', overstated: 'overstated', unsupported: 'unsupported', contradicted: 'contradicted', inconclusive: 'inconclusive' };
const OUTCOMES = { remove: 'left out', retain_contested: 'kept, marked contested', revise: 'to be rewritten', withdrawn: 'challenge withdrawn' };

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** The page's items in recorded order: single events, and each disagreement's events kept together as one thread. */
export function itemsOf(events) {
  const items = [];
  const threads = new Map();
  // A verdict the thread repeats word for word (the challenge it opened) says it once, in the thread.
  const challenged = new Set(events.filter((e) => e.kind === 'challenge' && e.text).map((e) => `${e.claim}\u0000${e.text}`));
  for (const e of events) {
    // "Working" only says what the lab is doing now (the line under the title), not a line of its own.
    if (e.kind === 'working') continue;
    // A comment or the Scout's pick is only its words: without them (taken off by a check) there is no line (step 13).
    if ((e.kind === 'comment' || e.kind === 'pick') && !e.excerpt) continue;
    if (e.kind === 'verdict' && e.text && challenged.has(`${e.claim}\u0000${e.text}`)) continue;
    if (e.thread) {
      let t = threads.get(e.thread);
      if (!t) { t = { kind: 'thread', id: e.thread, claim: e.claim, events: [] }; threads.set(e.thread, t); items.push(t); }
      t.events.push(e);
    } else items.push({ kind: 'event', event: e });
  }
  return items;
}

/** Newest first, for the live page: each item goes by its latest line, so a thread rises as it gets a new one;
 *  a thread's own lines stay in reading order. */
export function newestFirst(items) {
  const last = (it) => (it.kind === 'thread' ? Math.max(...it.events.map((e) => e.id)) : it.event.id);
  return [...items].sort((a, b) => last(b) - last(a));
}

/** Where to read a study (John, October 29, 2026): its DOI, else its arXiv page, else nowhere. Only a value that is
 *  plainly an identifier, so nothing in it can leave the link. */
export function studyUrl(s) {
  const doi = String(s?.doi ?? '').trim().replace(/^https?:\/\/(dx\.)?doi\.org\//i, '').replace(/^doi:\s*/i, '');
  if (/^10\.[0-9]{3,9}\/[^\s"'<>&\\]+$/.test(doi)) return 'https://doi.org/' + doi;
  const ax = String(s?.arxiv ?? '').trim().replace(/^https?:\/\/arxiv\.org\/abs\//i, '').replace(/^arxiv:\s*/i, '');
  if (/^([0-9]{4}\.[0-9]{4,5}|[a-z-]+(\.[A-Z]{2})?\/[0-9]{7})(v[0-9]+)?$/.test(ax)) return 'https://arxiv.org/abs/' + ax;
  return null;
}
/** "Read the study", opening the paper in a new tab; nothing when there is nowhere to read it. */
export const readLink = (url) => url ? `<a class="read" href="${esc(url)}" target="_blank" rel="noopener">Read the study</a>` : '';

const COUNT = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
/** Why a claim flagged for its numbers shows with some masked, never saying the number (John, October 29, 2026). */
export const flagReason = (n) => `Code couldn’t find ${n > 1 && n <= 10 ? COUNT[n] + ' of its numbers' : n > 10 ? 'some of its numbers' : 'one of its numbers'} in the passage it quotes.`;
// Why code flagged a claim, in plain words, check by check (John, October 29, 2026: a flagged claim always shows its
// text and why). `unfound`: how many numbers the number check couldn't find, when it names them.
const FLAG_REASONS = {
  support_present: 'None of the passages it quotes supports it.',
  passage_in_snapshot: 'Code couldn’t find its quote in the paper.',
  calculation_recompute: 'Code redid its calculation and got a different result.',
  evidence_policy: 'Its evidence doesn’t meet the lab’s rule for this kind of claim.',
};
export function flagReasons(flags, unfound) {
  const list = Array.isArray(flags) && flags.length ? flags : ['number_support'];
  return list.map((f) => (f === 'number_support' ? (unfound ? flagReason(unfound) : 'Code couldn’t find its numbers in the passages it quotes.') : FLAG_REASONS[f]))
    .filter(Boolean).join(' ');
}

/** How far the Skeptic's review has got (John, October 29, 2026): of the claims in play (drafted, not settled out),
 *  how many have a verdict on their current version. The review runs in batches, so this moves between them. */
export function reviewedOf(events) {
  const claims = new Map();
  for (const e of events) {
    if (!e.claim) continue;
    const c = claims.get(e.claim) ?? { since: -1, reviewed: false, out: false };
    if (e.kind === 'claim') { c.since = e.id; c.reviewed = false; }
    if (e.kind === 'verdict' && c.since >= 0 && e.id > c.since) c.reviewed = true;
    // Once removed, out for good, as on the record: a later dispute withdrawn doesn't bring it back (review, finding 5).
    if (e.kind === 'settled') c.out = c.out || e.detail?.outcome === 'remove';
    claims.set(e.claim, c);
  }
  const live = [...claims].filter(([, c]) => c.since >= 0 && !c.out);
  const keys = live.filter(([, c]) => c.reviewed).map(([k]) => k);
  return { done: keys.length, of: live.length, keys };
}

/** Each claim's text and where it stands now, from what the feed has shown so far. A claim code flagged has its text,
 *  with any unverified numbers masked, and why (`reason`). */
export function claimsOf(events) {
  const out = new Map();
  for (const e of events) {
    if (!e.claim) continue;
    const c = out.get(e.claim) ?? { key: e.claim, text: null, status: 'drafted', reason: null };
    if (e.kind === 'claim') {
      const flagged = e.detail?.status === 'failed a check';
      c.text = flagged ? (typeof e.detail.text === 'string' ? e.detail.text : null) : e.text ?? c.text;
      c.reason = flagged ? flagReasons(e.detail.flags, Number(e.detail.unfound) || 0) : null;
      c.status = flagged ? 'flagged by code' : 'provisional · not yet challenged';
    }
    if (e.kind === 'verdict') c.status = `the Skeptic: ${VERDICTS[e.detail?.verdict] ?? e.detail?.verdict ?? 'reviewed'}`;
    if (e.kind === 'challenge') c.status = 'challenged';
    if (e.kind === 'settled') c.status = OUTCOMES[e.detail?.outcome] ?? e.detail?.outcome ?? 'settled';
    out.set(e.claim, c);
  }
  return out;
}

/** The lab's log of an event: a fact from the record, in plain words, written by code. It names the agent as its
 *  subject, because it is the lab speaking about the agent, never the agent speaking. */
export function factOf(e) {
  const d = e.detail ?? {};
  const by = AGENT_NAMES[e.agent] && e.agent !== 'check' ? `The ${AGENT_NAMES[e.agent]}` : 'The lab';
  switch (e.kind) {
    case 'stage': return d.stage === 'evidence_review' ? 'Evidence review begins: every claim goes to the Skeptic.' : 'Evidence review is done. The brief comes next.';
    case 'working': return `Working: ${STEP_NAMES[d.step] ?? 'on the next step'}.`;
    case 'search': {
      const s = SERVICES[d.service] ?? d.service ?? 'a database';
      return d.results != null ? `${by} searched ${s}: ${d.results} results.` : `${by} searched ${s}.`;
    }
    case 'kept': return `${by} kept “${d.source}”.`;
    case 'assessed': return `${by} read “${d.source}” in full.`;
    case 'claim': return d.status !== 'failed a check' ? `${by} drafted a claim.`
      : typeof d.text === 'string' ? `Code flagged a claim: “${d.text}” ${flagReasons(d.flags, Number(d.unfound) || 0)}` : `Code flagged a claim. ${flagReasons(d.flags, Number(d.unfound) || 0)}`;
    case 'verdict': return `${by}'s verdict: ${VERDICTS[d.verdict] ?? d.verdict ?? 'reviewed'}.`;
    case 'challenge': return d.challenge === 'failed_check' ? 'Code flagged this claim.'
      : d.challenge === 'cross_cluster_contradiction' ? 'An independent study contradicts this claim, so code opened a challenge.' : 'The Skeptic challenged this claim.';
    case 'reply': return d.stance === 'concede' ? 'The writer concedes.' : d.stance === 'defend' ? 'The writer defends the claim.' : 'No reply.';
    case 'rebuttal': return d.stance === 'withdraw' ? 'The Skeptic withdraws the challenge.' : 'The Skeptic maintains the challenge.';
    case 'settled': return `Settled: ${OUTCOMES[d.outcome] ?? d.outcome}${d.by === 'agents' ? ', by the debate\'s rules' : ''}.`;
    case 'brief': return 'The Editor wrote the brief.';
    case 'approved': return 'Every rule holds. Approved by code.';
    case 'published': return 'Published to the site.';
    default: return '';
  }
}

/** One line. An agent's name heads only that agent's own recorded words (the excerpt, and the whole checked text to
 *  expand), with the lab's log of the event under it. A line with no words of the agent's is the log's alone. */
export function lineHtml(e) {
  // Role first, as every page names a speaker: "The Skeptic" (part 3; the model shows on the speech line and the seat).
  const who = e.agent ? `<span class="who" style="--c:${AGENT_COLORS[e.agent] ?? '#d7dfec'}">${esc(AGENT_NAMES[e.agent] && e.agent !== 'check' ? `The ${AGENT_NAMES[e.agent]}` : AGENT_NAMES[e.agent] ?? e.agent)}</span>` : '';
  const tag = e.claim ? `<button class="ctag" type="button" data-claim="${esc(e.claim)}" aria-label="Show claim ${esc(e.claim)}">${esc(e.claim)}</button>` : '';
  const said = e.excerpt
    ? (e.text && e.text !== e.excerpt
      ? `<details class="said"><summary>“${esc(e.excerpt)}”</summary><p>“${esc(e.text)}”</p></details>`
      : `<p class="said">“${esc(e.excerpt)}”</p>`)
    : '';
  if (!said) return `<div class="line log-only k-${esc(e.kind)}" data-id="${e.id}"><p class="lab-log"><span class="lab">Log</span> ${esc(factOf(e))}</p>${tag}</div>`;
  // A line that is only the agent's words (a comment, the Scout's pick) has no log of its own.
  const fact = factOf(e);
  return `<div class="line k-${esc(e.kind)}" data-id="${e.id}"><div class="head">${who}${tag}</div>${said}${fact ? `<p class="lab-log">${esc(fact)}</p>` : ''}</div>`;
}

export function itemHtml(item) {
  if (item.kind === 'event') return lineHtml(item.event);
  return `<section class="thread" data-thread="${esc(item.id)}"><div class="thread-h"><button class="ctag" type="button" data-claim="${esc(item.claim)}">${esc(item.claim)}</button> a disagreement</div>${item.events.map(lineHtml).join('')}</section>`;
}

/** The claim card a [C9] tag opens. */
export function claimHtml(c) {
  return `<div class="claim-card" role="dialog" aria-label="Claim ${esc(c.key)}"><b>${esc(c.key)}</b> · <span class="st">${esc(c.status)}</span>${c.text ? `<p>“${esc(c.text)}”</p>${c.reason ? `<p class="dim">${esc(c.reason)}</p>` : ''}` : `<p class="dim">Code flagged this claim.${c.reason ? ` ${esc(c.reason)}` : ''}</p>`}</div>`;
}

/** The banner and the run's state, in plain words. */
export function stateOf(feed) {
  if (!feed || !feed.on) return { banner: null, note: 'Live watching is switched off.' };
  if (!feed.live && !feed.investigation) return { banner: null, note: 'The lab is quiet. Nothing is running right now.' };
  const st = feed.investigation?.state;
  if (st === 'approved') return { banner: null, note: 'Approved by code.', replay: feed.investigation.replay };
  if (st === 'withdrawn') return { banner: null, note: 'This investigation’s brief was taken down to be checked again. Its claims are off the page; the counts stay.' };
  if (st === 'ended_without_brief') return { banner: null, note: 'This investigation ended without an approved brief. Its claims are off the page; the counts stay.' };
  return {
    banner: 'In progress. Not yet checked: claims can still be challenged, rewritten or dropped.',
    note: st === 'paused' ? 'Paused for a person to look.' : null,
  };
}

/** What the lab is doing now, for the quiet stretches: the latest agent at work and since when. */
export function nowOf(events) {
  const w = [...events].reverse().find((e) => e.kind === 'working');
  return w ? { agent: w.agent, step: STEP_NAMES[w.detail?.step] ?? 'working', key: w.detail?.step ?? null, since: w.at } : null;
}

/** A model's name as people say it, from the ledger's id: claude-sonnet-5-5 is "Claude Sonnet 5.5", grok-4.7 is
 *  "Grok 4.7". A trailing date stamp is dropped. No model, no name. */
export function modelLabel(m) {
  const id = m && typeof m.model === 'string' ? m.model.trim() : '';
  if (!id) return '';
  const out = [];
  for (const w of id.split('-').filter((x) => x && !/^[0-9]{8}$/.test(x))) {
    const prev = out[out.length - 1];
    if (/^[0-9.]+$/.test(w) && prev && /^[0-9.]+$/.test(prev)) out[out.length - 1] = prev + '.' + w;
    else out.push(w);
  }
  return out.map((w) => (w === 'gpt' ? 'GPT' : w[0].toUpperCase() + w.slice(1))).join(' ');
}
