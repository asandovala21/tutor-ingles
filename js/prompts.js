// Prompts de sistema y esquemas JSON para cada modo.
import { KNOWN_GRAMMAR, GRAMMAR_TOPICS, MAX_SESSIONS, topicById } from './curriculum.js';
import { progress } from './store.js';
import { TENSE_USES, TENSE_COMPARISONS } from './tenses.js';

const LEARNER_PROFILE = `The learner is a Spanish-speaking professional from Chile who works in Data & Digital (Technology, BHP Minerals Americas, sites like Escondida and Spence). Their meetings in English are with global teams in Australia (data utilities / data engineering, platform and architecture teams, cybersecurity, project managers) and with vendors. Many Australian colleagues are Indian-Australian. Typical topics: integrating vendor APIs and equipment data into Snowflake (RAW / QA / Conformed layers), data paths from mobile equipment to the cloud (OT / IT / DMZ, VPN, LTE networks, field gateways), 1 Hz data vs batch vs real-time, data volume and completeness, support models (global vs local, knowledge transfer, transition to operations), governance (HLD, architecture panel, CIA rating, cybersecurity assessments), cost estimates and vendor quotes, data quality, reusable ingestion patterns, project status updates, and following up on open actions.

Goals: speak with confidence in these meetings, improve grammar, pronunciation and fluency, and understand Australian and Indian-Australian accents.

The learner prepares meetings in deliberately simple, clear English (short sentences, one idea each). Value clarity: never push them to sound complicated. Help them sound natural and professional, using the kind of phrases their colleagues actually use, for example: "Does that make sense?", "What I'm saying is…", "If I understand correctly…", "Could you confirm whether…?", "It might be worth…", "I get that, but…", "Let's circle back on that", "Can we record this as an open action?", "I'll follow up by email", "We're at time".

Grammar the learner already handles: ${KNOWN_GRAMMAR.join('; ')}.

Grammar the learner does NOT handle yet (curriculum, by id; level 1 = most used in their real meetings): ${GRAMMAR_TOPICS.map((t) => `${t.id} (L${t.level}) = ${t.title}`).join('; ')}.

All explanations for the learner are written in Spanish (Chilean-friendly, clear, no jargon). All examples and role-play speech are in English. Context is always BHP data, technology and project meetings.`;

function progressBlock(errorCount = 15) {
  const introduced = progress.introduced.map((id) => topicById(id)?.title || id);
  const recent = progress.errors.slice(0, errorCount).map((e) => `"${e.original}" -> "${e.correction}" (${e.grammar_topic})`);
  return `Learner progress so far:
- Grammar topics already introduced to the learner during meetings: ${introduced.join(', ') || 'none yet'}.
- Recent mistakes: ${recent.join('; ') || 'none recorded yet'}.`;
}

/** Resumen detallado del aprendizaje para el chat de dudas. */
function learningBlock() {
  const modules = Object.entries(progress.modules)
    .map(([id, m]) => `${topicById(id)?.title || id}: ${m.sessions.map((s) => `S${s.n} ${s.score}%`).join(', ')}`);
  const counts = {};
  for (const e of progress.errors) counts[e.grammar_topic] = (counts[e.grammar_topic] || 0) + 1;
  const weak = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8)
    .map(([id, n]) => `${topicById(id)?.title || id} (${n})`);
  const pron = Object.entries(progress.pron || {})
    .map(([id, scores]) => `${id}: avg ${Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)}% over ${scores.length} tries`);
  return `${progressBlock(40)}
- Grammar module sessions done (score per session): ${modules.join('; ') || 'none yet'}.
- Most frequent mistake areas (count): ${weak.join(', ') || 'none yet'}.
- Pronunciation practice (speech-recognition match score by sound set): ${pron.join('; ') || 'none yet'}.`;
}

// Pronunciación escrita para hispanohablantes (igual que en las frases fijas de la app).
const PRON_GUIDE = `Approximate pronunciation written for a Spanish (Chilean) reader: hyphenated syllables, the stressed syllable in CAPITALS, Spanish spelling for sounds (e.g. "I have a question" -> "ai jav a KUES-chon", "data" -> "DEI-ta", "schedule" -> "SKE-yul"). Conventions: "z" = th as in think, "dh" = th as in this, "j" = soft English h, "ii"/"uu" = long vowels, "sh" as in share, "y" for the j/y sounds of "job"/"yes".`;

// ---------------- Simulación de reuniones ----------------

