// Contenido base: lo que ya manejas, la gramática por aprender, personajes,
// escenarios de reuniones y frases de pronunciación.
//
// Ajustado a partir de transcripciones reales de reuniones de Data & Digital
// (integración de datos, arquitectura OT/IT/cloud, modelo de soporte, gobierno,
// calidad de datos) con equipos globales en Australia. Solo se tomaron
// estructuras y expresiones dichas correctamente; todo está generalizado y sin
// nombres, montos ni datos internos.

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

// level 1 = lo que más se usa en tus reuniones reales; 2 = frecuente; 3 = avanzado.
// star = apareció muchas veces en las transcripciones.
export const GRAMMAR_TOPICS = [
  // ---- Prioridad 1 ----
  { id: 'present-perfect', level: 1, star: true, title: 'Present perfect', es: "We've already completed the actions / Have you had a read of the HLD?" },
  { id: 'passive-voice', level: 1, star: true, title: 'Voz pasiva (presente, pasado, futuro y "is being")', es: "The guardrails API is being built / The workspaces will be merged / It's already been confirmed" },
  { id: 'cleft-sentences', level: 1, star: true, title: 'Cleft sentences: "What I\'m saying is…"', es: "What I'm saying is… / What that API does is… / What we need is the raw data" },
  { id: 'indirect-questions', level: 1, star: true, title: 'Preguntas indirectas y corteses', es: 'Could you confirm whether…? / I want to understand how… / Do you know where…?' },
  { id: 'modals-suggestions', level: 1, star: true, title: 'Modales para sugerir y recomendar', es: "You might want to… / I would keep it in one table / We shouldn't duplicate it" },
  { id: 'meeting-language', level: 1, star: true, title: 'Lenguaje de reuniones (abrir, aclarar, proponer, cerrar)', es: "Can you see my screen? / Does that make sense? / I'll pause there / We're at time" },
  { id: 'reported-speech', level: 1, star: true, title: 'Reported speech (estilo indirecto)', es: 'The vendor confirmed that both systems can coexist / He said he would send it' },
  { id: 'there-be', level: 1, title: 'There + be en todos los tiempos', es: "There's been a change / There will be a single database / There were three options" },
  { id: 'conditionals', level: 1, star: true, title: 'Condicionales 1, 2, 3 y mixtos', es: "If they talk to him, they'll sort it out / If we had added that entity, it would have been quicker" },
  // ---- Prioridad 2 ----
  { id: 'present-perfect-continuous', level: 2, star: true, title: 'Present perfect continuous', es: "We've been collecting this data since early 2026" },
  { id: 'future-continuous', level: 2, title: 'Future continuous', es: "The global team will be moving the data / I'll be working with you on this" },
  { id: 'future-time-clauses', level: 2, star: true, title: 'Futuro con when / once / until / as soon as', es: "Once we agree on the scope, we'll update the plan / until the old servers are migrated" },
  { id: 'past-modals', level: 2, star: true, title: 'Modales en pasado (should have, could have, would have)', es: 'We probably should have asked you earlier / I would have liked to go further' },
  { id: 'phrasal-verbs', level: 2, star: true, title: 'Phrasal verbs de trabajo', es: 'set up, bring up, jump in, sort out, circle back, catch up, pull together, run out of, follow up' },
  { id: 'linking-words', level: 2, title: 'Conectores formales', es: 'however, therefore, regarding, in terms of, essentially, with that in mind, otherwise' },
  { id: 'gerund-infinitive', level: 2, title: 'Gerundio vs infinitivo', es: 'Stop sharing / avoid creating / keep defining / instead of developing' },
  { id: 'question-tags', level: 2, title: 'Question tags y confirmar con "right?"', es: "It's already finished, isn't it? / That's the raw schema, right?" },
  { id: 'modals-deduction', level: 2, title: 'Modales de deducción y probabilidad', es: "It must be in the HLD / It might not be configured / It's likely going to be available" },
  { id: 'relative-clauses', level: 2, title: 'Relative clauses (who, which, that, where, whose)', es: 'The team who owns the pipeline… / the table where the data sits…' },
  { id: 'used-to-forms', level: 2, title: 'Used to vs be used to vs get used to', es: "We used to code it in HTML / I'm getting used to the time difference" },
  { id: 'would-past-habits', level: 2, title: 'Would / used to: hábitos pasados', es: 'Back then we would run the checks after the problem had happened' },
  // ---- Avanzado ----
  { id: 'past-continuous', level: 3, title: 'Past continuous', es: 'I was looking for the diagram while you were talking' },
  { id: 'past-perfect', level: 3, title: 'Past perfect', es: 'They had already completed a trial before the upgrade started' },
  { id: 'past-perfect-continuous', level: 3, title: 'Past perfect continuous', es: 'We had been waiting for the PO for two weeks' },
  { id: 'future-perfect', level: 3, title: 'Future perfect', es: "By November we'll have deployed it to production" },
  { id: 'future-perfect-continuous', level: 3, title: 'Future perfect continuous', es: "By June we'll have been running the pilot for six months" },
  { id: 'would-conditional', level: 3, title: 'Would condicional', es: 'That would bring the costs down / Would it be good to have a plan by next week?' },
  { id: 'would-complaints', level: 3, title: 'Would para quejas e irritación', es: 'I wish they would reply to the email / They would say that!' },
  { id: 'wish-if-only', level: 3, title: 'Wish / if only', es: 'I wish we had the volume estimate / If only the documentation were clearer' },
  { id: 'causative', level: 3, title: 'Causativo (have/get something done)', es: 'We need to get the design approved by the panel' },
  { id: 'inversion-cleft', level: 3, title: 'Énfasis avanzado: inversión', es: 'Not only does it reduce cost, but it also… / Only then can we deploy' },
];

