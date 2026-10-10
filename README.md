# Tutor Inglés BHP 🇦🇺🇮🇳

App para el celular (Android) para practicar inglés para las reuniones en BHP:

- **🗣️ Reunión**: un monito que mueve la boca te habla con acento **australiano** (Mick, Sarah) o **indio-australiano** (Priya, Arjun). Le respondes hablando y, después de cada intervención, te corrige la gramática, te muestra cómo lo diría un nativo y, **aprovechando la corrección, te enseña gramática que todavía no has visto** (present perfect continuous, future perfect, would condicional, reported speech, etc.). Después usa esa estructura en la conversación para que la practiques.
  - Puedes elegir un **escenario** (safety share, reunión semanal de operaciones, shutdown, ICAM, status update, KPIs, 1:1, small talk…) o **subir tus transcripciones reales** (PDF, .txt, .vtt) para simular esas reuniones.
  - Los **PDF se convierten a texto en el mismo teléfono** (con pdf.js) antes de guardarlos: a Claude solo le llega el texto, que cuesta mucho menos que enviar el PDF. Con 👁️ puedes revisar el texto extraído. Los PDF escaneados (fotos de páginas) no tienen texto y no se pueden convertir.
  - Opcional: fija un **foco gramatical** para la reunión.
  - **⏹️ Terminar** te da un resumen: fortalezas, errores que se repiten y qué practicar.
- **📘 Gramática**: 25 temas avanzados, cada uno con **máximo 5 sesiones** (explicación → práctica → traducción → hablar → evaluación), con ejercicios corregidos y ejemplos de BHP.
- **🎙️ Pronunciación**: frases de BHP para los sonidos difíciles para hispanohablantes (th, v/b, -ed, "schedule", schwa, acento de palabra…). Escuchas el modelo, lees en voz alta y ves qué palabras no se entendieron. Modo **"Entender acentos"**: dictado con voces australianas e indias.
- **💬 Dudas**: chat con Claude para preguntar lo que quieras (cómo decir algo, explicar gramática, preparar una reunión o un correo, qué practicar). Conoce tu perfil, tu progreso, tus errores, tus últimas reuniones simuladas y, si quieres, tus transcripciones. Las frases en inglés de la respuesta tienen 🔊 para escucharlas.
- **📈 Progreso**: errores más frecuentes, temas vistos, sesiones hechas y **gasto estimado** en la API.

**Personalizada con tus reuniones reales**: la gramática está ordenada según lo que más se usa en tus reuniones de Data & Digital (voz pasiva, present perfect, "What I'm saying is…", preguntas indirectas, modales para recomendar…), los personajes y escenarios son de integración de datos, arquitectura, modelo de soporte, gobierno y seguimiento, y hay una sección de **frases de reunión** reales (generalizadas) para escuchar y repetir. No se incluye ningún nombre, monto ni dato interno.

Lo que ya manejas (presente simple/continuo, will, going to, pasado simple, was/were, should/would como "debería") está cargado en `js/curriculum.js`, así el tutor no te enseña lo que ya sabes.

## Cómo instalarla en tu Android

1. **Publica la app** (una sola vez):
   - En GitHub: *Settings → Pages → Build and deployment → Source: **GitHub Actions***.
   - Haz merge de esta rama a `main`. El workflow `.github/workflows/pages.yml` la publica en `https://<tu-usuario>.github.io/tutor-ingles/`.
   - Si el repo es privado, GitHub Pages requiere plan Pro; si no, haz el repo público (no contiene datos tuyos: la API key y las transcripciones quedan solo en tu teléfono).