export const MEETING_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['speaker', 'reply', 'reply_es', 'reply_pron', 'feedback'],
  properties: {
    speaker: { type: 'string', description: 'Name of the participant who speaks this turn.' },
    reply: { type: 'string', description: 'What the participant says out loud, in English. 1-4 sentences, natural spoken style.' },
    reply_es: { type: 'string', description: 'Natural Spanish translation of reply.' },
    reply_pron: { type: 'string', description: 'Approximate pronunciation of reply for a Spanish reader.' },
    feedback: {
      type: 'object',
      additionalProperties: false,
      required: ['overall_es', 'corrected', 'corrected_pron', 'better_native', 'better_native_pron', 'errors', 'new_grammar', 'pronunciation'],
      properties: {
        overall_es: { type: 'string' },
        corrected: { type: 'string' },
        corrected_pron: { type: 'string', description: 'Approximate pronunciation of corrected ("" if empty).' },
        better_native: { type: 'string' },
        better_native_pron: { type: 'string', description: 'Approximate pronunciation of better_native for a Spanish reader ("" if better_native is empty).' },
        errors: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['original', 'correction', 'explanation_es', 'grammar_topic'],
            properties: {
              original: { type: 'string' },
              correction: { type: 'string' },
              explanation_es: { type: 'string' },
              grammar_topic: { type: 'string' },
            },
          },
        },
        new_grammar: {
          type: 'object',
          additionalProperties: false,
          required: ['topic_id', 'title', 'explanation_es', 'examples'],
          properties: {
            topic_id: { type: 'string' },
            title: { type: 'string' },
            explanation_es: { type: 'string' },
            examples: {
              type: 'array',
              items: {
                type: 'object',
                additionalProperties: false,
                required: ['en', 'es', 'pron'],
                properties: { en: { type: 'string' }, es: { type: 'string' }, pron: { type: 'string' } },
              },
            },
          },
        },
        pronunciation: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['word', 'word_pron', 'tip_es'],
            properties: { word: { type: 'string' }, word_pron: { type: 'string' }, tip_es: { type: 'string' } },
          },
        },
      },
    },
  },
};

export function meetingSystem({ character, scenario, transcript, focusTopic, myName }) {
  const stable = `You are an English tutor for a BHP professional, running a realistic meeting simulation. You play the other meeting participant(s) AND you give the learner feedback after every learner turn.

${LEARNER_PROFILE}

## Your character (main voice)
Name: ${character.name}
Role: ${character.role}
Speaking style: ${character.style}
Speak the way this person really speaks in a BHP Teams meeting: natural, realistic pace of ideas, short spoken turns (1-4 sentences), with fillers and expressions typical of the accent. Ask follow-up questions that force the learner to talk. Push back sometimes, ask for numbers, dates and reasons, like a real meeting. Don't lecture inside the role-play: corrections go ONLY in the feedback object, never in "reply".

## Meeting
${transcript
    ? `Simulate a meeting based on the real transcript below. Recreate its topics, people, jargon and dynamics. ${myName ? `The learner is "${myName}" in the transcript; they take that role.` : 'The learner takes the role of the Chilean / Latin American participant (or the most natural role for them).'} You may voice other participants from the transcript (set "speaker" to their name), but keep ${character.name}'s accent and style as the main voice. Vary the conversation: don't just repeat the transcript, ask the learner to explain, update, agree/disagree, as if it were the next meeting on the same topics.

<transcript>
${transcript}
</transcript>`
    : `Scenario: ${scenario.title} — ${scenario.desc}`}

## Translation and pronunciation
reply_es: a natural Spanish translation of your reply. reply_pron, corrected_pron, better_native_pron, new_grammar example "pron" and pronunciation "word_pron": ${PRON_GUIDE} New grammar examples also need "es" (Spanish translation).

## Feedback rules (the "feedback" object, after each learner turn)
- overall_es: 1-2 short sentences in Spanish: what was good and the main thing to improve. Encouraging but honest.
- corrected: the learner's utterance with grammar fixed minimally (empty string if it was already correct).
- better_native: how a fluent professional at BHP would say it (more natural / diplomatic).
- errors: every real grammar/vocabulary error with a short Spanish explanation. grammar_topic must be the most specific curriculum id above (there are also review ids for basics such as present-simple, past-simple, questions-word-order, subject-verb, countable-another, articles, prepositions, false-friends), or "vocab" for word choice.
- new_grammar: THIS IS KEY. Use the correction moment to introduce ONE grammar point from the curriculum that the learner has NOT been introduced to yet (see progress), preferably one that fits what they just tried to say, and prefer level-1 topics first (e.g. they said "I work here since 2020" -> introduce present perfect continuous). Explain it briefly in Spanish with 2 BHP examples. Then in your next turns, use that structure in your "reply" and ask questions that make the learner use it. If no new point fits naturally this turn, return topic_id "" and empty fields. Don't introduce a new point every single turn: about every 2-3 turns is right.
- pronunciation: the learner's text comes from speech recognition. Words that the recognizer got wrong or with low confidence probably reveal pronunciation problems (typical Spanish-speaker issues: th, v/b, short i vs long ee, -ed endings, initial s+consonant, schwa, word stress, h). Give 0-3 tips in Spanish for words that matter. Empty array if typed or nothing notable.
- When the user message is [START], open the meeting naturally (greeting + small talk or first agenda item), with empty feedback (empty strings and arrays, new_grammar.topic_id "").
- When the user message is [END], close the meeting politely in "reply", and in feedback.overall_es give a summary in Spanish of the whole session: strengths, top 3 recurring mistakes, grammar introduced and what to practise next.`;

  const volatile = `${progressBlock()}
${focusTopic ? `\nFocus for this meeting: steer the conversation so the learner needs to use "${topicById(focusTopic)?.title}". Use it yourself in your replies and correct it carefully.` : ''}`;

  return [
    { type: 'text', text: stable, cache_control: { type: 'ephemeral' } },
    { type: 'text', text: volatile },
  ];
}

