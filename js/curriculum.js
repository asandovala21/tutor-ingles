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
  // ---- Repaso: bases que ya usas (para dominarlas de verdad) ----
  { id: 'verb-tenses-map', level: 0, star: true, title: 'Mapa de los 12 tiempos verbales', es: 'Todos los tiempos en una tabla: forma, cuándo usar cada uno y cómo se diferencian' },
  { id: 'present-simple', level: 0, title: 'Present simple: hábitos, hechos y horarios', es: 'We meet every Tuesday / The API returns JSON / The call starts at 9' },
  { id: 'present-continuous', level: 0, title: 'Present continuous: ahora, temporal y cambios', es: "We're testing the pipeline this week / The volume is increasing" },
  { id: 'past-simple', level: 0, title: 'Past simple: regulares, irregulares y preguntas con did', es: 'We met the vendor yesterday / Did they send the HLD?' },
  { id: 'future-forms', level: 0, title: 'Futuro: will vs going to vs present continuous', es: "I'll send it now / We're going to migrate / We're meeting on Friday" },
  { id: 'questions-word-order', level: 0, star: true, title: 'Cómo armar preguntas (do/does/did, wh-, "is there")', es: 'Where is the data stored? / Does it include the setup? / How long does it take?' },
  { id: 'subject-verb', level: 0, title: 'Concordancia y la -s de tercera persona', es: 'The team needs / The data is / Everyone has / It doesn\'t work' },
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
  { id: 'modal-verbs', level: 1, star: true, title: 'Modal verbs: can, could, may, might, must, should, would, have to, need to', es: 'Habilidad, permiso, obligación, posibilidad y consejo en reuniones' },
  { id: 'countable-another', level: 1, star: true, title: 'Plurales, contables/incontables y another / other / others', es: 'another question / other questions / the data is / my job (no "my jobs")' },
  { id: 'articles', level: 1, title: 'Artículos: a / an / the / sin artículo', es: 'a meeting, an API, the HLD we discussed, data is important' },
  { id: 'prepositions', level: 1, star: true, title: 'Preposiciones clave: in/on/at, since/for/ago, by/until', es: 'on Tuesday, at 9, in November, since 2020, for two years, by Friday' },
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
  { id: 'reported-questions', level: 2, title: 'Reported speech: preguntas, órdenes y peticiones', es: 'She asked if we had the volume / He told us to send the HLD / They asked us not to…' },
  { id: 'confusing-verbs', level: 2, title: 'Verbos confusos: say/tell, make/do, remember/remind', es: 'Tell me / say that, make a decision / do a test, remind me to…' },
  { id: 'false-friends', level: 2, star: true, title: 'Falsos amigos español-inglés', es: 'actually ≠ actualmente, eventually ≠ eventualmente, assist ≠ asistir, realize ≠ realizar' },
  { id: 'quantifiers', level: 2, title: 'Cuantificadores: much/many, a lot of, few/little, some/any', es: 'How much data? How many sensors? A few issues, little time' },
  { id: 'comparatives', level: 2, title: 'Comparativos y superlativos', es: 'faster than, more reliable than, the cheapest option, as simple as' },
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
// [inglés, español, pronunciación aproximada (sílaba fuerte en MAYÚSCULA)]
export const PHRASE_GROUPS = [
  {
    title: 'Abrir y presentar', items: [
      ['Can you see my screen okay?', '¿Ven bien mi pantalla?', 'kan yu SII mai SKRIIN ou-KEI?'],
      ['Let me share my screen just to clarify.', 'Déjenme compartir pantalla para aclarar.', 'let mi SHER mai SKRIIN yast tu KLE-ri-fai'],
      ['Just a quick introduction: I work in Data & Digital in Santiago.', 'Una presentación rápida: trabajo en Data & Digital en Santiago.', 'yast a KUIK in-tro-DAK-shon: ai uerk in DEI-ta an DI-yi-tal in san-ti-A-gou'],
      ["Thanks for joining. We'll get as far as we get today.", 'Gracias por venir. Avanzaremos lo que alcancemos hoy.', 'zenks for YOI-ning. uil GUET as FAR as ui guet tu-DEI'],
      ["In terms of priorities for this quarter, we're focusing on two things.", 'En cuanto a prioridades del trimestre, nos enfocamos en dos cosas.', 'in TERMS ov prai-O-ri-tis for dhis KUOR-ter, uir FOU-ka-sing on TU zings'],
    ],
  },
  {
    title: 'Pedir y confirmar entendimiento', items: [
      ['Does that make sense?', '¿Tiene sentido? / ¿Se entiende?', 'das dhat meik SENS?'],
      ["If I understand correctly, the data doesn't need to go through the new system.", 'Si entiendo bien, los datos no necesitan pasar por el sistema nuevo.', 'if ai an-der-STAND ko-REKT-li, dhe DEI-ta DA-sent niid tu gou zru dhe NIU SIS-tem'],
      ["So what you're saying is that both options can coexist, right?", 'O sea, lo que dices es que ambas opciones pueden coexistir, ¿cierto?', 'sou uat yur SEI-ing is dhat BOUZ OP-shons kan kou-eg-SIST, RAIT?'],
      ["Sorry, could you repeat that? I didn't quite catch it.", 'Perdón, ¿lo puedes repetir? No lo alcancé a entender.', 'SO-ri, kud yu ri-PIIT dhat? ai DI-dent kuait KECH it'],
      ['Could you confirm whether this is the current production design?', '¿Puedes confirmar si este es el diseño actual de producción?', 'kud yu kon-FERM UE-dher dhis is dhe KA-rent pro-DAK-shon di-SAIN?'],
      ['I want to understand how the support model will work.', 'Quiero entender cómo funcionará el modelo de soporte.', 'ai uant tu an-der-STAND jau dhe sa-PORT MO-del uil UERK'],
    ],
  },
  {
    title: 'Proponer y recomendar', items: [
      ["What I'm suggesting is that we reuse the existing design.", 'Lo que propongo es reutilizar el diseño existente.', 'uat aim sa-YES-ting is dhat ui ri-IUS dhi eg-SIS-ting di-SAIN'],
      ['It might be worth asking the vendor directly.', 'Podría valer la pena preguntarle directo al vendor.', 'it mait bi UERZ AS-king dhe VEN-dor dai-REKT-li'],
      ['My recommendation is to keep it in one table.', 'Mi recomendación es mantenerlo en una sola tabla.', 'mai re-ko-men-DEI-shon is tu KIIP it in uan TEI-bol'],
      ['Would it be good to have a plan by next week?', '¿Sería bueno tener un plan para la próxima semana?', 'uud it bi GUD tu jav a PLAN bai nekst UIIK?'],
      ['Maybe we could pair one of our engineers with your team.', 'Quizás podríamos juntar a uno de nuestros ingenieros con tu equipo.', 'MEI-bi ui kud PER uan ov aur en-yi-NIIRS uidh yor TIIM'],
    ],
  },
  {
    title: 'No estar de acuerdo (con diplomacia)', items: [
      ["I get that, but it's not necessary for this project.", 'Lo entiendo, pero no es necesario para este proyecto.', "ai GUET dhat, bat its not NE-se-se-ri for dhis PRO-yekt"],
      ["That's a fair point. However, our situation is a bit different.", 'Es un punto válido. Sin embargo, nuestra situación es un poco distinta.', 'dhats a FER POINT. jau-E-ver, aur si-chu-EI-shon is a bit DI-frent'],
      ["I'm not sure that applies here, because we still have the old system running.", 'No estoy segura de que aplique aquí, porque aún tenemos el sistema antiguo funcionando.', 'aim not SHUR dhat a-PLAIS jir, bi-KOS ui stil jav dhi OULD SIS-tem RA-ning'],
      ["We shouldn't be duplicating an integration if one already exists.", 'No deberíamos duplicar una integración si ya existe una.', 'ui SHU-dent bi DIU-pli-kei-ting an in-te-GREI-shon if uan ol-RE-di eg-SISTS'],
      ['From our side, we need a formal agreement before we move forward.', 'Por nuestro lado, necesitamos un acuerdo formal antes de avanzar.', 'from aur SAID, ui niid a FOR-mal a-GRII-ment bi-FOR ui muuv FOR-uard'],
    ],
  },
  {
    title: 'Cerrar y acciones', items: [
      ["I think we're at time. Did we land on some next steps?", 'Creo que se nos acabó el tiempo. ¿Definimos próximos pasos?', 'ai zink uir at TAIM. did ui LAND on sam nekst STEPS?'],
      ['Can we record this as an open action?', '¿Podemos dejar esto como acción abierta?', 'kan ui ri-KORD dhis as an OU-pen AK-shon?'],
      ["I'll follow up by email and get back to you.", 'Haré seguimiento por correo y te respondo.', 'ail FO-lou ap bai II-meil an guet BAK tu yu'],
      ["Let's regroup with the team and come back to you next week.", 'Lo revisamos con el equipo y volvemos a ustedes la próxima semana.', 'lets ri-GRUUP uidh dhe TIIM an kam BAK tu yu nekst UIIK'],
      ['Thanks, everyone. Talk soon.', 'Gracias a todos. Hablamos pronto.', 'ZENKS, EV-ri-uan. tok SUUN'],
    ],
  },
  {
    title: 'Expresiones australianas que vas a escuchar', items: [
      ['No worries.', 'No hay problema / de nada.', 'nou UA-ris'],
      ['Have a read of the document.', 'Lee el documento.', 'jav a RIID ov dhe DO-kiu-ment'],
      ['Have a chat with them.', 'Conversa con ellos.', 'jav a CHAT uidh dhem'],
      ["I'm pretty sure it's already in place.", 'Estoy casi segura de que ya existe.', 'aim PRI-ti SHUR its ol-RE-di in PLEIS'],
      ['The hard work has been done for you.', 'La parte difícil ya está hecha.', 'dhe JARD uerk jas bin DAN for yu'],
      ['I might pause for a sec there.', 'Voy a hacer una pausa ahí.', 'ai mait POOS for a SEK dher'],
      ['If that resonates with you…', 'Si eso te hace sentido…', 'if dhat RE-so-neits uidh yu'],
      ["Let's circle back on that next week.", 'Retomemos eso la próxima semana.', 'lets SER-kol BAK on dhat nekst UIIK'],
      ["It'll help get people's heads around it.", 'Ayudará a que la gente lo entienda.', 'I-tol jelp guet PII-pols JEDS a-RAUND it'],
      ['Cheers, mate.', 'Gracias, compañero.', 'CHIIRS, MEIT'],
    ],
  },
];

