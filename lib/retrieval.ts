/** Tiny keyword retrieval used by the offline (demo-mode) fallbacks. */

const STOP = new Set(
  "a an and are as at be but by can do does for from have how i if in is it its me my of on or our should so that the their there this to us we what when where which who why will with you your am was were been any about into than then them they get got need much many per".split(
    " ",
  ),
);

export function tokens(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP.has(t))
    .map((t) => t.replace(/(ies|s)$/, (m) => (m === "ies" ? "y" : "")));
}

export function scoreText(query: string, text: string, boost = "") {
  const q = new Set(tokens(query));
  if (!q.size) return 0;
  const body = tokens(text);
  const head = new Set(tokens(boost));
  let score = 0;
  q.forEach((t) => {
    const hits = body.filter((b) => b === t || (t.length > 4 && b.startsWith(t.slice(0, 5)))).length;
    score += Math.min(hits, 3);
    if (head.has(t)) score += 3;
  });
  return score / Math.sqrt(q.size);
}
