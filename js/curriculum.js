// Contenido base: lo que ya manejas, la gramática por aprender, personajes,
// escenarios de reuniones BHP y frases de pronunciación.

export const KNOWN_GRAMMAR = [
  'Present simple',
  'Present continuous',
  'Present continuous for future arrangements',
  'Future with will',
  'Future with going to',
  'Past simple (regular/irregular verbs)',
  'Past of to be (was/were) in simple sentences',
  'Should / would only as "debería" (advice)',
];

// Máximo 5 sesiones por tema (idea del audio: "máximo cinco clases por módulo").
export const MAX_SESSIONS = 5;

export const GRAMMAR_TOPICS = [
  { id: 'there-be', title: 'There + be en todos los tiempos', es: 'there was / there were / there will be / there has been / there is going to be', level: 1 },
  { id: 'past-continuous', title: 'Past continuous', es: 'I was checking the report when the alarm went off', level: 1 },
  { id: 'present-perfect', title: 'Present perfect', es: 'We have completed the shutdown / Have you seen the KPIs?', level: 1 },
  { id: 'present-perfect-continuous', title: 'Present perfect continuous', es: "We've been working on this issue since Monday", level: 2 },
  { id: 'past-perfect', title: 'Past perfect', es: 'The crusher had stopped before the shift started', level: 2 },
  { id: 'past-perfect-continuous', title: 'Past perfect continuous', es: 'They had been running the pump for hours when it failed', level: 3 },
  { id: 'future-continuous', title: 'Future continuous', es: "This time next week I'll be visiting Escondida", level: 2 },
  { id: 'future-perfect', title: 'Future perfect', es: "By Friday we'll have finished the inspection", level: 2 },
  { id: 'future-perfect-continuous', title: 'Future perfect continuous', es: "By June I'll have been working at BHP for two years", level: 3 },
  { id: 'would-conditional', title: 'Would condicional (2nd conditional)', es: 'If we had more trucks, we would move more material', level: 1 },
  { id: 'would-past-habits', title: 'Would / used to: hábitos pasados', es: 'We would meet every Monday / We used to work 12-hour shifts', level: 2 },
  { id: 'would-complaints', title: 'Would para quejas e irritación', es: "He would say that! / I wish they would send the report on time", level: 3 },
  { id: 'used-to-forms', title: 'Used to vs be used to vs get used to', es: "I'm used to early meetings / I'm getting used to the Aussie accent", level: 2 },
  { id: 'conditionals', title: 'Condicionales 0, 1, 3 y mixtos', es: "If we had checked the belt, it wouldn't have failed", level: 2 },
  { id: 'reported-speech', title: 'Reported speech (estilo indirecto)', es: 'She said they would send the data by Friday', level: 2 },
  { id: 'passive-voice', title: 'Voz pasiva (todos los tiempos)', es: 'The permit has been approved / The area will be isolated', level: 2 },
  { id: 'past-modals', title: 'Modales en pasado (should have, could have, must have)', es: 'We should have escalated it earlier', level: 3 },
  { id: 'modals-deduction', title: 'Modales de deducción (must, might, can\'t be)', es: "It must be the sensor / It can't be the pump", level: 2 },
  { id: 'relative-clauses', title: 'Relative clauses (who, which, that, whose, where)', es: 'The contractor who did the work... / The site where...', level: 2 },
  { id: 'wish-if-only', title: 'Wish / if only', es: 'I wish we had more time / If only the data were complete', level: 3 },
  { id: 'gerund-infinitive', title: 'Gerundio vs infinitivo', es: 'We stopped to check vs we stopped checking', level: 2 },
  { id: 'causative', title: 'Causativo (have/get something done)', es: 'We need to get the truck repaired', level: 3 },
  { id: 'meeting-language', title: 'Lenguaje diplomático de reuniones', es: "I'd suggest... / Could I just jump in? / Let me push back a bit", level: 1 },
  { id: 'phrasal-verbs', title: 'Phrasal verbs de trabajo', es: 'follow up, roll out, sign off, push back, hold off, ramp up', level: 2 },
  { id: 'inversion-cleft', title: 'Énfasis: cleft sentences e inversión', es: "What we need is... / Not only did we... / It was the pump that failed", level: 3 },
];