// Sonidos difíciles para hispanohablantes, con frases de reuniones de datos y tecnología.
// Cada frase: { en, es, pron } — pron = pronunciación aproximada (sílaba fuerte en MAYÚSCULA).
export const PRON_SETS = [
  { id: 'tech-words', title: 'Palabras técnicas que más usas', tip: 'data /ˈdeɪtə/, architecture /ˈɑːkɪtektʃə/, schema /ˈskiːmə/, Azure /ˈæʒə/, requirement, pipeline, latency, migration, quote /kwəʊt/.',
    sentences: [
      { en: 'The data pipeline loads the raw schema every hour.', es: 'El pipeline de datos carga el esquema raw cada hora.', pron: 'dhe DEI-ta PAIP-lain loudz dhe ROO SKII-ma EV-ri AUER' },
      { en: 'Could you share the architecture diagram for the Azure option?', es: '¿Podrías compartir el diagrama de arquitectura de la opción Azure?', pron: 'kud yu SHER dhi AR-ki-tek-cher DAI-a-gram for dhi A-shur OP-shon?' },
      { en: 'We need to confirm the requirements before the migration.', es: 'Necesitamos confirmar los requerimientos antes de la migración.', pron: 'ui niid tu kon-FERM dhe ri-KUAI-er-ments bi-FOR dhe mai-GREI-shon' },
      { en: 'The quote does not include the latency and bandwidth tests.', es: 'La cotización no incluye las pruebas de latencia y ancho de banda.', pron: 'dhe KUOUT das not in-KLUUD dhe LEI-ten-si an BAND-uidz TESTS' },
    ] },
  { id: 'th', title: '"th" sorda /θ/ y sonora /ð/', tip: 'Saca la punta de la lengua entre los dientes. "three" no es "tree"; "the" no es "de". En la pronunciación escrita: z = th sorda, dh = th suave.',
    sentences: [
      { en: 'I think the throughput is three times higher than that.', es: 'Creo que el throughput es tres veces más alto que eso.', pron: 'ai ZINK dhe ZRU-put is ZRII taims JAI-er dhan DHAT' },
      { en: 'Whether or not they agree, the data is there.', es: 'Estén o no de acuerdo, los datos están ahí.', pron: 'UE-dher or not dhei a-GRII, dhe DEI-ta is DHER' },
      { en: 'Thank you for the thorough summary of the other options.', es: 'Gracias por el resumen completo de las otras opciones.', pron: 'ZENK yu for dhe ZA-ra SA-ma-ri ov dhi A-dher OP-shons' },
      { en: 'Both teams think the path is the same.', es: 'Ambos equipos creen que el camino es el mismo.', pron: 'BOUZ tiims ZINK dhe PAZ is dhe SEIM' },
    ] },
  { id: 'v-b', title: '/v/ vs /b/', tip: 'La /v/ se hace con los dientes de arriba sobre el labio inferior y vibra. "vendor" no es "bendor".',
    sentences: [
      { en: 'The vendor will review the volume of the data.', es: 'El vendor revisará el volumen de los datos.', pron: 'dhe VEN-dor uil ri-VIU dhe VO-lium ov dhe DEI-ta' },
      { en: 'We have very valuable vibration data from the sensors.', es: 'Tenemos datos de vibración muy valiosos de los sensores.', pron: 'ui jav VE-ri VA-liu-bol vai-BREI-shon DEI-ta from dhe SEN-sors' },
      { en: 'The service owner verified the version in production.', es: 'El dueño del servicio verificó la versión en producción.', pron: 'dhe SER-vis OU-ner VE-ri-faid dhe VER-shon in pro-DAK-shon' },
      { en: 'Every visible variable is available via the API.', es: 'Cada variable visible está disponible vía la API.', pron: 'EV-ri VI-si-bol VE-ri-a-bol is a-VEI-la-bol VAI-a dhi ei-pii-AI' },
    ] },
  { id: 'i-ee', title: '/ɪ/ corta vs /iː/ larga', tip: 'ship/sheep, fill/feel, live/leave. La /ɪ/ es corta y relajada; la /iː/ (escrita "ii") es larga.',
    sentences: [
      { en: 'We need to fix this issue before the team meets next week.', es: 'Tenemos que arreglar este problema antes de que el equipo se reúna la próxima semana.', pron: 'ui NIID tu FIKS dhis I-shu bi-FOR dhe TIIM MIITS nekst UIIK' },
      { en: 'Please fill in the field before you leave.', es: 'Por favor completa el campo antes de irte.', pron: 'pliis FIL in dhe FIILD bi-FOR yu LIIV' },
      { en: 'This is the key table we need to keep.', es: 'Esta es la tabla clave que necesitamos mantener.', pron: 'DHIS is dhe KII TEI-bol ui niid tu KIIP' },
      { en: 'Did the team agree to deliver it this week?', es: '¿El equipo acordó entregarlo esta semana?', pron: 'did dhe TIIM a-GRII tu di-LI-ver it dhis UIIK?' },
    ] },
  { id: 'ed', title: 'Terminaciones -ed (/t/, /d/, /ɪd/)', tip: 'stopped = /stɒpt/, planned = /plænd/, completed = /kəmˈpliːtɪd/. No pronuncies la "e".',
    sentences: [
      { en: 'We have already completed the actions you assigned.', es: 'Ya completamos las acciones que asignaste.', pron: 'ui jav ol-RE-di kom-PLII-tid dhi AK-shons yu a-SAIND' },
      { en: 'The vendor confirmed that the design was approved.', es: 'El vendor confirmó que el diseño fue aprobado.', pron: 'dhe VEN-dor kon-FERMD dhat dhe di-SAIN uos a-PRUUVD' },
      { en: 'They asked if we needed more support and we agreed.', es: 'Preguntaron si necesitábamos más apoyo y aceptamos.', pron: 'dhei ASKT if ui NII-did mor sa-PORT an ui a-GRIID' },
      { en: 'The pipeline stopped and the data was not loaded.', es: 'El pipeline se detuvo y los datos no se cargaron.', pron: 'dhe PAIP-lain STOPT an dhe DEI-ta uos not LOU-did' },
    ] },
  { id: 's-cluster', title: 'S inicial (sin "e" antes)', tip: 'Di "schema", "Snowflake", "Spence", "support" sin "e" delante. Empieza directo con la /s/.',
    sentences: [
      { en: 'The schema in Snowflake follows the standard.', es: 'El esquema en Snowflake sigue el estándar.', pron: 'dhe SKII-ma in SNOU-fleik FO-lous dhe STAN-dard' },
      { en: 'Spence needs a specific support model.', es: 'Spence necesita un modelo de soporte específico.', pron: 'SPENS niidz a spe-SI-fik sa-PORT MO-del' },
      { en: 'Our strategy is to start with a small scope.', es: 'Nuestra estrategia es empezar con un alcance pequeño.', pron: 'aur STRA-te-yi is tu START uidh a SMOOL SKOUP' },
      { en: 'Stakeholders expect a standard approach to security.', es: 'Los stakeholders esperan un enfoque estándar de seguridad.', pron: 'STEIK-joul-ders eks-PEKT a STAN-dard a-PROUCH tu si-KIU-ri-ti' },
    ] },
  { id: 'schwa', title: 'Schwa y acento de palabra', tip: 'availABILity, reliaBILity, inteGRAtion, ARchitecture. Las sílabas sin acento se reducen a un sonido débil /ə/.',
    sentences: [
      { en: 'Availability and reliability are the key requirements.', es: 'La disponibilidad y la confiabilidad son los requerimientos clave.', pron: 'a-vei-la-BI-li-ti an ri-lai-a-BI-li-ti ar dhe KII ri-KUAI-er-ments' },
      { en: 'The integration depends on the architecture we choose.', es: 'La integración depende de la arquitectura que elijamos.', pron: 'dhi in-te-GREI-shon di-PENDZ on dhi AR-ki-tek-cher ui CHUUS' },
      { en: 'Confidentiality, integrity and availability were assessed.', es: 'Se evaluaron la confidencialidad, la integridad y la disponibilidad.', pron: 'kon-fi-den-shi-A-li-ti, in-TE-gri-ti an a-vei-la-BI-li-ti uer a-SEST' },
      { en: 'We need the documentation before the operational handover.', es: 'Necesitamos la documentación antes del traspaso operacional.', pron: 'ui niid dhe do-kiu-men-TEI-shon bi-FOR dhi o-pe-REI-sho-nal JAND-ou-ver' },
    ] },
  { id: 'sh-ch', title: '/ʃ/ vs /tʃ/', tip: '"share" (sh suave) vs "change" (ch explosiva). "share" no es "chair".',
    sentences: [
      { en: 'Let me share my screen and show the changes.', es: 'Déjame compartir pantalla y mostrar los cambios.', pron: 'let mi SHER mai SKRIIN an SHOU dhe CHEIN-yis' },
      { en: 'The data share should not cost extra.', es: 'El data share no debería costar extra.', pron: 'dhe DEI-ta SHER shud NOT kost EKS-tra' },
      { en: 'Check the schedule before we change the architecture.', es: 'Revisa el cronograma antes de cambiar la arquitectura.', pron: 'CHEK dhe SKE-yul bi-FOR ui CHEINY dhi AR-ki-tek-cher' },
      { en: 'Each machine sends a short batch of data.', es: 'Cada máquina envía un lote corto de datos.', pron: 'IICH ma-SHIIN SENDZ a SHORT BACH ov DEI-ta' },
    ] },
  { id: 'h', title: '/h/ aspirada', tip: 'La /h/ inglesa es solo aire, más suave que la "j" chilena. En la pronunciación escrita la "j" es suave. "how", "high-level", "historical".',
    sentences: [
      { en: 'How will the historical data be handled?', es: '¿Cómo se manejarán los datos históricos?', pron: 'JAU uil dhe jis-TO-ri-kal DEI-ta bi JAN-dold?' },
      { en: 'The high-level design has the full diagram.', es: 'El diseño de alto nivel tiene el diagrama completo.', pron: 'dhe JAI-LE-vel di-SAIN jas dhe FUL DAI-a-gram' },
      { en: 'Half of the hosting cost is for the database.', es: 'La mitad del costo de hosting es para la base de datos.', pron: 'JAAF ov dhe JOUS-ting KOST is for dhe DEI-ta-beis' },
      { en: 'Have you heard back from the hosting team?', es: '¿Te respondió el equipo de hosting?', pron: 'jav yu JERD BAK from dhe JOUS-ting TIIM?' },
    ] },
  { id: 'final-cons', title: 'Consonantes finales', tip: 'No te comas el final: "first", "asked", "costs", "next", "raised".',
    sentences: [
      { en: 'The first test asked for the latest dataset.', es: 'La primera prueba pidió el dataset más reciente.', pron: 'dhe FERST TEST ASKT for dhe LEI-test DEI-ta-set' },
      { en: 'The costs of the project exceeded the estimate.', es: 'Los costos del proyecto superaron la estimación.', pron: 'dhe KOSTS ov dhe PRO-yekt ek-SII-did dhi ES-ti-mat' },
      { en: 'Next week we must send the list of open questions.', es: 'La próxima semana debemos enviar la lista de preguntas abiertas.', pron: 'NEKST UIIK ui MAST SEND dhe LIST ov OU-pen KUES-chons' },
      { en: 'We raised the request and it was approved.', es: 'Levantamos la solicitud y fue aprobada.', pron: 'ui REISD dhe ri-KUEST an it uos a-PRUUVD' },
    ] },
  { id: 'stress', title: 'Acento: sustantivo vs verbo', tip: 'REcord (sust.) / reCORD (verbo), CONtract / conTRACT, PREsent / preSENT, INcrease / inCREASE, PROject / proJECT.',
    sentences: [
      { en: 'Please record the meeting so we have a record.', es: 'Por favor graba la reunión para tener un registro.', pron: 'pliis ri-KORD dhe MII-ting sou ui jav a RE-kord' },
      { en: 'I will present the present status of the project.', es: 'Presentaré el estado actual del proyecto.', pron: 'ai uil pri-SENT dhe PRE-sent STEI-tus ov dhe PRO-yekt' },
      { en: 'An increase in volume may increase the cost.', es: 'Un aumento de volumen puede aumentar el costo.', pron: 'an IN-kriis in VO-lium mei in-KRIIS dhe KOST' },
      { en: 'We project that the project will finish in November.', es: 'Proyectamos que el proyecto terminará en noviembre.', pron: 'ui pro-YEKT dhat dhe PRO-yekt uil FI-nish in no-VEM-ber' },
    ] },
];

export function topicById(id) {
  return GRAMMAR_TOPICS.find((t) => t.id === id);
}

export function characterById(id) {
  return CHARACTERS.find((c) => c.id === id) || CHARACTERS[0];
}
