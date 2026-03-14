# mapScor — Claude Project Memory

## Projekt-Identität
**Name:** mapScor  
**Tagline:** AI Audit Tool für Google Business Profiles  
**Domain:** mapscor.io (geplant)  
**Owner:** George (gesign.art)  
**Status:** Phase 1 — Landing Page + Free Audit Tool

---

## Was ist mapScor?
Ein KI-gestütztes Audit-Tool für Google Business Profiles (GBP).  
Nutzer geben ihre GBP-URL ein, wählen ein AI-Modell, und erhalten:
- Einen Score von 0–100
- Priorisierte Optimierungsvorschläge (High / Medium / Low Impact)
- Konkrete nächste Schritte

**Free:** Audit, Score, Vorschläge — kein Account nötig, BYOK (Bring Your Own Key) oder kostenlose AI-Modelle  
**Pro (Phase 2):** Dashboard, Rank Tracker, Review Manager, Post Scheduler, Competitor Analysis — €19/mo

---

## Kostenphilosophie (KRITISCH)
George möchte die laufenden Kosten in Phase 1 so niedrig wie möglich halten.

**Kostenstrategie:**
- **Hosting:** Vercel Free Tier (kein Upgrade bis nötig)
- **Datenbank:** Supabase Free Tier (500MB, ausreichend für Phase 1)
- **AI für Free Users:** Groq Free API (Llama 3.3 70B, kostenlos mit Rate Limit) + Google Gemini Free Tier
- **AI für Paid Users:** BYOK — User bringen eigenen API Key mit, mapScor zahlt NIE für User-AI-Calls
- **GBP-Daten:** Google Places API (kein eigener Scraper in Phase 1, zu teuer) — $17 per 1000 Requests, sparsam einsetzen
- **E-Mail:** Resend Free Tier (100 Mails/Tag) für Phase 1
- **Zahlungen:** Stripe (erst ab Phase 2, 0 Fixkosten)
- **Monitoring:** Vercel Analytics (kostenlos im Free Tier)

**Ziel:** Phase 1 für < €5/Monat betreiben (nur Domain-Kosten).

---

## Technologie-Stack

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS v3
- **Fonts:** Syne (Headings) + DM Sans (Body) — Google Fonts, kostenlos
- **UI Components:** shadcn/ui (kostenlos, lokal installiert)
- **Animationen:** Framer Motion (nur wo nötig, tree-shaking beachten)
- **Icons:** Lucide React

### Backend
- **API Routes:** Next.js API Routes (Serverless, kostenlos auf Vercel)
- **AI SDK:** Vercel AI SDK (unified interface für alle Modelle)
- **Auth (Phase 2):** Supabase Auth
- **DB (Phase 2):** Supabase Postgres

### AI-Modelle (Phase 1)
| Modell | Anbieter | Kosten für mapScor | Notizen |
|--------|----------|-------------------|---------|
| Llama 3.3 70B | Groq | Kostenlos (Rate Limited) | Default für Free Users |
| Gemini 1.5 Flash | Google | Kostenlos (15 req/min) | Alternative für Free Users |
| GPT-4o Mini | OpenAI | User zahlt (BYOK) | |
| Claude Haiku | Anthropic | User zahlt (BYOK) | |
| Claude Sonnet | Anthropic | User zahlt (BYOK) | |
| Gemini Pro | Google | User zahlt (BYOK) | |

### Externe APIs (Phase 1)
- **Google Places API:** NICHT verwendet in Phase 1 — bewusste Entscheidung zur Kostenvermeidung ($17/1000 Requests)
- **Audit-Datenquelle:** Self-Assessment Fragebogen (10 Fragen, User-Eingaben) ersetzt API-Fetching vollständig
- **Rate Limiting:** Upstash Redis Free Tier (10k requests/Tag) — verhindert API-Missbrauch
- **Phase 2 Pro:** Places API wird für zahlende User eingeführt (€19/mo deckt Kosten locker)

---

## Design-System