export const CHARACTERS = [
  {
    id: 'mick', name: 'Mick', lang: 'en-AU', pitch: 0.85, rate: 1.0,
    role: 'Solution Architect for OT and cloud integration, based in Perth (Western Australia). Works with vendors on fleet data paths and has already done the same setup in Australia.',
    style: 'Australian, relaxed and direct. Real phrases he uses: "Look, …", "have a read of the HLD", "have a chat with them", "I\'m pretty sure", "the hard work has been done for you", "essentially", "on that front", "it\'ll save you a lot of time", "let\'s get what we actually need", "that sort of stuff", "I get that, but…", "no worries", "cheers", "mate", "cool". Pushes for reusing what already exists instead of building new things.',
    look: { skin: '#f1c7a5', hair: '#8a5a2b', shirt: '#f28c28' },
  },
  {
    id: 'sarah', name: 'Sarah', lang: 'en-AU', pitch: 1.15, rate: 1.0,
    role: 'Data Platform Engineering Manager, based in Brisbane (Queensland). Leads a global framework for data ingestion patterns, guardrails and data quality on Snowflake.',
    style: 'Australian, warm and collaborative. Real phrases she uses: "if that resonates", "we don\'t want to be a blocker or slow you down", "happy to work with you on it", "I might pause for a sec there", "get people\'s heads around it", "play around with it", "lean in", "we\'ve landed that now", "a few moving pieces", "we\'re at time", "did you land on some next steps?", "regroup and come back to us", "no worries".',
    look: { skin: '#f6d2b8', hair: '#d9a441', shirt: '#2b7a78' },
  },
  {
    id: 'priya', name: 'Ananya', lang: 'en-IN', pitch: 1.15, rate: 1.0,
    role: 'Senior Data & AI Product Owner, Indian-Australian, grew up in Pune and has lived in Melbourne for 10 years. Works on data products, ontologies and grounding for AI agents.',
    style: 'Indian English accent with Australian vocabulary picked up over the years. Natural Indian English features: checks understanding with "Okay?" and "right?", "so that\'s that", "long story short", "nothing but", repetition for emphasis ("different, different systems"), "do one thing…", "kindly", "revert" (reply), "prepone", "one-stop shop". Mixes in "no worries" and "arvo". Structured, explains with examples. Never a caricature.',
    look: { skin: '#b9825a', hair: '#1f1a17', shirt: '#6a4c93' },
  },
  {
    id: 'arjun', name: 'Arjun', lang: 'en-IN', pitch: 0.9, rate: 1.0,
    role: 'Senior Data Engineer, Indian-Australian, based in Perth after moving from Chennai. Builds API-to-Snowflake pipelines (RAW / QA / Conformed) for the global data utilities team.',
    style: 'Indian English accent, speaks fast, technical. Real phrases: "So what they\'re saying is…", "Does that make sense?", "Or does that help?", "Fair enough", "regardless of whether…", "let me try and speak to that diagram", "Cool, thanks, man", "no problem at all, mate". Talks about endpoints, schemas, data volume, Hz, latency, backfill. Likes cricket. Never a caricature.',
    look: { skin: '#a8714a', hair: '#141414', shirt: '#1d4e89' },
  },
];