2. **Abre esa URL en Chrome** en el celular → menú ⋮ → **Agregar a pantalla de inicio / Instalar app**. Queda como un ícono más.
3. **API key**: crea una en [console.anthropic.com](https://console.anthropic.com) → *API keys*, cárgale unos dólares de crédito, y pégala en ⚙️ Ajustes. Se guarda solo en tu teléfono.
   - La app usa la **API de Claude** (se cobra por uso, unos centavos por sesión), no tu suscripción de la app de Claude.
4. **Voces**: si en los personajes aparece "⚠️ sin voz instalada", ve a *Ajustes de Android → Sistema → Idioma → Salida de texto a voz → Google → ⚙️ → Instalar datos de voz* y descarga **English (Australia)** y **English (India)**. En ⚙️ Ajustes de la app puedes elegir la voz exacta.
5. Da permiso de **micrófono** cuando Chrome lo pida.

## Voces naturales (Azure o Google Cloud)

Opcional pero recomendado: con una clave de Microsoft Azure Speech (500.000 caracteres gratis al mes, la más simple de configurar) o de Google Cloud Text-to-Speech (1.000.000 gratis) cada personaje habla con una voz natural (Chirp 3 HD) con acento australiano o indio, y la boca del monito se mueve con el volumen real del audio. El audio de cada frase se guarda en el teléfono, así repetirla no gasta caracteres. La app cuenta los caracteres del mes y, al llegar al límite que pongas en ⚙️ Ajustes (900.000 por defecto, bajo el millón gratis de Google), vuelve sola a las voces del celular.

## Costos

En ⚙️ Ajustes eliges el modelo:

| Modelo | Calidad | Costo aprox. por turno de reunión |
|---|---|---|
| Claude Opus 5.5 (por defecto) | La mejor | ~1–3 ¢ |
| Claude Sonnet 5.5 | Muy buena | ~0,5–1,5 ¢ |
| Claude Haiku 5.5 | Buena, más rápida | < 0,1 ¢ |

Con transcripciones largas cada turno cuesta más (se reenvía la transcripción; el *prompt caching* abarata los turnos siguientes). La pestaña Progreso muestra el gasto estimado.

Con Opus y Sonnet la app activa los *fallbacks* del servidor: si un filtro de seguridad rechaza una petición, la API la reintenta automáticamente con otro modelo.

## Notas honestas

- **Pronunciación**: Claude no recibe audio, recibe lo que entendió el reconocedor de voz de Android. Si una palabra sale mal transcrita, probablemente la pronunciaste distinto, pero el reconocedor a veces "adivina" y te perdona errores. Sirve como guía, no como evaluación fonética exacta.
- **Acento indio-australiano**: las voces de Android son "English (India)" y "English (Australia)". Para Priya y Arjun se usa la voz india y el personaje habla con vocabulario y expresiones de alguien que lleva años en Australia.
- **Confidencialidad**: las transcripciones de BHP se envían a la API de Anthropic cuando simulas esa reunión. Revisa que esto sea compatible con las políticas de información de BHP antes de subir reuniones con información sensible (o anonimízalas).

## Estructura

Sin build: HTML + JS (módulos ES) estático.

```
index.html            interfaz
css/app.css           estilos (modo claro/oscuro)
js/app.js             pantallas: reunión, gramática, pronunciación, progreso, ajustes
js/claude.js          llamadas a la API de Claude (structured outputs, costo)
js/prompts.js         prompts de sistema y esquemas JSON
js/curriculum.js      gramática conocida/por aprender, personajes, escenarios, frases
js/speech.js          voz (hablar/escuchar), avatar animado, comparación de palabras
js/store.js           ajustes/progreso (localStorage) y transcripciones (IndexedDB)
js/pdf.js             conversión de PDF a texto en el teléfono
vendor/pdfjs/         pdf.js 6.3.289 (Mozilla, Apache-2.0)
vendor/anthropic-sdk.js  SDK oficial @anthropic-ai/sdk 0.129.0 empaquetado
sw.js, manifest.webmanifest  instalación como app (PWA)
```

Para probar en el computador: `python3 -m http.server` en la carpeta y abrir `http://localhost:8000` en Chrome.
