# Erun Lab

**Erun Lab** is a showcase web app for [Erun Group](https://www.erungroup.ca), a Vancouver consultancy in data analytics, process automation and AI implementation. It has three working products, one per service. All three run on sample data for one fictional company, **Northwind Coastal Supply** (an outdoor gear retailer in BC and Alberta).

## The products

| # | Pillar | Product | Route | What it shows |
| --- | --- | --- | --- | --- |
| 01 | Data Analytics | Performance Dashboard | `/analytics` | Four KPI cards with sparklines; monthly revenue with a 6-month forecast and 80% range; a revenue-by-channel donut; revenue by region; a gross margin trend; and auto-generated insights. Filters for region and time range. |
| 02 | Process Automation | Automated Monthly Report | `/reports` | Pick a month and click *Generate*. You get a formatted report with an executive summary, key metrics table, and per-metric commentary covering the current value, year-over-year change, 3-year trend and short-term shift, plus a breakdown and outlook. Prints to PDF. |
| 03 | AI Implementation | HR Policy Assistant | `/assistant` | A chat assistant that answers only from Northwind's three policy documents (handbook, travel & expenses, IT & security) and cites the exact section. |

Every figure, company and document is **sample data** and is labelled as such in the app.

## Looks like part of erungroup.ca

The Lab is built to read as the website's Lab page, not a separate app:

- **Same header and footer** as erungroup.ca. The logo and the *Expertise / Approach / About* links go back to the website; *Lab* is shown as the current page; *Book a consultation* opens the website's contact form.
- **Same CSS.** `app/site.css` is ported from the website's `src/styles.css` (header, footer, eyebrows, page intro, service grid and animated visuals, service blocks, call to action, responsive rules), using the same class names.
- **Same tokens.** `app/globals.css` uses the website's exact colour values and Manrope (variable font, for its 550/650 weights).
- **Lab home is one screen**, like the website hero: "See It Working." and three tiles that open each prototype, with no scrolling. Each tile has its own animated preview of that product (a dashboard filling in, a report writing itself, a chat answering from the handbook).
- **Same page pattern.** Product pages follow the website's service pages: an intro, the live product, a numbered use-case block, links to the other products, and the closing call to action.

When the website's header, footer or styles change, update `components/site-chrome.tsx` and `app/site.css` to match. Set `NEXT_PUBLIC_SITE_URL` to point the header links at a different site (for example a staging site).

## Tech stack

- Next.js 16 (App Router, TypeScript, Turbopack)
- Tailwind CSS v4
- Recharts and lucide-react
- Google Gemini via `@google/genai`, called only from the server route `app/api/ai/route.ts`

## Project structure

```
app/
  page.tsx               Lab home
  site.css               styles ported from erungroup.ca
  analytics/             01 Performance Dashboard
  reports/               02 Automated Monthly Report
  assistant/             03 HR Policy Assistant
  api/ai/route.ts        assistant endpoint (server only)
components/
  site-chrome.tsx        website header, footer and call to action
  lab-visuals.tsx        animated previews for the three Lab tiles
  product-page.tsx, product-header.tsx, brand.tsx
  products/              dashboard.tsx, report.tsx, assistant.tsx
data/
  company.ts             Northwind sample sales (60 months × region × channel)
  documents.ts           Northwind sample policy documents
lib/
  products.ts            the three products (sidebar, home, headers)
  metrics.ts             aggregation and formatting
  report.ts              report calculations and written commentary
  forecast.ts            trend + seasonality forecast
  gemini.ts, ai-handlers.ts   Gemini client and assistant logic with offline fallback
```

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
cp .env.example .env.local   # then add your key (optional)
npm run dev
```

Open http://localhost:3000.

### The AI assistant and the Gemini key

- Get a key from [Google AI Studio](https://aistudio.google.com/apikey) and set `GEMINI_API_KEY` in `.env.local` (locally) or in your Vercel project settings.
- The default model is `gemini-2.5-flash`. Set `GEMINI_MODEL` to use a newer model.
- The key is only read on the server and is never sent to the browser.
- **Without a key, or if the API fails or hits a quota, the assistant still answers.** It quotes the closest handbook section and shows a small "Offline mode" note.
- Guardrails:
  - The system prompt limits answers to the documents, requires citations and declines off-topic questions.
  - Questions are capped at 1,500 characters.
  - Each IP is limited to 10 requests per minute (in memory, per server instance).

## Deploy to Vercel

1. Import this repository in Vercel. It is detected as Next.js, with no extra configuration needed.
2. Add `GEMINI_API_KEY` under **Settings → Environment Variables** (and optionally `GEMINI_MODEL`).
3. Deploy.
4. Optional: add a custom domain such as `lab.erungroup.ca` and link it from erungroup.ca.

## Scripts

- `npm run dev`: development server
- `npm run build`: production build
- `npm run lint`: ESLint