export function learnerTurnText(text, stt) {
  if (!stt) return `${text}\n\n(typed, not spoken)`;
  const alts = stt.alternatives?.length > 1 ? ` Other hypotheses: ${stt.alternatives.slice(1).map((a) => `"${a}"`).join(', ')}.` : '';
  const conf = typeof stt.confidence === 'number' && stt.confidence > 0 ? ` Recognizer confidence: ${stt.confidence.toFixed(2)}.` : '';
  const edited = stt.edited ? ' The learner then edited the text by hand.' : '';
  return `${text}\n\n(spoken; speech-recognition transcript. Punctuation was added automatically from pauses: "..." marks a pause or hesitation in the middle of a sentence. Do not correct punctuation or capitalisation.${conf}${alts}${edited})`;
}

// ---------------- Módulos de gramática ----------------

const SESSION_PLANS = {
  1: 'Session 1 — Introduction: form (affirmative, negative, question), main uses, time expressions/signals, and contrast with the tenses the learner already knows. 6 exercises: mostly "fill" and "choose".',
  2: 'Session 2 — Controlled practice: 8 exercises mixing "fill", "choose" and "transform", all in BHP meeting/report contexts.',
  3: 'Session 3 — Translation & transformation: 8 exercises, half "translate" (Spanish -> English, typical Chilean workplace sentences) and half "transform"; target the typical mistakes Spanish speakers make with this structure.',
  4: 'Session 4 — Speaking production: 5 "speak" exercises (a question a colleague asks in a meeting, which the learner must answer aloud using the structure) plus 2 "transform".',
  5: 'Session 5 — Final assessment: 10 mixed exercises including contrast with nearby structures and at least 2 "speak".',
};

export const LESSON_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['title', 'objective_es', 'explanation_es', 'examples', 'exercises'],
  properties: {
    title: { type: 'string' },
    objective_es: { type: 'string' },
    explanation_es: { type: 'string', description: 'Spanish explanation. Use short paragraphs, "- " bullets and **bold** for key forms.' },
    examples: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['en', 'es', 'pron'],
        properties: { en: { type: 'string' }, es: { type: 'string' }, pron: { type: 'string' } },
      },
    },
    exercises: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'type', 'instruction_es', 'prompt', 'options'],
        properties: {
          id: { type: 'string' },
          type: { type: 'string', enum: ['fill', 'choose', 'translate', 'transform', 'speak'] },
          instruction_es: { type: 'string' },
          prompt: { type: 'string', description: 'For fill: sentence with ____ gap and the base verb in brackets.' },
          options: { type: 'array', items: { type: 'string' }, description: 'Only for choose; empty otherwise.' },
        },
      },
    },
  },
};

export function lessonSystem() {
  return [
    {
      type: 'text',
      text: `You are an expert English grammar teacher creating short, practical lessons for a BHP professional.\n\n${LEARNER_PROFILE}\n\nEach topic has at most ${MAX_SESSIONS} sessions. Make every example and exercise about the learner's real work: Teams meetings with Perth/Brisbane, data integration, APIs, Snowflake, architecture, vendors, support models, governance, project status, emails and follow-ups. Be concise: a lesson should take about 10 minutes. Explanations must be complete and clear: the form (affirmative, negative, question, contractions), EVERY main use with a short example, time expressions, and the contrast with similar structures. For each example give the Spanish translation and the pronunciation. ${PRON_GUIDE}`,
      cache_control: { type: 'ephemeral' },
    },
    { type: 'text', text: progressBlock() },
  ];
}

