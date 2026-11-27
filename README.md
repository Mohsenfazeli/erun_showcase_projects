# Erun Lab

**Erun Lab** is a showcase web app for [Erun Consulting Group](https://www.erungroup.ca), a Vancouver consultancy in data analytics, process automation and AI implementation. It hosts nine small, interactive demos. Each one tackles a common business problem using built-in sample data.

## The demos

| Pillar | Demo | Route | What it shows |
| --- | --- | --- | --- |
| Data Analytics | Economic & Market Pulse | `/market-pulse` | Region/sector filters, KPI cards, trend charts with a 6-month forecast band, generated summary |
| Data Analytics | Demand Forecasting Playground | `/forecasting` | Trend + seasonality forecast, confidence band, seasonality chart, what-if sliders, optional CSV upload (parsed in the browser) |
| Data Analytics | Small Business Site Selector | `/site-selector` | Business type + weighting sliders → ranked neighbourhoods, score breakdown bars, schematic map |
| Process Automation | Invoice & Receipt Extractor | `/invoice-extractor` | Three sample documents, animated step-by-step extraction, validation flags, CSV/JSON export |
| Process Automation | Report Automation | `/report-automation` | Raw export → one-click formatted monthly report with KPIs, charts and commentary; print to PDF |
| Process Automation | Workflow ROI Calculator | `/roi-calculator` | Savings, payback period, 3-year chart and a suggested automation approach |
| AI Implementation | Chat with Your Documents | `/doc-chat` | Q&A grounded in three sample company documents, with section citations |
| AI Implementation | Customer Support Triage Agent | `/support-triage` | Category, urgency, sentiment, routing and a drafted reply for a customer email |
| AI Implementation | Policy & Regulation Explainer | `/policy-explainer` | Plain-language answers on BC business topics, with official links and a "Not legal advice" note |

All figures, companies and documents are **sample data** and are labelled as such in the app. Nothing shown is a real statistic.

## Tech stack

- Next.js 16 (App Router, TypeScript, Turbopack)
- Tailwind CSS v4 with shadcn/ui-style components (Radix primitives)
- Recharts for charts, lucide-react for icons
- Google Gemini via `@google/genai`, called only from the server route `app/api/ai/route.ts`

## Project structure

```
app/
  layout.tsx            sidebar + main pane
  page.tsx              Lab home with demo cards
  <demo>/page.tsx       one folder per demo
  api/ai/route.ts       shared AI endpoint (mode: doc-chat | triage | policy)
components/
  sidebar.tsx, demo-header.tsx, chat-shell.tsx, kpi-card.tsx
  demos/                one client component per demo
  ui/                   button, card, badge, form controls
data/                   sample datasets, documents and emails
lib/
  demos.ts              single list of the 9 demos (used by sidebar and home)
  gemini.ts             Gemini client (server only)
  ai-handlers.ts        prompts, schemas and offline fallbacks
  forecast.ts           trend + seasonality forecasting
```

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
cp .env.example .env.local   # then add your key (optional)
npm run dev
```

Open http://localhost:3000.

### AI demos and the Gemini key

- Get a key from [Google AI Studio](https://aistudio.google.com/apikey) and set `GEMINI_API_KEY` in `.env.local` (locally) or in your Vercel project settings.
- The default model is `gemini-2.5-flash`. Set `GEMINI_MODEL` to use a different one (for example a newer Flash model).
- The key is only read on the server and is never sent to the browser.
- **Without a key, or if the API fails or hits a quota, the demos still work.** They fall back to offline responses (keyword search over the sample documents, rule-based triage, pre-written BC topic summaries) and show a small "Demo mode" note.
- Guardrails: inputs are capped at 2,000 characters, requests are limited to 10 per minute per IP (in memory, per server instance), and system prompts keep each assistant on topic.

## Deploy to Vercel

1. Import this repository in Vercel. It is detected as Next.js; no extra configuration is needed.
2. Add `GEMINI_API_KEY` under **Settings → Environment Variables** (and optionally `GEMINI_MODEL`).
3. Deploy.
4. Optional: add a custom domain such as `lab.erungroup.ca`, then link to it from erungroup.ca ("Check out our Lab").

## Scripts

- `npm run dev`: development server
- `npm run build`: production build
- `npm run lint`: ESLint
