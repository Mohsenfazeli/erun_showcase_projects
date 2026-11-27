# Erun Lab

**Erun Lab** is a showcase web app for [Erun Group](https://www.erungroup.ca), a Vancouver consultancy in data analytics, process automation and AI implementation. It has three working products, one per service. All three run on sample data for one fictional company, **Northwind Coastal Supply** (an outdoor gear retailer in BC and Alberta).

## The products

| # | Pillar | Product | Route | What it shows |
| --- | --- | --- | --- | --- |
| 01 | Data Analytics | Performance Dashboard | `/analytics` | Four KPI cards with sparklines; monthly revenue with a 6-month forecast and 80% range; a revenue-by-channel donut; revenue by region; a gross margin trend; and auto-generated insights. Filters for region and time range. |
| 02 | Process Automation | Automated Monthly Report | `/reports` | Pick a month and click *Generate*. You get a formatted report with an executive summary, key metrics table, and per-metric commentary covering the current value, year-over-year change, 3-year trend and short-term shift, plus a breakdown and outlook. Prints to PDF. |
| 03 | AI Implementation | HR Policy Assistant | `/assistant` | A chat assistant that answers only from Northwind's three policy documents (handbook, travel & expenses, IT & security) and cites the exact section. |

Every figure, company and document is **sample data** and is labelled as such in the app.

## Brand

The Lab follows erungroup.ca:

- **Typography:** Manrope.
- **Logo:** the Erun mark and the "erun." wordmark.
- **Style:** numbered eyebrow labels (`01 / DATA ANALYTICS`) and 6px corners.
- **Colours:** Primary Blue `#2F69DA`, Dark Blue `#2455B8`, Light Blue `#EAF1FC`, Navy `#0F172A`, Slate `#475569`, Muted Grey `#94A3B8`, Border `#E2E8F0`, Background `#F8FAFC`, White `#FFFFFF`. They are defined as tokens in `app/globals.css`.

## Tech stack

- Next.js 16 (App Router, TypeScript, Turbopack)
- Tailwind CSS v4
- Recharts and lucide-react
- Google Gemini via `@google/genai`, called only from the server route `app/api/ai/route.ts`

## Project structure

```
app/
  page.tsx               Lab home
  analytics/             01 Performance Dashboard
  reports/               02 Automated Monthly Report
  assistant/             03 HR Policy Assistant
  api/ai/route.ts        assistant endpoint (server only)
components/
  sidebar.tsx, product-header.tsx, brand.tsx
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