### Logo
- Datei: `mapscor_logo_2x.png` (vom Owner bereitgestellt, in `/public/logo.png` ablegen)
- Icon: grüner Stern mit Location-Pin
- Wortmarke: "map" in Weiß, "scor" in Grün (#00E5A0)
- Verwendung: Nav (height: 28–30px) + Footer (height: 26px)
- Hintergrund: immer dunkel (Logo funktioniert nur auf dark bg)

### Farben
```
Background:    #080B0E  (tiefstes Dunkel — AKTUALISIERT)
Surface:       #0E1215
Card:          #141820
Card2:         #181E26
Border:        rgba(255,255,255,0.06)
Border Accent: rgba(255,255,255,0.11)
Border Bold:   rgba(255,255,255,0.17)

Green:         #00E5A0  (Primary Accent)
Green Dim:     rgba(0,229,160,0.07)
Green Mid:     rgba(0,229,160,0.15)
Amber:         #F5A623  (Warning / Pro / Paid)
Amber Dim:     rgba(245,166,35,0.08)
Red:           #FF4B6E  (Error / High Impact)
Red Dim:       rgba(255,75,110,0.08)

Text:          #EEF1F5
Text2:         #C8CDD6
Muted:         rgba(200,205,214,0.55)
Hint:          rgba(200,205,214,0.28)
```

### Typografie
- **Alle Texte:** Space Grotesk (Google Fonts) — weights 300, 400, 500, 600, 700
- **Mono:** JetBrains Mono (für Code/API Keys)
- Kein Font-Mix — Space Grotesk übernimmt Headings und Body
- Warum Space Grotesk: expliziter Wunsch des Owners

### Design-Prinzipien
- Dark-only (kein Light Mode in Phase 1)
- Subtiles Noise-Texture Overlay im Body (CSS SVG feTurbulence, opacity ~0.5)
- Feines Grid-Pattern im Hero (CSS linear-gradient, mask-image radial-gradient)
- Grüner Radial-Glow hinter Hero und CTA-Section (filter: blur, pointer-events: none)
- Score-Circle ist immer das emotionale Zentrum der Result-Seite
- Hover-States: Feature-Cards bekommen `::after` grünen Bottom-Border (scaleX 0→1)
- Scroll Reveal: `.rv` Klasse, opacity+translateY via IntersectionObserver, delay-Varianten .rv1 .rv2 .rv3
- Mobile-first, responsive ab 375px
- Sticky Nav mit backdrop-blur beim Scrollen

---

## Score-Algorithmus (v1)

| Kategorie | Gewichtung | Was wird geprüft |
|-----------|-----------|-----------------|
| Vollständigkeit | 25% | Name, Adresse, Telefon, Website, Beschreibung, Kategorien, Attribute |
| Foto-Qualität & -Anzahl | 20% | Anzahl Fotos, Logo vorhanden, Cover-Foto |
| Review-Qualität | 20% | Durchschnitt, Anzahl, Aktualität, Antwortrate |
| Posts & Aktivität | 15% | Letzter Post, Posting-Frequenz |
| Keywords & Beschreibung | 10% | Relevante Keywords, Beschreibungslänge, lokale Terme |
| Öffnungszeiten | 5% | Vollständig, Sonderzeiten, Feiertage |
| Q&A | 5% | Vorhanden, beantwortet |

**Gesamtscore:** Gewichteter Durchschnitt → 0–100

---

## Projektstruktur (Monorepo)
```
mapscor/
├── CLAUDE.md                    ← Diese Datei
├── .claude/
│   └── agents/
│       ├── project-manager.md
│       ├── phase1-landing.md
│       ├── phase2-dashboard.md
│       └── code-optimizer.md
├── src/
│   ├── app/                     ← Next.js App Router
│   │   ├── page.tsx             ← Landing Page (Phase 1)
│   │   ├── audit/page.tsx       ← Audit Result Page
│   │   ├── dashboard/           ← Phase 2
│   │   └── api/
│   │       ├── audit/route.ts   ← Core Audit API
│   │       └── places/route.ts  ← GBP Data Fetcher
│   ├── components/
│   │   ├── ui/                  ← shadcn components
│   │   ├── audit/               ← Audit-spezifische Components
│   │   └── dashboard/           ← Phase 2
│   ├── lib/
│   │   ├── ai/                  ← AI Provider Abstraction
│   │   ├── scoring/             ← Score-Algorithmus
│   │   └── gbp/                 ← GBP Data Layer
│   └── styles/
│       └── globals.css
├── public/
├── .env.local                   ← Secrets (nie committen!)
├── package.json
└── next.config.ts
```

---

## Umgebungsvariablen (.env.local)
```bash
# Google Places API (sparsam verwenden!)
GOOGLE_PLACES_API_KEY=

# Free AI Models (mapScor bezahlt)
GROQ_API_KEY=           # Kostenlos — https://console.groq.com
GOOGLE_AI_API_KEY=      # Gemini Free Tier

# Rate Limiting (Upstash Redis Free)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Phase 2 (noch nicht nötig)
# NEXT_PUBLIC_SUPABASE_URL=
# NEXT_PUBLIC_SUPABASE_ANON_KEY=
# STRIPE_SECRET_KEY=
# RESEND_API_KEY=
```

---

## Phasen-Übersicht

### Phase 1 — Landing Page + Free Audit (aktuell)
- [ ] Next.js Projekt Setup (App Router, TypeScript, Tailwind, Space Grotesk)
- [ ] Design System implementieren (CSS Variables, Logo, Dark Mode)
- [ ] Landing Page — alle Sektionen:
  - Hero (Headline, Glow, Grid-Pattern, Input → scrollToAudit)
  - Social Proof Bar (Business-Namen + Stats)
  - How It Works (3 Schritte + interaktive Preview-Cards, Auto-Rotate)
  - Features Grid (3×3, Free/Pro Tags, Hover-Animation)
  - Live Demo (Score Circle + Kategorie-Balken animiert beim Scroll)
  - Eingebettetes Audit Form (Multi-Step, kein separater Link)
  - Warum mapScor (4 Cards + Vergleichstabelle vs. Andere Tools)
  - Testimonials (3 Cards, Featured-Styling)
  - Pricing (Free / Pro / Agency, "Beliebt"-Badge)
  - FAQ (Accordion, 2-spaltig)
  - CTA Bottom (Glow-Effekt)
  - Footer (Logo, Links, Made in Vienna)
- [ ] Multi-Step Audit Form (10 Fragen Self-Assessment, Back-Button, Auto-Advance)
- [ ] Audit Loading Animation (Checkmarks sequenziell, Score-Countdown)
- [ ] Score Result (Circle animiert, Kategorie-Balken, 3 freie Empfehlungen + Paywall)
- [ ] Shareable Score Card (OG Image via @vercel/og)
- [ ] Rate Limiting (Upstash, 5 Audits/IP/Tag)
- [ ] Deployment auf Vercel

### Phase 2 — Dashboard + Pro (nach Phase 1)
- [ ] Supabase Setup (Auth + DB)
- [ ] Pro Dashboard
- [ ] Stripe Integration
- [ ] Review Manager
- [ ] Rank Tracker (Geo-Grid)
- [ ] Post Scheduler
- [ ] Weekly Email Reports (Resend)
- [ ] Competitor Analysis

---

## Wichtige Entscheidungen & Begründungen

**Warum kein Google Places API und kein Scraper in Phase 1?**  
Google Places API kostet $17/1000 Requests. Bei 1.000 Audits/Monat = $17/Monat extra. In Phase 1 ist das unnötig — der Self-Assessment Fragebogen liefert alle nötigen Daten kostenlos. Phase 2 Pro-User finanzieren die API-Kosten über das Abo.

**Warum BYOK statt selbst bezahlen?**  
Der größte Risikofaktor für Kosten. Jeder Audit kostet ca. 1.000–3.000 Tokens. Bei 1.000 Audits/Tag wären das €20–50/Tag allein für AI. BYOK eliminiert dieses Risiko komplett.

**Warum Groq als Default?**  
Groq bietet Llama 3.3 70B kostenlos (mit Rate Limit: 30 req/min). Das ist stark genug für GBP-Analyse und kostet mapScor nichts. Perfekt für Phase 1.

**Warum Dark Mode only?**  
Einfacher zu implementieren, konsistenteres Design-Statement, kein CSS-Overhead für zwei Themes in Phase 1.

**Warum Space Grotesk statt Syne/DM Sans?**  
Expliziter Wunsch des Owners. Space Grotesk als einziger Font vereinfacht außerdem das Font-Loading (nur 1 Google Fonts Request statt 2).

**Warum Back-Button im Multi-Step Form?**  
User können sich bei Fragen irren. Ein dezenter Back-Button (versteckt auf Step 0, sichtbar ab Step 1) gibt Kontrolle ohne das Momentum zu brechen. Implementierung via `visibility:hidden` statt `display:none` — Layout bleibt stabil.

**Warum Self-Assessment statt API-Fetching?**  
Kein Google Places API Key nötig, €0 Betriebskosten in Phase 1. User reflektieren aktiv über ihr Profil (besseres Engagement). Score-Qualität ist ausreichend für Erstnutzung. Automatisches Fetching kommt in Phase 2 für zahlende User.

---

## Kontakt & Kontext
- Owner: George, gesign.art, Wien
- Ähnliches Produkt: localhq.io (Referenz/Wettbewerb)
- Valibelle (handmade resin shop in Wien) — möglicher erster Testnutzer