export const SCENARIOS = [
  { id: 'smalltalk', title: 'Small talk al inicio de un Teams', desc: 'Clima en Perth vs Santiago, feriados, diferencia horaria ("your Tuesday afternoon, our Wednesday morning"), fin de semana.' },
  { id: 'status-update', title: 'Status update semanal del proyecto', desc: 'Qué está on track, qué está bloqueado, esperando aprobaciones o PO, fecha objetivo de producción, próximos pasos.' },
  { id: 'vendor-architecture', title: 'Aclarar una arquitectura con el vendor', desc: 'Data path del equipo al cloud, sistema antiguo vs nuevo coexistiendo, componentes on-prem vs cloud, qué está confirmado y qué no.' },
  { id: 'requirements', title: 'Alinear requerimientos con el equipo global', desc: 'Qué está cubierto y qué no, endpoints, frecuencia de actualización, carga histórica, evitar desarrollos paralelos.' },
  { id: 'support-model', title: 'Modelo de soporte y traspaso', desc: 'Soporte global vs local, capas RAW / QA / Conformed, KT, transición a operaciones, acuerdos formales.' },
  { id: 'governance', title: 'Revisión de arquitectura y ciberseguridad', desc: 'Rating CIA, HLD, aprobación de panel, riesgos, por qué el diseño de Australia aplica (o no) en Chile.' },
  { id: 'data-volume', title: 'Volumen, latencia y calidad de datos', desc: '1 Hz vs batch vs real-time, completitud, ancho de banda en la red LTE, backfill, down-sampling.' },
  { id: 'cost-scope', title: 'Alcance de cotización y costos', desc: 'Qué incluye y excluye la cotización, setup fees, costo por dato, business case. Negociar con diplomacia.' },
  { id: 'follow-up', title: 'Hacer seguimiento y cerrar acciones', desc: 'Pedir respuesta a un equipo que no contesta, agendar una reunión, resumir acciones y open questions al final.' },
  { id: 'knowledge-sharing', title: 'Sesión de conocimiento / demo', desc: 'Alguien presenta (data quality, patrones, ontologías) y tú haces preguntas, pides ejemplos y propones un piloto.' },
  { id: 'push-back', title: 'Push back con diplomacia', desc: 'Decir que no o "todavía no", defender la necesidad local, proponer alternativas sin sonar negativa.' },
  { id: 'one-on-one', title: '1:1 con tu manager', desc: 'Prioridades, avance, pedir apoyo, carrera, feedback.' },
  { id: 'safety-share', title: 'Safety share al inicio', desc: 'Compartir un momento de seguridad breve, como se hace al abrir reuniones en BHP.' },
];