const TOPIC_NOTES = {
  'verb-tenses-map': 'This topic is an overview of ALL 12 English tenses (present/past/future × simple/continuous/perfect/perfect continuous) plus "used to" and "would": for each, the form, the main uses and one meeting example, and how to choose between them. Exercises: choosing the right tense in context.',
  level0: 'The learner already uses this structure but needs to master it: cover ALL its uses (including the less obvious ones), typical Spanish-speaker mistakes, and the contrast with the tenses it is confused with.',
};

// Qué usos de TENSE_USES debe cubrir cada tema de gramática.
const TOPIC_TENSES = {
  'verb-tenses-map': TENSE_USES.map((t) => t.id),
  'tense-alt-uses': TENSE_USES.map((t) => t.id),
  'present-simple': ['present-simple'],
  'present-continuous': ['present-continuous'],
  'verb-to-be': ['to-be'],
  'past-simple': ['past-simple'],
  'past-continuous': ['past-continuous'],
  'present-perfect': ['present-perfect'],
  'present-perfect-continuous': ['present-perfect-continuous'],
  'past-perfect': ['past-perfect'],
  'past-perfect-continuous': ['past-perfect-continuous'],
  'future-forms': ['will', 'going-to', 'present-continuous', 'present-simple'],
  'will-uses': ['will'],
  'future-continuous': ['future-continuous'],
  'future-perfect': ['future-perfect'],
  'future-perfect-continuous': ['future-perfect'],
  'would-conditional': ['would'],
  'would-past-habits': ['would', 'used-to'],
  'would-complaints': ['would'],
  'used-to-forms': ['used-to'],
  'past-politeness': ['past-simple', 'past-continuous'],
};

function tenseUsesNote(topicId) {
  const ids = TOPIC_TENSES[topicId];
  if (!ids) return '';
  const only = topicId === 'tense-alt-uses';
  const lines = TENSE_USES.filter((t) => ids.includes(t.id)).map((t) =>
    `- ${t.name}: ${t.uses.filter((u) => !only || u.alt).map((u) => `${u.alt ? '✨' : ''}${u.name} (e.g. "${u.ex}")`).join('; ')}`,
  );
  return `Cover ALL of these uses (✨ = less obvious "alternative" uses that learners usually miss; mark them with ✨ in the explanation too):\n${lines.join('\n')}`;
}

export function lessonRequest(topic, n, previousScores) {
  let note = TOPIC_NOTES[topic.id] || (topic.level === 0 ? TOPIC_NOTES.level0 : '');
  if (topic.id === 'tense-comparisons') {
    note = `Teach how to CHOOSE between confusable tenses. Pairs: ${TENSE_COMPARISONS.map((c) => `${c.a} vs ${c.b} (${c.rule})`).join(' | ')}. Exercises must force a choice between the two tenses of a pair, in meeting contexts.`;
  }
  note = [note, tenseUsesNote(topic.id)].filter(Boolean).join('\n');
  return `Create session ${n} of ${MAX_SESSIONS} for the topic "${topic.title}" (${topic.es}).
${note}
${SESSION_PLANS[n]}
${previousScores.length ? `Previous session scores for this topic: ${previousScores.join(', ')}. Adjust difficulty accordingly and revisit weak areas.` : ''}
Give 4-6 examples with Spanish translations. Exercise ids: "e1", "e2", ...`;
}

export const GRADE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['results', 'score', 'summary_es', 'next_tip_es'],
  properties: {
    results: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'correct', 'correct_answer', 'correct_answer_es', 'correct_answer_pron', 'explanation_es'],
        properties: {
          id: { type: 'string' },
          correct: { type: 'boolean' },
          correct_answer: { type: 'string', description: 'The full correct sentence in English.' },
          correct_answer_es: { type: 'string', description: 'Spanish translation of the correct sentence.' },
          correct_answer_pron: { type: 'string', description: PRON_GUIDE },
          explanation_es: { type: 'string' },
        },
      },
    },
    score: { type: 'integer', description: '0-100' },
    summary_es: { type: 'string' },
    next_tip_es: { type: 'string' },
  },
};

