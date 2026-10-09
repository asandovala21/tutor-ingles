// Prompts de sistema y esquemas JSON para cada modo.
import { KNOWN_GRAMMAR, GRAMMAR_TOPICS, MAX_SESSIONS, topicById } from './curriculum.js';
import { progress } from './store.js';

const LEARNER_PROFILE = `The learner is a Spanish-speaking professional from Chile who works with BHP (mining: Escondida, Spence, Pampa Norte, Minerals Americas) and attends meetings in English with Australian colleagues, including Indian-Australians. Goals: speak with confidence in meetings, improve grammar, pronunciation and fluency, and understand Australian and Indian-Australian accents.

Grammar the learner already handles: ${KNOWN_GRAMMAR.join('; ')}.

Grammar the learner does NOT handle yet (curriculum, by id): ${GRAMMAR_TOPICS.map((t) => `${t.id} = ${t.title}`).join('; ')}.

All explanations for the learner are written in Spanish (Chilean-friendly, clear, no jargon). All examples and role-play speech are in English. Context is always BHP / mining / corporate meetings (safety, production, maintenance, shutdowns, projects, KPIs, stakeholders).`;

function progressBlock() {
  const introduced = progress.introduced.map((id) => topicById(id)?.title || id);
  const recent = progress.errors.slice(0, 15).map((e) => `"${e.original}" -> "${e.correction}" (${e.grammar_topic})`);
  return `Learner progress so far:
- Grammar topics already introduced to the learner during meetings: ${introduced.join(', ') || 'none yet'}.
- Recent mistakes: ${recent.join('; ') || 'none recorded yet'}.`;
}

// ---------------- Simulación de reuniones ----------------

export const MEETING_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['speaker', 'reply', 'feedback'],
  properties: {
    speaker: { type: 'string', description: 'Name of the participant who speaks this turn.' },
    reply: { type: 'string', description: 'What the participant says out loud, in English. 1-4 sentences, natural spoken style.' },
    feedback: {
      type: 'object',
      additionalProperties: false,
      required: ['overall_es', 'corrected', 'better_native', 'errors', 'new_grammar', 'pronunciation'],
      properties: {
        overall_es: { type: 'string' },
        corrected: { type: 'string' },
        better_native: { type: 'string' },
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
            examples: { type: 'array', items: { type: 'string' } },
          },
        },
        pronunciation: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['word', 'tip_es'],
            properties: { word: { type: 'string' }, tip_es: { type: 'string' } },
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

## Feedback rules (the "feedback" object, after each learner turn)
- overall_es: 1-2 short sentences in Spanish: what was good and the main thing to improve. Encouraging but honest.
- corrected: the learner's utterance with grammar fixed minimally (empty string if it was already correct).
- better_native: how a fluent professional at BHP would say it (more natural / diplomatic).
- errors: every real grammar/vocabulary error with a short Spanish explanation. grammar_topic must be one of the curriculum ids above, or "known" if it's about grammar they already handle, or "vocab" for word choice.
- new_grammar: THIS IS KEY. Use the correction moment to introduce ONE grammar point from the curriculum that the learner has NOT been introduced to yet (see progress), preferably one that fits what they just tried to say (e.g. they said "I work here since 2020" -> introduce present perfect continuous). Explain it briefly in Spanish with 2 BHP examples. Then in your next turns, use that structure in your "reply" and ask questions that make the learner use it. If no new point fits naturally this turn, return topic_id "" and empty fields. Don't introduce a new point every single turn: about every 2-3 turns is right.
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
  return `${text}\n\n(spoken; speech-recognition transcript.${conf}${alts})`;
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
        required: ['en', 'es'],
        properties: { en: { type: 'string' }, es: { type: 'string' } },
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
      text: `You are an expert English grammar teacher creating short, practical lessons for a BHP professional.\n\n${LEARNER_PROFILE}\n\nEach topic has at most ${MAX_SESSIONS} sessions. Make every example and exercise about BHP-style work: meetings with Perth/Brisbane, safety, production, maintenance, shutdowns, projects, KPIs, emails and reports. Be concise: a lesson should take about 10 minutes.`,
      cache_control: { type: 'ephemeral' },
    },
    { type: 'text', text: progressBlock() },
  ];
}

export function lessonRequest(topic, n, previousScores) {
  return `Create session ${n} of ${MAX_SESSIONS} for the topic "${topic.title}" (${topic.es}).
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
        required: ['id', 'correct', 'correct_answer', 'explanation_es'],
        properties: {
          id: { type: 'string' },
          correct: { type: 'boolean' },
          correct_answer: { type: 'string' },
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
  properties: { sentences: { type: 'array', items: { type: 'string' } } },
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
