// Convierte un PDF a texto en el teléfono (con pdf.js), sin enviar el PDF a Claude.
// Mandar texto en vez del PDF completo consume muchos menos créditos.

let pdfjsPromise;

function loadPdfjs() {
  // Se carga solo cuando subes un PDF, para que la app abra rápido.
  pdfjsPromise ||= import('../vendor/pdfjs/pdf.min.mjs').then((pdfjs) => {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL('../vendor/pdfjs/pdf.worker.min.mjs', import.meta.url).href;
    return pdfjs;
  });
  return pdfjsPromise;
}

/** Agrupa los fragmentos de texto de una página en líneas, según su posición vertical. */
function pageToLines(items) {
  const lines = [];
  let current = '';
  let lastY = null;
  for (const item of items) {
    if (!('str' in item)) continue;
    const y = Math.round(item.transform[5]);
    if (lastY !== null && Math.abs(y - lastY) > 2 && current.trim()) {
      lines.push(current.trim());
      current = '';
    }
    current += item.str;
    if (item.hasEOL) {
      if (current.trim()) lines.push(current.trim());
      current = '';
    }
    lastY = y;
  }
  if (current.trim()) lines.push(current.trim());
  return lines.map((l) => l.replace(/\s{2,}/g, ' '));
}

/** Quita líneas que se repiten en casi todas las páginas (encabezados, pies, "Confidential", etc.). */
function dropRepeatedLines(pages) {
  if (pages.length < 3) return pages;
  const counts = new Map();
  for (const lines of pages) {
    for (const l of new Set(lines)) counts.set(l, (counts.get(l) || 0) + 1);
  }
  const threshold = Math.ceil(pages.length * 0.6);
  return pages.map((lines) => lines.filter((l) => counts.get(l) < threshold && !/^\d+\s*(\/|of|de)?\s*\d*$/.test(l)));
}

/** Devuelve { text, pages } con el texto del PDF en formato Markdown simple. */
export async function pdfToText(file, onProgress) {
  const pdfjs = await loadPdfjs();
  const task = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
  const doc = await task.promise;
  const pages = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    pages.push(pageToLines(content.items));
    onProgress?.(i, doc.numPages);
  }
  await task.destroy();
  const text = dropRepeatedLines(pages)
    .map((lines) => lines.join('\n'))
    .join('\n\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return { text, pages: pages.length };
}