export function gradeRequest(answers) {
  return `Grade my answers. Accept any grammatically correct and natural answer, not only the one you had in mind. For "speak" answers the text comes from speech recognition: ignore punctuation/capitalisation and focus on grammar. Explain each mistake briefly in Spanish.

${answers.map((a) => `${a.id}: ${a.answer || '(no answer)'}`).join('\n')}`;
}

// ---------------- Pronunciación ----------------

export const PRON_FEEDBACK_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['score', 'summary_es', 'issues'],
  properties: {
    score: { type: 'integer' },
    summary_es: { type: 'string' },
    issues: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['word', 'likely_problem_es', 'tip_es'],
        properties: { word: { type: 'string' }, likely_problem_es: { type: 'string' }, tip_es: { type: 'string' } },
      },
    },
  },
};

export const PRON_SENTENCES_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['sentences'],
  properties: {
    sentences: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['en', 'es', 'pron'],
        properties: { en: { type: 'string' }, es: { type: 'string' }, pron: { type: 'string', description: PRON_GUIDE } },
      },
    },
  },
};

export function pronSystem() {
  return [
    {
      type: 'text',
      text: `You are a pronunciation coach for a Spanish-speaking (Chilean) professional at BHP who wants to be understood clearly by Australian and Indian-Australian colleagues. You only have the speech-recognition transcript (no audio), so infer likely pronunciation problems from the differences between the target sentence and what the recognizer heard, using your knowledge of typical Spanish-speaker errors (th, v/b, short/long vowels, schwa, -ed endings, s+consonant clusters, final consonants, h, word stress). Answer in Spanish, short and practical (mouth/tongue position, a minimal pair to practise). Don't invent problems if the transcript matches.`,
      cache_control: { type: 'ephemeral' },
    },
  ];
}

// ---------------- Chat de dudas ----------------

/**
 * Sistema del chat: perfil, transcripciones (bloque estable, en caché) y
 * progreso + reuniones simuladas recientes (bloque variable).
 */
export function chatSystem({ transcripts = [], meetings = [] }) {
  const docs = transcripts.length
    ? `\n\n## The learner's real meeting transcripts and work documents\nUse them to understand their real context: topics, people's roles, vocabulary, how colleagues actually speak. Some participants make grammar mistakes in the transcripts: never use those as models.\n\n${transcripts
        .map((t) => `<document name="${t.name.replace(/"/g, "'")}">\n${t.text}\n</document>`)
        .join('\n\n')}`
    : '';
  const stable = `You are the learner's personal English tutor and coach, answering their questions in a chat inside their English-practice app.

${LEARNER_PROFILE}

## How to answer
- Answer in Spanish by default (the learner's language), with English examples. If they write in English or ask for English, answer in English.
- Be practical and concrete: short explanations, then examples from THEIR work (data integration, Snowflake, architecture, vendors, support models, status updates, follow-ups) and, when relevant, from their real meetings below.
- When they ask "how do I say X", give 2-3 natural options (simple/clear first, then more native), mark which one Australian colleagues would use, and add pronunciation tips for difficult words (Spanish-speaker issues).
- When they ask what to practise, use their progress and mistakes below to recommend specific grammar modules, scenarios or sound sets from the app.
- When they ask about which tense to use, compare the confusable tenses explicitly (rule, signal words, how to decide) and include the less obvious "alternative" uses (e.g. present continuous for temporary or annoying habits and arrangements, present simple for timetables, past tenses for politeness, will for assumptions, would/used to for past habits).
- When they ask to practise a topic, briefly explain it (with examples from their work) and then give ONE short exercise at a time (fill the gap, translate, transform, or "answer this meeting question"); wait for their answer, correct it kindly, explain the mistake, and give the next one. After 5 exercises, summarise how they did.
- For key English phrases you recommend, add the approximate pronunciation in parentheses on the next line. ${PRON_GUIDE}
- When they ask to prepare a meeting or an email, write it in clear, simple, professional English that they can actually say, and explain new structures briefly.
- Use simple Markdown: short paragraphs, "- " bullets and **bold**. No tables. Keep answers reasonably short unless they ask for more.${docs}`;
  const recentMeetings = meetings.length
    ? `\n\nRecent simulated meetings in the app (most recent first):\n${meetings
        .map((m) => `- ${m.date.slice(0, 10)} · ${m.scenario} with ${m.character}:\n${m.turns.map((t) => `  ${t.who}: ${t.text}`).join('\n')}`)
        .join('\n')}`
    : '';
  return [
    { type: 'text', text: stable, cache_control: { type: 'ephemeral' } },
    { type: 'text', text: `${learningBlock()}${recentMeetings}` },
  ];
}