export const CHARACTERS = [
  {
    id: 'mick', name: 'Mick', lang: 'en-AU', pitch: 0.85, rate: 1.0,
    role: 'Maintenance Superintendent, based in Perth (Western Australia)',
    style: 'Broad but professional Australian English. Uses Aussie expressions naturally (no worries, reckon, arvo, heaps, keen, "how are you going?", "she\'ll be right", mate) without overdoing it. Direct, friendly, a bit of dry humour.',
    look: { skin: '#f1c7a5', hair: '#8a5a2b', shirt: '#f28c28' },
  },
  {
    id: 'sarah', name: 'Sarah', lang: 'en-AU', pitch: 1.15, rate: 1.0,
    role: 'HSE Lead, based in Brisbane (Queensland)',
    style: 'Australian English, clear and warm. Uses safety language (Take 5, CCMs, HPI, field leadership, "stop and think"). Occasional Aussie expressions (arvo, keen, "no dramas").',
    look: { skin: '#f6d2b8', hair: '#d9a441', shirt: '#2b7a78' },
  },
  {
    id: 'priya', name: 'Priya', lang: 'en-IN', pitch: 1.15, rate: 1.0,
    role: 'Senior Planning Engineer, Indian-Australian, grew up in Pune and has lived in Melbourne for 10 years',
    style: 'Indian English accent with some Australian vocabulary picked up over the years. Natural Indian English features (e.g. "itself" for emphasis, "only" for emphasis, "do one thing...", "kindly", "revert" meaning reply, "prepone"), mixed with Aussie words ("no worries", "arvo"). Respectful, precise, data-driven. Never a caricature.',
    look: { skin: '#b9825a', hair: '#1f1a17', shirt: '#6a4c93' },
  },
  {
    id: 'arjun', name: 'Arjun', lang: 'en-IN', pitch: 0.9, rate: 1.0,
    role: 'Reliability Engineer, Indian-Australian, based in Perth after moving from Chennai',
    style: 'Indian English accent, fast speaker, uses some Australian expressions ("reckon", "mate", "no worries"). Technical: MTBF, MTTR, FMEA, RCA, condition monitoring. Friendly, likes cricket. Never a caricature.',
    look: { skin: '#a8714a', hair: '#141414', shirt: '#1d4e89' },
  },
];

export const SCENARIOS = [
  { id: 'smalltalk', title: 'Small talk antes de un Teams', desc: 'Fin de semana, clima en Perth vs Antofagasta, footy, cricket, viajes.' },
  { id: 'safety-share', title: 'Safety share / Take 5', desc: 'Abrir la reunión con un safety share y comentar un evento HPI.' },
  { id: 'weekly-ops', title: 'Reunión semanal de operaciones', desc: 'Producción, disponibilidad de camiones, backlog de mantenimiento, desvíos vs plan.' },
  { id: 'shutdown', title: 'Planificación de shutdown', desc: 'Ruta crítica, contratistas, permisos, aislaciones, riesgos y recursos.' },
  { id: 'incident-review', title: 'Revisión de incidente (ICAM)', desc: 'Qué pasó, qué había pasado antes, qué se debería haber hecho, acciones.' },
  { id: 'project-update', title: 'Status update a stakeholders', desc: 'Presupuesto, cronograma, riesgos, decisiones que necesitas.' },
  { id: 'kpi-dashboard', title: 'Presentar un dashboard de KPIs', desc: 'Explicar tendencias, causas, proyecciones (future perfect!).' },
  { id: 'one-on-one', title: '1:1 con tu manager', desc: 'Prioridades, carrera, feedback, pedir apoyo.' },
  { id: 'negotiation', title: 'Push back / negociar plazos', desc: 'Decir que no con diplomacia, proponer alternativas.' },
];

