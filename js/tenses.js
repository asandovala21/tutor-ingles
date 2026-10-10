// Usos de cada tiempo verbal (incluidos los "alternativos", marcados con alt: true)
// y comparaciones entre los tiempos que más se confunden.
// Ejemplos de reuniones de datos y tecnología, con traducción y pronunciación escrita
// (sílaba fuerte en MAYÚSCULA; z = th de think, dh = th de this, j = h suave).

export const TENSE_USES = [
  {
    id: 'present-simple', name: 'Present simple', form: 'I work / she works / do you work? / it doesn\'t work',
    uses: [
      { name: 'Hábitos y rutinas permanentes', ex: 'We meet every Tuesday.', es: 'Nos reunimos todos los martes.', pron: 'ui MIIT EV-ri TIUS-dei' },
      { name: 'Hechos y cosas que siempre son verdad', ex: 'The API returns the data in JSON.', es: 'La API devuelve los datos en JSON.', pron: 'dhi ei-pii-AI ri-TERNZ dhe DEI-ta in YEI-son' },
      { name: 'Estados (know, need, want, understand, belong…)', ex: 'I understand your point.', es: 'Entiendo tu punto.', pron: 'ai an-der-STAND yor POINT' },
      { name: 'Futuro con horarios y calendarios fijos', alt: true, ex: 'The meeting starts at 9 tomorrow.', es: 'La reunión empieza a las 9 mañana.', pron: 'dhe MII-ting STARTS at NAIN tu-MO-rou' },
      { name: 'Futuro después de when, once, until, if, as soon as', alt: true, ex: 'Once the vendor confirms, we will start.', es: 'Cuando el vendor confirme, empezaremos.', pron: 'UANS dhe VEN-dor kon-FERMS, ui uil START' },
      { name: 'Instrucciones y pasos (demos, procesos)', alt: true, ex: 'You open the report and you click on filters.', es: 'Abres el reporte y haces clic en filtros.', pron: 'yu OU-pen dhe ri-PORT an yu KLIK on FIL-ters' },
      { name: 'Contar algo de forma viva o resumir (titulares, historias)', alt: true, ex: 'So the vendor calls me and says it is not possible.', es: 'Entonces el vendor me llama y me dice que no es posible.', pron: 'sou dhe VEN-dor KOOLS mi an SES it is not PO-si-bol' },
    ],
  },
  {
    id: 'present-continuous', name: 'Present continuous', form: 'I am working / she is working / are you working?',
    uses: [
      { name: 'Lo que pasa ahora mismo', ex: 'I am sharing my screen now.', es: 'Estoy compartiendo mi pantalla ahora.', pron: 'ai am SHE-ring mai SKRIIN NAU' },
      { name: 'Situaciones temporales (alrededor de ahora)', ex: 'We are testing the pipeline this week.', es: 'Estamos probando el pipeline esta semana.', pron: 'ui ar TES-ting dhe PAIP-lain dhis UIIK' },
      { name: 'Hábitos TEMPORALES (no permanentes)', alt: true, ex: 'This month I am working from home on Fridays.', es: 'Este mes estoy trabajando desde casa los viernes.', pron: 'dhis MANZ aim UER-king from JOUM on FRAI-deis' },
      { name: 'Hábitos MOLESTOS con always / constantly', alt: true, ex: 'He is always joining the call late!', es: '¡Siempre se conecta tarde a la llamada!', pron: 'ji is OL-ueis YOI-ning dhe KOOL LEIT' },
      { name: 'Planes ya acordados para el futuro (con fecha u hora)', alt: true, ex: 'We are meeting the vendor on Friday.', es: 'Nos reunimos con el vendor el viernes.', pron: 'uir MII-ting dhe VEN-dor on FRAI-dei' },
      { name: 'Cambios y tendencias', ex: 'The data volume is increasing every month.', es: 'El volumen de datos está aumentando cada mes.', pron: 'dhe DEI-ta VO-lium is in-KRII-sing EV-ri MANZ' },
    ],
  },
  {
    id: 'to-be', name: 'Verbo to be (am / is / are / was / were)', form: 'I am / it is / they are / was / were / will be',
    uses: [
      { name: 'Identidad, rol, origen', ex: 'I am the data lead for Spence.', es: 'Soy la líder de datos de Spence.', pron: 'ai am dhe DEI-ta LIID for SPENS' },
      { name: 'Estado, ubicación, características', ex: 'The table is in the raw schema.', es: 'La tabla está en el esquema raw.', pron: 'dhe TEI-bol is in dhe ROO SKII-ma' },
      { name: 'Existencia: there is / there are / there was / there will be', ex: 'There are two open questions.', es: 'Hay dos preguntas abiertas.', pron: 'dher ar TU OU-pen KUES-chons' },
      { name: 'Para formar el continuo (be + -ing)', ex: 'They are working on it.', es: 'Están trabajando en eso.', pron: 'dhei ar UER-king on it' },
      { name: 'Para formar la voz pasiva (be + participio)', ex: 'The design was approved.', es: 'El diseño fue aprobado.', pron: 'dhe di-SAIN uos a-PRUUVD' },
      { name: 'be going to / be about to / be supposed to', alt: true, ex: 'The pipeline is about to start. It is supposed to finish at 8.', es: 'El pipeline está por empezar. Se supone que termina a las 8.', pron: 'dhe PAIP-lain is a-BAUT tu START. it is sa-POUSD tu FI-nish at EIT' },
      { name: 'Edad, tiempo, precio, clima', ex: 'It is cold in Perth today.', es: 'Hace frío en Perth hoy.', pron: 'it is KOULD in PERZ tu-DEI' },
    ],
  },
  {
    id: 'past-simple', name: 'Past simple', form: 'I worked / I sent / did you send? / it didn\'t work',
    uses: [
      { name: 'Acción terminada en un momento del pasado (yesterday, last week, in 2024)', ex: 'We met the vendor yesterday.', es: 'Nos reunimos con el vendor ayer.', pron: 'ui MET dhe VEN-dor YES-ter-dei' },
      { name: 'Secuencia de acciones en el pasado', ex: 'The pipeline failed, so we restarted it.', es: 'El pipeline falló, así que lo reiniciamos.', pron: 'dhe PAIP-lain FEILD, sou ui ri-STAR-tid it' },
      { name: 'Hábitos o estados pasados (que ya no ocurren)', ex: 'We worked with PI before.', es: 'Antes trabajábamos con PI.', pron: 'ui UERKT uidh pii-AI bi-FOR' },
      { name: 'Cortesía: suena más suave que el presente', alt: true, ex: 'I wanted to ask about the support model.', es: 'Quería preguntar sobre el modelo de soporte.', pron: 'ai UON-tid tu ASK a-BAUT dhe sa-PORT MO-del' },
      { name: 'Situaciones imaginarias: if, wish, it\'s time, would rather', alt: true, ex: 'If we had the volume, we could decide.', es: 'Si tuviéramos el volumen, podríamos decidir.', pron: 'if ui JAD dhe VO-lium, ui kud di-SAID' },
    ],
  },
  {
    id: 'past-continuous', name: 'Past continuous', form: 'I was working / they were working',
    uses: [
      { name: 'Acción en progreso en un momento del pasado', ex: 'At 10 I was talking to the vendor.', es: 'A las 10 estaba hablando con el vendor.', pron: 'at TEN ai uos TOO-king tu dhe VEN-dor' },
      { name: 'Acción larga interrumpida por otra corta (when)', ex: 'I was presenting when the call dropped.', es: 'Estaba presentando cuando se cortó la llamada.', pron: 'ai uos pri-SEN-ting uen dhe KOOL DROPT' },
      { name: 'Contexto o escena de una historia', ex: 'Everyone was waiting for the approval.', es: 'Todos estaban esperando la aprobación.', pron: 'EV-ri-uan uos UEI-ting for dhi a-PRUU-val' },
      { name: 'Cortesía muy suave: I was wondering…', alt: true, ex: 'I was wondering if you could send the HLD.', es: 'Me preguntaba si podrías enviar el HLD.', pron: 'ai uos UAN-de-ring if yu kud SEND dhi eich-el-DII' },
      { name: 'Planes del pasado que cambiaron', alt: true, ex: 'We were going to migrate in June, but it moved.', es: 'Íbamos a migrar en junio, pero se movió.', pron: 'ui uer GOU-ing tu MAI-greit in YUUN, bat it MUUVD' },
    ],
  },
  {
    id: 'present-perfect', name: 'Present perfect', form: 'I have sent / she has sent / have you sent?',
    uses: [
      { name: 'Pasado SIN fecha que importa ahora (resultado)', ex: 'We have completed the actions.', es: 'Ya completamos las acciones.', pron: 'ui jav kom-PLII-tid dhi AK-shons' },
      { name: 'Experiencia (ever, never, before)', ex: 'Have you ever worked with this vendor?', es: '¿Has trabajado alguna vez con este vendor?', pron: 'jav yu E-ver UERKT uidh dhis VEN-dor?' },
      { name: 'Algo que empezó en el pasado y sigue (since, for) con estados', ex: 'I have known the team since 2025.', es: 'Conozco al equipo desde 2025.', pron: 'aiv NOUN dhe TIIM sins tu-zau-sand-TUEN-ti-faiv' },
      { name: 'Noticias recientes (just, already, yet)', alt: true, ex: 'The vendor has just confirmed it.', es: 'El vendor acaba de confirmarlo.', pron: 'dhe VEN-dor jas YAST kon-FERMD it' },
      { name: 'Periodo no terminado (this week, today, so far)', alt: true, ex: 'We have had three incidents this month.', es: 'Hemos tenido tres incidentes este mes.', pron: 'uiv JAD ZRII IN-si-dents dhis MANZ' },
    ],
  },
  {
    id: 'present-perfect-continuous', name: 'Present perfect continuous', form: 'I have been working / it has been running',
    uses: [
      { name: 'Actividad que empezó antes y sigue ahora (duración)', ex: 'We have been working on this since May.', es: 'Llevamos trabajando en esto desde mayo.', pron: 'uiv bin UER-king on dhis sins MEI' },
      { name: 'Actividad reciente con resultado visible', ex: 'Sorry, I have been running between meetings.', es: 'Perdón, he estado corriendo entre reuniones.', pron: 'SO-ri, aiv bin RA-ning bi-TUIIN MII-tings' },
      { name: 'Quejas por algo que dura (con énfasis)', alt: true, ex: 'We have been waiting for an answer for two weeks.', es: 'Llevamos dos semanas esperando una respuesta.', pron: 'uiv bin UEI-ting for an AN-ser for TU UIIKS' },
    ],
  },
  {
    id: 'past-perfect', name: 'Past perfect', form: 'I had sent / they had finished',
    uses: [
      { name: 'Lo que pasó ANTES de otro momento del pasado', ex: 'The pipeline had stopped before we checked it.', es: 'El pipeline se había detenido antes de que lo revisáramos.', pron: 'dhe PAIP-lain jad STOPT bi-FOR ui CHEKT it' },
      { name: 'Reported speech (cuando el original está en pasado)', ex: 'He said they had tested it.', es: 'Dijo que lo habían probado.', pron: 'ji SED dhei jad TES-tid it' },
      { name: 'Situaciones imaginarias del pasado (3er condicional, wish)', alt: true, ex: 'If we had asked earlier, we would have saved time.', es: 'Si hubiéramos preguntado antes, habríamos ahorrado tiempo.', pron: 'if ui jad ASKT ER-li-er, ui UU-dav SEIVD TAIM' },
    ],
  },
  {
    id: 'past-perfect-continuous', name: 'Past perfect continuous', form: 'I had been working',
    uses: [
      { name: 'Duración de algo hasta un momento del pasado', ex: 'We had been waiting for the PO for weeks when it arrived.', es: 'Llevábamos semanas esperando la orden de compra cuando llegó.', pron: 'ui jad bin UEI-ting for dhe pii-OU for UIIKS uen it a-RAIVD' },
      { name: 'Causa de una situación pasada', ex: 'The server crashed because it had been running for days.', es: 'El servidor se cayó porque llevaba días funcionando.', pron: 'dhe SER-ver KRASHT bi-KOS it jad bin RA-ning for DEIS' },
    ],
  },
  {
    id: 'will', name: 'Will', form: 'I will (I\'ll) send / it won\'t work / will you…?',
    uses: [
      { name: 'Decisión en el momento', ex: 'I will send you the link now.', es: 'Te mando el link ahora.', pron: 'ail SEND yu dhe LINK NAU' },
      { name: 'Ofrecimientos y promesas', ex: 'I will follow up with the vendor.', es: 'Yo hago el seguimiento con el vendor.', pron: 'ail FO-lou AP uidh dhe VEN-dor' },
      { name: 'Predicciones u opiniones (I think, probably)', ex: 'I think it will take two months.', es: 'Creo que tomará dos meses.', pron: 'ai zink it uil TEIK TU MANZS' },
      { name: 'Suposición sobre el presente', alt: true, ex: 'That will be the vendor calling.', es: 'Ese debe ser el vendor llamando.', pron: 'dhat uil bi dhe VEN-dor KOO-ling' },
      { name: 'Hábito o comportamiento típico (y quejas con won\'t)', alt: true, ex: 'The system won\'t accept the file.', es: 'El sistema no quiere aceptar el archivo.', pron: 'dhe SIS-tem UOUNT ak-SEPT dhe FAIL' },
    ],
  },
  {
    id: 'going-to', name: 'Be going to', form: 'I am going to send / it is going to fail',
    uses: [
      { name: 'Plan o intención ya decidida', ex: 'We are going to migrate to the new version.', es: 'Vamos a migrar a la nueva versión.', pron: 'uir GOU-ing tu MAI-greit tu dhe NIU VER-shon' },
      { name: 'Predicción con evidencia ahora', ex: 'Look at the trend, we are going to exceed the quota.', es: 'Mira la tendencia, vamos a pasarnos de la cuota.', pron: 'luk at dhe TREND, uir GOU-ing tu ek-SIID dhe KUOU-ta' },
    ],
  },
  {
    id: 'future-continuous', name: 'Future continuous', form: 'I will be working',
    uses: [
      { name: 'Acción en progreso en un momento del futuro', ex: 'This time tomorrow I will be flying to Perth.', es: 'Mañana a esta hora estaré volando a Perth.', pron: 'dhis TAIM tu-MO-rou ail bi FLAI-ing tu PERZ' },
      { name: 'Algo que pasará como parte normal de los planes', alt: true, ex: 'The global team will be moving the data.', es: 'El equipo global estará moviendo los datos.', pron: 'dhe GLOU-bal TIIM uil bi MUU-ving dhe DEI-ta' },
      { name: 'Preguntar planes con cortesía', alt: true, ex: 'Will you be joining the call on Friday?', es: '¿Te vas a unir a la llamada del viernes?', pron: 'uil yu bi YOI-ning dhe KOOL on FRAI-dei?' },
    ],
  },
  {
    id: 'future-perfect', name: 'Future perfect (y continuo)', form: 'I will have finished / I will have been working',
    uses: [
      { name: 'Algo terminado ANTES de un momento futuro (by)', ex: 'By November we will have deployed it.', es: 'Para noviembre lo habremos desplegado.', pron: 'bai no-VEM-ber ui uil jav di-PLOID it' },
      { name: 'Duración hasta un momento futuro', ex: 'By June I will have been working here for two years.', es: 'En junio cumpliré dos años trabajando aquí.', pron: 'bai YUUN ail jav bin UER-king jir for TU YIIRS' },
      { name: 'Suposición sobre el pasado', alt: true, ex: 'They will have seen the email by now.', es: 'A esta altura ya habrán visto el correo.', pron: 'dhei uil jav SIIN dhi II-meil bai NAU' },
    ],
  },
  {
    id: 'would', name: 'Would', form: 'I would (I\'d) / would you…? / would have + participio',
    uses: [
      { name: 'Condicional (2do y 3er condicional)', ex: 'If we had more data, we would build the model.', es: 'Si tuviéramos más datos, construiríamos el modelo.', pron: 'if ui jad MOR DEI-ta, ui uud BILD dhe MO-del' },
      { name: 'Peticiones y ofrecimientos corteses', ex: 'Would you mind sharing the diagram?', es: '¿Te molestaría compartir el diagrama?', pron: 'uud yu MAIND SHE-ring dhe DAI-a-gram?' },
      { name: 'Preferencias: I would like / I would rather', ex: 'I would rather keep one table.', es: 'Preferiría mantener una tabla.', pron: 'aid RA-dher KIIP UAN TEI-bol' },
      { name: 'Hábitos repetidos del pasado (solo ACCIONES, como used to)', alt: true, ex: 'Back then we would run the checks every night.', es: 'En ese tiempo corríamos los chequeos cada noche.', pron: 'BAK dhen ui uud RAN dhe CHEKS EV-ri NAIT' },
      { name: 'Quejas: alguien que insiste en algo molesto', alt: true, ex: 'Of course he would say that! / I wish they would reply.', es: '¡Claro que él diría eso! / Ojalá respondieran.', pron: 'ov KORS ji UUD SEI dhat / ai UISH dhei uud ri-PLAI' },
      { name: 'Futuro visto desde el pasado (reported speech)', alt: true, ex: 'She said she would send it on Friday.', es: 'Dijo que lo enviaría el viernes.', pron: 'shi SED shi uud SEND it on FRAI-dei' },
      { name: 'Consejo suave: I would… / I wouldn\'t…', alt: true, ex: 'I wouldn\'t create separate tables.', es: 'Yo no crearía tablas separadas.', pron: 'ai UU-dent kri-EIT SE-pa-rat TEI-bols' },
    ],
  },
  {
    id: 'used-to', name: 'Used to (y be/get used to)', form: 'I used to work / did you use to…? / I\'m used to / I\'m getting used to',
    uses: [
      { name: 'Hábitos pasados que ya NO ocurren (acciones)', ex: 'We used to send the data by email.', es: 'Antes enviábamos los datos por correo.', pron: 'ui IUS-tu SEND dhe DEI-ta bai II-meil' },
      { name: 'Estados pasados que ya NO son así (aquí NO sirve would)', ex: 'There used to be two databases.', es: 'Antes había dos bases de datos.', pron: 'dher IUS-tu bi TU DEI-ta-bei-sis' },
      { name: 'be used to + -ing: estar acostumbrada', alt: true, ex: 'I am used to working with Australia.', es: 'Estoy acostumbrada a trabajar con Australia.', pron: 'aim IUST tu UER-king uidh os-TREI-lia' },
      { name: 'get used to + -ing: acostumbrarse (proceso)', alt: true, ex: 'I am getting used to the accent.', es: 'Me estoy acostumbrando al acento.', pron: 'aim GUE-ting IUST tu dhi AK-sent' },
    ],
  },
];