// Frases reales de reuniones (generalizadas), para escuchar y repetir.
export const PHRASE_GROUPS = [
  {
    title: 'Abrir y presentar', items: [
      ['Can you see my screen okay?', '¿Ven bien mi pantalla?'],
      ['Let me share my screen just to clarify.', 'Déjenme compartir pantalla para aclarar.'],
      ['Just a quick introduction: I work in Data & Digital in Santiago.', 'Una presentación rápida: trabajo en Data & Digital en Santiago.'],
      ['Thanks for joining. We\'ll get as far as we get today.', 'Gracias por venir. Avanzaremos lo que alcancemos hoy.'],
      ['In terms of priorities for this quarter, we\'re focusing on two things.', 'En cuanto a prioridades del trimestre, nos enfocamos en dos cosas.'],
    ],
  },
  {
    title: 'Pedir y confirmar entendimiento', items: [
      ['Does that make sense?', '¿Tiene sentido? / ¿Se entiende?'],
      ['If I understand correctly, the data doesn\'t need to go through the new system.', 'Si entiendo bien, los datos no necesitan pasar por el sistema nuevo.'],
      ['So what you\'re saying is that both options can coexist, right?', 'O sea, lo que dices es que ambas opciones pueden coexistir, ¿cierto?'],
      ['Sorry, could you repeat that? I didn\'t quite catch it.', 'Perdón, ¿lo puedes repetir? No lo alcancé a entender.'],
      ['Could you confirm whether this is the current production design?', '¿Puedes confirmar si este es el diseño actual de producción?'],
      ['I want to understand how the support model will work.', 'Quiero entender cómo funcionará el modelo de soporte.'],
    ],
  },
  {
    title: 'Proponer y recomendar', items: [
      ['What I\'m suggesting is that we reuse the existing design.', 'Lo que propongo es reutilizar el diseño existente.'],
      ['It might be worth asking the vendor directly.', 'Podría valer la pena preguntarle directo al vendor.'],
      ['My recommendation is to keep it in one table.', 'Mi recomendación es mantenerlo en una sola tabla.'],
      ['Would it be good to have a plan by next week?', '¿Sería bueno tener un plan para la próxima semana?'],
      ['Maybe we could pair one of our engineers with your team.', 'Quizás podríamos juntar a uno de nuestros ingenieros con tu equipo.'],
    ],
  },
  {
    title: 'No estar de acuerdo (con diplomacia)', items: [
      ['I get that, but it\'s not necessary for this project.', 'Lo entiendo, pero no es necesario para este proyecto.'],
      ['That\'s a fair point. However, our situation is a bit different.', 'Es un punto válido. Sin embargo, nuestra situación es un poco distinta.'],
      ['I\'m not sure that applies here, because we still have the old system running.', 'No estoy segura de que aplique aquí, porque aún tenemos el sistema antiguo funcionando.'],
      ['We shouldn\'t be duplicating an integration if one already exists.', 'No deberíamos duplicar una integración si ya existe una.'],
      ['From our side, we need a formal agreement before we move forward.', 'Por nuestro lado, necesitamos un acuerdo formal antes de avanzar.'],
    ],
  },
  {
    title: 'Cerrar y acciones', items: [
      ['I think we\'re at time. Did we land on some next steps?', 'Creo que se nos acabó el tiempo. ¿Definimos próximos pasos?'],
      ['Can we record this as an open action?', '¿Podemos dejar esto como acción abierta?'],
      ['I\'ll follow up by email and get back to you.', 'Haré seguimiento por correo y te respondo.'],
      ['Let\'s regroup with the team and come back to you next week.', 'Lo revisamos con el equipo y volvemos a ustedes la próxima semana.'],
      ['Thanks, everyone. Talk soon.', 'Gracias a todos. Hablamos pronto.'],
    ],
  },
  {
    title: 'Expresiones australianas que vas a escuchar', items: [
      ['No worries.', 'No hay problema / de nada.'],
      ['Have a read of the document.', 'Lee el documento.'],
      ['Have a chat with them.', 'Conversa con ellos.'],
      ['I\'m pretty sure it\'s already in place.', 'Estoy casi segura de que ya existe.'],
      ['The hard work has been done for you.', 'La parte difícil ya está hecha.'],
      ['I might pause for a sec there.', 'Voy a hacer una pausa ahí.'],
      ['If that resonates with you…', 'Si eso te hace sentido…'],
      ['Let\'s circle back on that next week.', 'Retomemos eso la próxima semana.'],
      ['It\'ll help get people\'s heads around it.', 'Ayudará a que la gente lo entienda.'],
      ['Cheers, mate.', 'Gracias, compañero.'],
    ],
  },
];