// Sonidos difíciles para hispanohablantes, con frases en contexto BHP.
export const PRON_SETS = [
  { id: 'th', title: '"th" sorda /θ/ y sonora /ð/', tip: 'Saca la punta de la lengua entre los dientes. "three" no es "tree"; "the" no es "de".',
    sentences: ['Throughput was three thousand tonnes higher than the target.', 'I think we need a thorough analysis of the other options.', 'Whether or not they agree, the data is there.', 'This month, thirty-three trucks were available.'] },
  { id: 'v-b', title: '/v/ vs /b/', tip: 'La /v/ se hace con los dientes de arriba sobre el labio inferior y vibra. "valve" no es "balve".',
    sentences: ['The valve on the vehicle needs to be reviewed.', 'We have very valuable data from the conveyor.', 'The base value varies between the two versions.', 'Everyone involved should verify the variance.'] },
  { id: 'i-ee', title: '/ɪ/ corta vs /iː/ larga', tip: 'ship/sheep, fill/feel, live/leave. La /ɪ/ es corta y relajada.',
    sentences: ['Please fill in the form before you leave the site.', 'The ship will reach the port in six weeks.', 'We need to fix this issue before it gets bigger.', 'Did the team meet the deadline this week?'] },
  { id: 'ed', title: 'Terminaciones -ed (/t/, /d/, /ɪd/)', tip: 'stopped = /stɒpt/, planned = /plænd/, completed = /kəmˈpliːtɪd/. No pronuncies la "e".',
    sentences: ['We stopped the pump and checked the pressure.', 'The work was planned, scheduled and completed on time.', 'They reported that the belt had cracked.', 'The contractor asked if we needed more support.'] },
  { id: 's-cluster', title: 'S inicial (sin "e" antes)', tip: 'Di "schedule", no "eschedule". Empieza directo con la /s/.',
    sentences: ['The schedule for the stockpile has changed.', 'Our strategy is to start the study in spring.', 'Spare parts are stored in the store room.', 'Stakeholders expect a standard approach.'] },
  { id: 'schwa', title: 'Schwa y acento de palabra', tip: 'availABILity, reliaBILity, MAINtenance. Las sílabas sin acento se reducen a /ə/.',
    sentences: ['Availability and reliability improved this quarter.', 'Maintenance completed the inspection of the concentrator.', 'The opportunity to reduce operational costs is significant.', 'Our productivity depends on equipment utilisation.'] },
  { id: 'sh-ch', title: '/ʃ/ vs /tʃ/', tip: '"shutdown" (sh suave) vs "change" (ch explosiva). "share" no es "chair".',
    sentences: ['The shutdown schedule will change next shift.', 'Let me share a short safety message.', 'Check the chute before the shovel starts.', 'The chair of the session shared the charts.'] },
  { id: 'h', title: '/h/ aspirada', tip: 'La /h/ inglesa es solo aire, más suave que la "j" chilena. "hazard", "haul".',
    sentences: ['Haul trucks are a high hazard in this area.', 'How has the hydraulic hose held up?', 'Half of the hours were lost to the heatwave.', 'Have you heard how the handover happened?'] },
  { id: 'final-cons', title: 'Consonantes finales', tip: 'No te comas el final: "shift", "belt", "first", "asked", "costs".',
    sentences: ['The first shift tested the belt last night.', 'The costs of the project exceeded the forecast.', 'We asked for the latest draft of the report.', 'Next week the crusher must be inspected.'] },
  { id: 'stress', title: 'Acento: sustantivo vs verbo', tip: 'REcord (sust.) / reCORD (verbo), CONtract / conTRACT, PREsent / preSENT, INcrease / inCREASE.',
    sentences: ['We need to record a new record for the plant.', 'Please present the present status of the contract.', 'An increase in rain may increase the risk.', 'The contractor will contract the scope by June.'] },
];

export function topicById(id) {
  return GRAMMAR_TOPICS.find((t) => t.id === id);
}

export function characterById(id) {
  return CHARACTERS.find((c) => c.id === id) || CHARACTERS[0];
}