// Pares de tiempos que más se confunden.
export const TENSE_COMPARISONS = [
  {
    id: 'ps-pc', a: 'Present simple', b: 'Present continuous',
    rule: 'Simple = permanente, rutina, hecho, horario fijo. Continuous = ahora, temporal, cambio, plan acordado, hábito molesto con "always".',
    signals: 'Simple: always, usually, every day, on Mondays. Continuous: now, at the moment, this week, currently, these days.',
    decide: '¿Es permanente o una rutina normal? → simple. ¿Es solo por ahora, está cambiando o ya está agendado? → continuous. Verbos de estado (know, need, want, understand) casi siempre en simple.',
    examples: [
      { en: 'I work in Data & Digital.', es: 'Trabajo en Data & Digital (permanente).', pron: 'ai UERK in DEI-ta an DI-yi-tal' },
      { en: 'This month I am working on the API integration.', es: 'Este mes estoy trabajando en la integración de la API (temporal).', pron: 'dhis MANZ aim UER-king on dhi ei-pii-AI in-te-GREI-shon' },
    ],
    quiz: [
      { q: 'We usually ___ (meet) on Tuesdays.', options: ['meet', 'are meeting'], answer: 0, why: 'Rutina con "usually" → present simple.' },
      { q: 'Sorry, I ___ (share) the wrong screen right now.', options: ['share', 'am sharing'], answer: 1, why: 'Está pasando ahora → continuous.' },
      { q: 'I ___ (need) the volume estimate.', options: ['need', 'am needing'], answer: 0, why: '"need" es verbo de estado → simple.' },
      { q: 'We ___ (meet) the vendor on Friday at 10.', options: ['meet', 'are meeting'], answer: 1, why: 'Plan ya acordado con fecha → continuous.' },
    ],
  },
  {
    id: 'past-pp', a: 'Past simple', b: 'Present perfect',
    rule: 'Past simple = momento terminado y conocido (yesterday, last week, in May). Present perfect = sin fecha, importa el resultado ahora, o periodo que sigue abierto.',
    signals: 'Past simple: yesterday, last…, ago, in 2024, when…? Present perfect: already, yet, just, ever, never, so far, this week, since, for.',
    decide: '¿Dices cuándo pasó o el periodo ya terminó? → past simple. ¿No dices cuándo, o el periodo sigue abierto (today, this month)? → present perfect. Nunca uses "yesterday" o "ago" con present perfect.',
    examples: [
      { en: 'We sent the requirements last week.', es: 'Enviamos los requerimientos la semana pasada.', pron: 'ui SENT dhe ri-KUAI-er-ments last UIIK' },
      { en: 'We have already sent the requirements.', es: 'Ya enviamos los requerimientos (resultado ahora).', pron: 'uiv ol-RE-di SENT dhe ri-KUAI-er-ments' },
    ],
    quiz: [
      { q: 'I ___ (talk) to the business user two days ago.', options: ['talked', 'have talked'], answer: 0, why: '"ago" marca un momento terminado → past simple.' },
      { q: 'We ___ (not receive) an answer yet.', options: ["didn't receive", "haven't received"], answer: 1, why: '"yet" → present perfect.' },
      { q: 'I ___ (work) here since 2020.', options: ['worked', 'have worked'], answer: 1, why: 'Empezó en el pasado y sigue → present perfect (o perfect continuous).' },
      { q: 'When ___ you ___ (send) the HLD?', options: ['did / send', 'have / sent'], answer: 0, why: 'Preguntas con "when" piden un momento → past simple.' },
    ],
  },
  {
    id: 'pp-ppc', a: 'Present perfect', b: 'Present perfect continuous',
    rule: 'Perfect = resultado o cantidad terminada (how many, already). Perfect continuous = duración de una actividad que sigue o acaba de terminar (how long).',
    signals: 'Perfect: already, three times, how many. Continuous: for, since, how long, all day, lately.',
    decide: '¿Importa cuánto hiciste o el resultado? → perfect. ¿Importa cuánto tiempo llevas haciéndolo? → perfect continuous. Con verbos de estado (know, have, be) usa perfect: "I have known him for years".',
    examples: [
      { en: 'We have tested five endpoints.', es: 'Hemos probado cinco endpoints (resultado).', pron: 'uiv TES-tid FAIV END-points' },
      { en: 'We have been testing the endpoints all week.', es: 'Llevamos toda la semana probando los endpoints (duración).', pron: 'uiv bin TES-ting dhi END-points OL UIIK' },
    ],
    quiz: [
      { q: 'I ___ (write) three emails to the vendor.', options: ['have written', 'have been writing'], answer: 0, why: 'Cantidad terminada → present perfect.' },
      { q: 'We ___ (wait) for the PO for two weeks.', options: ['have waited', 'have been waiting'], answer: 1, why: 'Duración de algo que sigue → perfect continuous.' },
      { q: 'I ___ (know) the architect for a year.', options: ['have known', 'have been knowing'], answer: 0, why: '"know" es de estado → no va en continuo.' },
    ],
  },
  {
    id: 'past-pastc', a: 'Past simple', b: 'Past continuous',
    rule: 'Past simple = acción completa, corta o la que interrumpe. Past continuous = acción en progreso, el fondo de la escena, la que es interrumpida.',
    signals: 'Simple: then, suddenly, when + acción corta. Continuous: while, at 10 o\'clock, all morning.',
    decide: '¿Qué estaba pasando (larga)? → continuous. ¿Qué pasó de golpe (corta)? → simple. "I was presenting when the call dropped."',
    examples: [
      { en: 'I was presenting when the call dropped.', es: 'Estaba presentando cuando se cortó la llamada.', pron: 'ai uos pri-SEN-ting uen dhe KOOL DROPT' },
      { en: 'I presented the plan and then we discussed it.', es: 'Presenté el plan y luego lo discutimos.', pron: 'ai pri-SEN-tid dhe PLAN an dhen ui dis-KAST it' },
    ],
    quiz: [
      { q: 'While we ___ (review) the diagram, the architect joined.', options: ['reviewed', 'were reviewing'], answer: 1, why: '"while" + acción en progreso → continuous.' },
      { q: 'The vendor ___ (call) while I was driving.', options: ['called', 'was calling'], answer: 0, why: 'La acción corta que interrumpe → past simple.' },
    ],
  },
  {
    id: 'past-pastperf', a: 'Past simple', b: 'Past perfect',
    rule: 'Past perfect = lo que pasó ANTES de otro hecho del pasado. Si el orden es obvio (after, before) muchas veces basta el past simple.',
    signals: 'Past perfect: already, by the time, before, after, when (= antes de eso).',
    decide: '¿Hay dos hechos pasados y quieres dejar claro cuál fue primero? → el primero en past perfect.',
    examples: [
      { en: 'When I joined, the meeting had started.', es: 'Cuando me conecté, la reunión ya había empezado.', pron: 'uen ai YOIND, dhe MII-ting jad STAR-tid' },
      { en: 'When I joined, the meeting started.', es: 'Cuando me conecté, empezó la reunión (después).', pron: 'uen ai YOIND, dhe MII-ting STAR-tid' },
    ],
    quiz: [
      { q: 'By the time we checked, the job ___ (fail).', options: ['failed', 'had failed'], answer: 1, why: 'Falló antes de que revisáramos → past perfect.' },
      { q: 'He said they ___ (already / test) it.', options: ['already tested', 'had already tested'], answer: 1, why: 'Reported speech de algo anterior → past perfect.' },
    ],
  },
  {
    id: 'futures', a: 'Will', b: 'Going to / Present continuous',
    rule: 'Will = decisión en el momento, promesa, ofrecimiento, opinión. Going to = intención ya decidida o predicción con evidencia. Present continuous = plan acordado con otros (fecha, hora). Present simple = horario fijo.',
    signals: 'Will: I think, probably, OK I\'ll… Going to: we have decided, look at… Continuous: on Friday at 10, next week (agendado).',
    decide: '¿Lo decides ahora mismo? → will. ¿Ya lo tenías decidido? → going to. ¿Ya está en el calendario con otros? → present continuous. ¿Es un horario oficial? → present simple.',
    examples: [
      { en: 'OK, I will send it right now.', es: 'Ok, lo envío ahora mismo (decisión en el momento).', pron: 'ou-KEI, ail SEND it rait NAU' },
      { en: 'We are going to replace the old system next year.', es: 'Vamos a reemplazar el sistema antiguo el próximo año (plan).', pron: 'uir GOU-ing tu ri-PLEIS dhi OULD SIS-tem nekst YIIR' },
    ],
    quiz: [
      { q: 'A: The link doesn\'t work. B: Sorry, I ___ (send) it again.', options: ["'ll send", "'m going to send"], answer: 0, why: 'Decisión en el momento → will.' },
      { q: 'We ___ (meet) the vendor tomorrow at 9; it\'s in the calendar.', options: ['will meet', 'are meeting'], answer: 1, why: 'Plan acordado y agendado → present continuous.' },
      { q: 'Look at these numbers. We ___ (exceed) the quota.', options: ['will exceed', 'are going to exceed'], answer: 1, why: 'Predicción con evidencia visible → going to.' },
    ],
  },
  {
    id: 'usedto-would', a: 'Used to', b: 'Would / Past simple',
    rule: 'Used to = hábitos Y estados del pasado que ya no ocurren. Would = solo ACCIONES repetidas del pasado (nunca estados), suena a recuerdo. Past simple = sirve para todo, pero no marca que "ya no ocurre".',
    signals: 'Used to: before, in the past, when I started. Would: back then, every night (acciones).',
    decide: '¿Es un estado (be, have, know, live)? → solo used to o past simple. ¿Es una acción repetida? → used to o would. ¿Pasó una sola vez? → solo past simple.',
    examples: [
      { en: 'There used to be two databases.', es: 'Antes había dos bases de datos (estado → no "would").', pron: 'dher IUS-tu bi TU DEI-ta-bei-sis' },
      { en: 'Back then we would export the data every night.', es: 'En ese tiempo exportábamos los datos cada noche (acción).', pron: 'BAK dhen ui uud eks-PORT dhe DEI-ta EV-ri NAIT' },
    ],
    quiz: [
      { q: 'I ___ live in Antofagasta.', options: ['used to', 'would'], answer: 0, why: '"live" es un estado → used to (would no sirve).' },
      { q: 'Back then, every Friday we ___ send a manual report.', options: ['would', 'were used to'], answer: 0, why: 'Acción repetida del pasado → would (o used to). "Were used to" significa "estábamos acostumbrados".' },
      { q: 'I ___ (meet) the vendor for the first time in 2025.', options: ['used to meet', 'met'], answer: 1, why: 'Pasó una sola vez → past simple.' },
    ],
  },
  {
    id: 'futc-futp', a: 'Future continuous', b: 'Future perfect',
    rule: 'Future continuous = algo EN PROGRESO en un momento del futuro. Future perfect = algo YA TERMINADO antes de un momento del futuro.',
    signals: 'Continuous: this time tomorrow, at 10 next Monday. Perfect: by Friday, by the end of the month, by then.',
    decide: '¿Estará pasando? → will be + -ing. ¿Estará terminado? → will have + participio. "by" casi siempre pide future perfect.',
    examples: [
      { en: 'At 10 tomorrow I will be presenting the plan.', es: 'Mañana a las 10 estaré presentando el plan.', pron: 'at TEN tu-MO-rou ail bi pri-SEN-ting dhe PLAN' },
      { en: 'By 11 I will have presented the plan.', es: 'Para las 11 ya habré presentado el plan.', pron: 'bai i-LE-ven ail jav pri-SEN-tid dhe PLAN' },
    ],
    quiz: [
      { q: 'By Friday we ___ (finish) the tests.', options: ['will be finishing', 'will have finished'], answer: 1, why: '"by Friday" → terminado antes → future perfect.' },
      { q: 'This time next week I ___ (fly) to Perth.', options: ['will be flying', 'will have flown'], answer: 0, why: 'En progreso en ese momento → future continuous.' },
    ],
  },
];