// Sonidos difíciles para hispanohablantes, con frases de reuniones de datos y tecnología.
export const PRON_SETS = [
  { id: 'tech-words', title: 'Palabras técnicas que más usas', tip: 'data /ˈdeɪtə/, architecture /ˈɑːkɪtektʃə/, schema /ˈskiːmə/, Azure /ˈæʒə/, requirement, pipeline, latency, migration, quote /kwəʊt/.',
    sentences: ['The data pipeline loads the raw schema every hour.', 'Could you share the architecture diagram for the Azure option?', 'We need to confirm the requirements before the migration.', 'The quote does not include the latency and bandwidth tests.'] },
  { id: 'th', title: '"th" sorda /θ/ y sonora /ð/', tip: 'Saca la punta de la lengua entre los dientes. "three" no es "tree"; "the" no es "de".',
    sentences: ['I think the throughput is three times higher than that.', 'Whether or not they agree, the data is there.', 'Thank you for the thorough summary of the other options.', 'Both teams think the path is the same.'] },
  { id: 'v-b', title: '/v/ vs /b/', tip: 'La /v/ se hace con los dientes de arriba sobre el labio inferior y vibra. "vendor" no es "bendor".',
    sentences: ['The vendor will review the volume of the data.', 'We have very valuable vibration data from the sensors.', 'The service owner verified the version in production.', 'Every visible variable is available via the API.'] },
  { id: 'i-ee', title: '/ɪ/ corta vs /iː/ larga', tip: 'ship/sheep, fill/feel, live/leave. La /ɪ/ es corta y relajada.',
    sentences: ['We need to fix this issue before the team meets next week.', 'Please fill in the field before you leave.', 'This is the key table we need to keep.', 'Did the team agree to deliver it this week?'] },
  { id: 'ed', title: 'Terminaciones -ed (/t/, /d/, /ɪd/)', tip: 'stopped = /stɒpt/, planned = /plænd/, completed = /kəmˈpliːtɪd/. No pronuncies la "e".',
    sentences: ['We have already completed the actions you assigned.', 'The vendor confirmed that the design was approved.', 'They asked if we needed more support and we agreed.', 'The pipeline stopped and the data was not loaded.'] },
  { id: 's-cluster', title: 'S inicial (sin "e" antes)', tip: 'Di "schema", "Snowflake", "Spence", "support" sin "e" delante. Empieza directo con la /s/.',
    sentences: ['The schema in Snowflake follows the standard.', 'Spence needs a specific support model.', 'Our strategy is to start with a small scope.', 'Stakeholders expect a standard approach to security.'] },
  { id: 'schwa', title: 'Schwa y acento de palabra', tip: 'availABILity, reliaBILity, inteGRAtion, arCHItecture. Las sílabas sin acento se reducen a /ə/.',
    sentences: ['Availability and reliability are the key requirements.', 'The integration depends on the architecture we choose.', 'Confidentiality, integrity and availability were assessed.', 'We need the documentation before the operational handover.'] },
  { id: 'sh-ch', title: '/ʃ/ vs /tʃ/', tip: '"share" (sh suave) vs "change" (ch explosiva). "share" no es "chair".',
    sentences: ['Let me share my screen and show the changes.', 'The data share should not cost extra.', 'Check the schedule before we change the architecture.', 'Each machine sends a short batch of data.'] },
  { id: 'h', title: '/h/ aspirada', tip: 'La /h/ inglesa es solo aire, más suave que la "j" chilena. "how", "high-level", "historical".',
    sentences: ['How will the historical data be handled?', 'The high-level design has the full diagram.', 'Half of the hosting cost is for the database.', 'Have you heard back from the hosting team?'] },
  { id: 'final-cons', title: 'Consonantes finales', tip: 'No te comas el final: "first", "asked", "costs", "next", "raised".',
    sentences: ['The first test asked for the latest dataset.', 'The costs of the project exceeded the estimate.', 'Next week we must send the list of open questions.', 'We raised the request and it was approved.'] },
  { id: 'stress', title: 'Acento: sustantivo vs verbo', tip: 'REcord (sust.) / reCORD (verbo), CONtract / conTRACT, PREsent / preSENT, INcrease / inCREASE, PROject / proJECT.',
    sentences: ['Please record the meeting so we have a record.', 'I will present the present status of the project.', 'An increase in volume may increase the cost.', 'We project that the project will finish in November.'] },
];

export function topicById(id) {
  return GRAMMAR_TOPICS.find((t) => t.id === id);
}

export function characterById(id) {
  return CHARACTERS.find((c) => c.id === id) || CHARACTERS[0];
}
