# Agent: Phase 1 — Landing Page & Free Audit
**Rolle:** Frontend-Entwicklung, Audit Flow, Score UI  
**Scope:** Alles was ein nicht-eingeloggter Nutzer sieht und erlebt  
**Mandat:** Phase 1 vollständig implementieren — schön, schnell, kostenlos betreibbar

---

## Dein Auftrag

Du baust das Gesicht von mapScor. Alles was ein Erstbesucher sieht: Landing Page, Audit Flow, Score-Ergebnis, Optimierungsvorschläge. Dein Code muss produktionsreif, performant und pixelgenau sein.

**Du bist verantwortlich für:**
- Landing Page (alle Sections)
- Audit-Eingabe Flow
- AI-Modell Auswahl (inkl. BYOK)
- Score Visualisierung
- Optimierungsvorschläge UI
- Shareable Result (OG Image)
- Responsive Design (Mobile First)
- API Routes: `/api/audit` und `/api/places`

**Du bist NICHT verantwortlich für:**
- Auth, Logins, Accounts → Phase-2-Agent
- Payments → Phase-2-Agent
- Dashboard → Phase-2-Agent
- Sicherheits-Audits → Code-Optimizer-Agent

---

## Design-Referenz

Immer CLAUDE.md konsultieren für Farben, Logo und Design-Prinzipien.

**Font:** Space Grotesk (Google Fonts) — einziger Font, weights 300–700. Kein Syne, kein DM Sans.

**Logo:** `mapscor_logo_2x.png` → in `/public/logo.png` ablegen, via `<img>` oder `next/image` einbinden.
- Nav: height 28–30px
- Footer: height 26px
- Immer auf dunklem Hintergrund

**Visueller Charakter:**
- Fühlt sich an wie ein modernes SaaS-Tool für digitale Unternehmer
- Score-Circle ist das emotionale Zentrum jeder Result-Seite
- Grün = gut, Amber = warnt/Pro-Feature, Rot = kritisch/High Impact
- Animationen: dezent und zweckorientiert — Score zählt hoch, Balken füllen sich, Cards revealen sich beim Scroll
- Noise-Texture + Grid-Pattern im Hero = Tiefe ohne Ablenkung
- Sticky Nav mit backdrop-blur erst nach Scroll (JS classList toggle)

---

## Projekt Setup (einmalig)

```bash
npx create-next-app@latest mapscor \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd mapscor

# shadcn/ui
npx shadcn@latest init

# Dependencies
npm install @vercel/ai groq-sdk @google/generative-ai
npm install @upstash/redis @upstash/ratelimit
npm install zod react-hook-form @hookform/resolvers
npm install framer-motion
npm install next-themes
npm install @vercel/og  # für Share Cards

# Dev Dependencies  
npm install -D @types/node
```

---

## Tailwind Config (tailwind.config.ts)

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ms: {
          bg:      '#080B0E',
          surface: '#0E1215',
          card:    '#141820',
          card2:   '#181E26',
          green:   '#00E5A0',
          amber:   '#F5A623',
          red:     '#FF4B6E',
          text:    '#EEF1F5',
          text2:   '#C8CDD6',
          muted:   'rgba(200,205,214,0.55)',
          hint:    'rgba(200,205,214,0.28)',
          border:  'rgba(255,255,255,0.06)',
          'border-a': 'rgba(255,255,255,0.11)',
          'border-b': 'rgba(255,255,255,0.17)',
        }
      },
      fontFamily: {
        // Space Grotesk als einziger Font
        sans: ['var(--font-space-grotesk)', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}

export default config
```

---

## Fonts Setup (layout.tsx)

```typescript
import { Space_Grotesk } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

// Im body className:
// className={`${spaceGrotesk.variable} font-sans`}
```

---

## Landing Page Sektionen (vollständige Spec)

### 1. Navigation (sticky)
```
[Logo] | Features · Warum mapScor · Preise · FAQ | [Login] [Kostenlos testen →]
```
- Transparent beim Laden; nach 20px Scroll: `backdrop-filter:blur(18px)` + `border-bottom:1px solid var(--border)`
- Mobile (< 900px): Nav-Links ausgeblendet, nur Logo + CTA-Button
- Logo: `<img src="/logo.png">`, height 28–30px, immer auf dunklem Hintergrund

### 2. Hero
```
Badge: [● Kostenlos — kein Account nötig]   (Puls-Dot animiert)
H1:   "Dein Google Business Profil — bewertet."
      ("— bewertet." in var(--green))
Sub:  "mapScor analysiert dein GBP mit KI und zeigt dir in 2 Minuten,
       was dich Kunden kostet — und wie du es fixst."
[Business-Name eingeben... | Gratis Audit starten →]
Note: "✓ Kein Account · ✓ Kostenlos · ✓ Ergebnis in 2 Min."
```
- CSS Grid-Pattern Hintergrund (linear-gradient 1px, mask-image radial-gradient)
- Grüner Radial-Glow hinter dem Formular (position:absolute, filter:blur(50px), pointer-events:none)
- Hero-Input scrollt zu `#audit-section` (KEIN separater Page-Link)
- Eingabe-Wert wird via JS in das eingebettete Form übertragen (`getElementById("abizName").value`)
- Scroll-Hint Arrow unten (CSS rotate(45deg), bounce animation)

### 3. Social Proof Bar
```
"Vertrauen von" | Valibelle Wien · Studio Brandt · Café Klement · ... | 1.2k+ Audits | 4.9★
```
- `background:var(--surface)`, `border-top/bottom: 1px solid var(--border)`
- Business-Namen: `opacity:.45`, hover → `.75`
- Stats rechts, `border-left: 1px solid var(--border)` als Trenner

### 4. How It Works
```
Links (klickbar):              Rechts (Preview-Card):
[01] Business eingeben    →    Screen 0: Name-Eingabe mit grünem Button
[02] 10 Fragen beantworten →   Screen 1: Frage mit Fortschrittsbalken + 3 Optionen
[03] Score erhalten       →    Screen 2: Result-Preview (Score-Circle + Balken)
```
- Auto-Rotate alle 3.2s via `setInterval`
- `onclick="setHow(i)"` setzt aktiven Step + Screen manuell
- Aktiver Step: grüne Nummer + grüner Step-Titel

### 5. Features Grid (3×3)
```
[Kostenlos] KI-Audit & Score     | [Kostenlos] Optimierungsvorschläge | [Kostenlos] Multi-Modell KI
[Pro]       Performance Dashboard | [Pro]       Local Rank Tracker      | [Pro]       Review Manager
[Pro]       Post Scheduler        | [Pro]       Competitor Analysis      | [Pro]       Weekly Reports
```
- Layout: `display:grid; grid-template-columns:repeat(3,1fr); gap:2px; background:var(--border)` → dezente Trennlinien
- Card hover: background heller + `::after` grüner Bottom-Border `scaleX(0→1)`
- Free-Tag: grün dim; Pro-Tag: amber dim

### 6. Live Demo
```
Links: Score-Circle 74/100 + 5 Kategorie-Balken (animiert beim Scroll)
Rechts: 4 Empfehlungs-Cards mit High/Medium/Low Styling
```
- Wrapper: `border-radius:24px`, Grid 1fr 1fr
- `IntersectionObserver` triggert Animation einmalig wenn sichtbar
- Score-Arc: `stroke-dashoffset` Animation, Score-Zahl zählt hoch
- Balken: `width:0% → N%` mit `transition:width 1.2s`

### 7. Eingebettetes Audit Form (`id="audit-section"`)
→ Vollständige Spezifikation im Abschnitt "Audit Flow" weiter unten
- Wichtig: Form ist EINGEBETTET in die Landing Page, kein separater Route-Wechsel
- Wrapper: `background:var(--card); border:1px solid var(--ba); border-radius:22px`

### 8. Warum mapScor
```
4 Cards: ⚡ 2-Minuten-Ergebnis | 🔑 BYOK | 🎯 Prioritäten | 🇦🇹 DACH-Markt
```
- Card hover: `::before` Top-Gradient-Line erscheint (grün → transparent)
- Vergleichstabelle darunter: 6 Features × 3 Spalten (Feature | mapScor | Andere)
- mapScor-Spalte in `var(--green)`

### 9. Testimonials
```
[Featured: Sabine B. — Score 48→71]  [Michael K.] [Thomas N. — Agentur]
```
- Featured-Card: `background:linear-gradient(135deg,var(--card),#0D1A14)`, grüner Border
- Sterne in `var(--green)`, `em` im Text ebenfalls grün
- Avatar: Kreis mit Initialen, `background:var(--gmid)`

### 10. Pricing
```
[Free €0] | [Pro €19/mo ← "Beliebt"-Badge] | [Agency €59/mo]
```
- Pro-Card: `border-color:rgba(0,229,160,.28)`, `::before` grüner Top-Line
- "Beliebt"-Badge: `position:absolute; top:18px; right:18px`, `background:var(--green)`
- Free/Agency: outline Button; Pro: solid grüner Button

### 11. FAQ (Accordion, 2-spaltig)
- `max-height:0 → 180px` transition für Answer
- `transform:rotate(45deg)` für Arrow wenn offen
- Immer nur eines offen (alle anderen schließen bei neuem Klick)

### 12. CTA Bottom
```
H2: "Bereit für deinen mapScor Score?"
P: "Kein Risiko. Kein Account. Kein Bullshit."
[Kostenlos starten →] [Preise ansehen]
```
- Grüner Radial-Glow im Hintergrund (identisch Hero-Glow)

### 13. Footer
```
[Logo + "AI Audit Tool für Google Business Profiles." + "Made with ♥ in Vienna 🇦🇹"]
Produkt | Firma | Legal
---
© 2025 mapScor. Alle Rechte vorbehalten. | Twitter · LinkedIn · Instagram
```
- `grid-template-columns: 2fr 1fr 1fr 1fr`
- Logo: height 26px
---

## Audit Flow — Detailspezifikation (Kein Google Places API nötig)

**Strategie: Self-Assessment Multi-Step Form**  
Kein API Key, keine Kosten. Der User gibt seine GBP-URL ein und beantwortet 
10 schnelle Fragen über sein Profil. Die KI analysiert diese Antworten und 
gibt einen fundierten Score + Empfehlungen zurück.

**Philosophie des Forms:**
- Fühlt sich an wie ein Persönlichkeitstest, nicht wie ein Formular
- Jede Frage hat Charakter — kurze, direkte Sprache, leichte Ironie
- Dezente Animationen: Slide-in (fadeUp), sanfte Übergänge, Score-Aufbau am Ende
- Fortschrittsbalken wächst mit jeder Antwort (Motivation, % angezeigt)
- **Back-Button vorhanden** — dezent, `visibility:hidden` auf Step 0, sichtbar ab Step 1
  - Löscht die Antwort des verlassenen Steps aus dem State
  - Stellt vorherige Auswahl visuell wieder her (`.selected` Klasse)
  - Implementierung via `visibility:hidden` (nicht `display:none`) — Layout bleibt stabil
- Auto-Advance nach 300ms nach Option-Wahl (kein expliziter "Weiter"-Button bei Multiple-Choice)
- Mobile-first: Alles per Tap bedienbar, Inputs nur wo unbedingt nötig

---

### Multi-Step Form — 10 Fragen

**Schritt 0: Einstieg (URL + Business Name)**
```
Headline: "Bereit für die Wahrheit?"
Sub: "Dein Google Business Profil wird gleich analysiert."

[GBP-URL eingeben — optional, für spätere Features]
[Business Name eingeben — Pflicht, für persönliche Ansprache]

CTA: "Los geht's →"
```
- URL ist optional in Phase 1 (wird für Phase 2 gespeichert)
- Business Name wird in allen weiteren Schritten verwendet ("Wie viele Fotos hat Valibelle?")

---

**Schritt 1: Vollständigkeit**
```
"Ist dein Profil vollständig ausgefüllt?"
[Name, Adresse, Telefon, Website, Beschreibung, Öffnungszeiten]

Optionen (große Tap-Cards):
● Ja, alles ausgefüllt         → score: 100
● Meistens — ein paar Lücken   → score: 60
● Eher nein, ziemlich leer     → score: 20
```

**Schritt 2: Beschreibung**
```
"Wie gut beschreibt deine Beschreibung dein Business?"

● Ausführlich & mit Keywords   → score: 100
● Kurz aber da                 → score: 55
● Was ist eine Beschreibung?   → score: 0
```

**Schritt 3: Fotos — Anzahl**
```
"Wie viele Fotos zeigt dein Profil der Welt?"

● 20 oder mehr 🤩              → score: 100
● 5–19 Fotos                   → score: 60
● Weniger als 5 😬             → score: 25
● Keine einzige                → score: 0
```

**Schritt 4: Fotos — Qualität**
```
"Hast du ein Logo-Foto und ein Cover-Bild gesetzt?"

● Beides vorhanden ✓           → score: 100
● Eines davon                  → score: 50
● Keins von beidem             → score: 0
```

**Schritt 5: Bewertungen — Anzahl & Rating**
```
"Wie sieht's bei den Bewertungen aus?"

● 4.5★+ und mehr als 20        → score: 100
● 4.0–4.4★ oder unter 20       → score: 65
● Unter 4.0★ oder unter 5      → score: 30
● Keine Bewertungen            → score: 0
```

**Schritt 6: Auf Reviews antworten**
```
"Antwortest du auf Kundenbewertungen?"

● Auf fast alle                → score: 100
● Manchmal                     → score: 50
● Nie — wer macht das schon?   → score: 0
```

**Schritt 7: Posts & Aktivität**
```
"Wann hast du zuletzt einen Post veröffentlicht?"

● Diese Woche                  → score: 100
● Letzten Monat                → score: 60
● Vor mehr als 3 Monaten       → score: 20
● Ich poste nie                → score: 0
```

**Schritt 8: Kategorien**
```
"Hast du die richtigen Hauptkategorie + Nebenkategorien gewählt?"

● Ja, passt perfekt            → score: 100
● Hauptkategorie ja, Rest nein → score: 60
● Bin mir ehrlich nicht sicher → score: 30
```

**Schritt 9: Q&A / Sonderfunktionen**
```
"Nutzt du Google's Sonderfunktionen? (Q&A, Menü, Produkte, Attribute)"

● Ja, aktiv genutzt            → score: 100
● Ein bisschen                 → score: 50
● Hab ich noch nie angeschaut  → score: 10
```

**Schritt 10: KI-Modell wählen**
```
"Fast fertig! Welche KI soll dein Profil analysieren?"

[Groq Llama 3.3 — Kostenlos]   ← Default, empfohlen
[Gemini Flash — Kostenlos]
[Eigener API Key → Dropdown: GPT-4o / Claude / Gemini Pro]

Kleiner Text: "Dein Key wird nur für diese Analyse verwendet und nicht gespeichert."

CTA: "Jetzt analysieren ✨"
```

---

### Schritt 11: Loading / Analyse-Animation

**Dauer:** 3–5 Sekunden (künstliche Spannung + echter AI Call)

```
Animated sequence:
  "Valibelle wird analysiert..."
  [Fortschrittsbalken füllt sich langsam]
  
  Sequentielle Checkmarks (je 0.4s Delay):
  ✓ Profildaten verarbeitet
  ✓ Vollständigkeit bewertet
  ✓ Foto-Strategie analysiert  
  ✓ Review-Profil ausgewertet
  ✓ Aktivitätsmuster erkannt
  ⟳ KI generiert Empfehlungen...
  
  Score-Countdown-Animation: 0 → 74 (zählt hoch, stoppt dramatisch)
```

**Ton:** Nicht "lädt..." sondern "Wir schauen gerade hinter die Kulissen von Valibelle"

---

### Schritt 12: Result Page

**URL:** `/audit/[nanoid]`  
**Gespeichert:** Im Vercel KV (kostenlos, 30 Tage TTL) — kein Supabase nötig in Phase 1

```
┌─────────────────────────────────────────┐
│  Valibelle               mapScor Score  │
│  Handgemachte Kunst · Wien              │
│                          ┌──────────┐  │
│                          │   74     │  │
│                          │  /100    │  │
│                          └──────────┘  │
│  "Gut — aber da ist noch Luft nach oben"│
├─────────────────────────────────────────┤
│  Vollständigkeit    ████████░░  88      │
│  Fotos & Medien     █████░░░░░  61      │
│  Reviews & Antworten████████░░  84      │
│  Posts & Aktivität  ██░░░░░░░░  28 ⚠   │
│  Profil-Features    █████░░░░░  55      │
├─────────────────────────────────────────┤
│  3 Dinge, die sofort helfen würden:     │
│                                         │
│  🔴 HIGH  Keine Posts seit Monaten      │
│     "Google sieht dich als inaktiv..."  │
│                                         │
│  🟡 MED   Nur 8 Fotos — Ziel: 20+       │
│     "Mehr Fotos = mehr Vertrauen..."    │
│                                         │
│  🟡 MED   Review-Antworten fehlen       │
│     "47% der Nutzer lesen Antworten..." │
│                                         │
│  [+ 4 weitere Empfehlungen → Pro]       │
├─────────────────────────────────────────┤
│  [📤 Score teilen]  [🔁 Neu scannen]    │
│  [📊 Mehr sehen → mapScor Pro]         │
└─────────────────────────────────────────┘
```

**Score-Beschriftungen:**
```
90–100: "Vorbildlich. Fast perfekt."
75–89:  "Gut — aber da ist noch Luft nach oben."
60–74:  "Solide Basis, klarer Verbesserungsbedarf."
40–59:  "Ausbaufähig. Deine Konkurrenz schläft nicht."
0–39:   "Houston, wir haben ein Problem. 🚨"
```

**Upgrade-Teaser (im Result):**
- Free zeigt 3 Empfehlungen
- "+4 weitere Empfehlungen freischalten" → Modal → Pro CTA
- Score wird IMMER vollständig gezeigt (kein Paywall auf Score selbst)

---

## API Spezifikation

### Kein `/api/places` in Phase 1
Google Places API wird in Phase 1 nicht verwendet — €0 Kosten.
Der Self-Assessment Fragebogen ersetzt den automatischen Datenabruf vollständig.
Phase 2 Pro bringt automatisches Fetching für zahlende User.

### `/api/audit` — AI Analyse (Self-Assessment Input)
```typescript
// POST /api/audit
// Body: { assessment: AssessmentAnswers, businessName: string, model: ModelChoice, apiKey?: string }
// Response: ReadableStream (Server-Sent Events)

interface AssessmentAnswers {
  completeness: number      // 0–100 (aus Fragebogen-Antwort)
  description: number
  photoCount: number
  photoQuality: number
  reviewScore: number
  reviewResponse: number
  postActivity: number
  categories: number
  specialFeatures: number
}

// Streaming Format:
// event: progress  → { step: string, message: string }
// event: result    → { scores: ScoreBreakdown, suggestions: Suggestion[], totalScore: number }

// Streaming Format:
// event: progress
// data: { step: 'analyzing_completeness', message: 'Vollständigkeit wird geprüft...' }

// event: result  
// data: { scores: ScoreBreakdown, suggestions: Suggestion[], totalScore: number }
```

**AI Prompt Template:**
```typescript
const buildAuditPrompt = (businessName: string, answers: AssessmentAnswers) => `
Du bist ein Google Business Profile SEO-Experte mit 10+ Jahren Erfahrung.

Business: "${businessName}"
Self-Assessment-Scores (0–100 basierend auf User-Angaben):
- Profilvollständigkeit: ${answers.completeness}
- Beschreibungsqualität: ${answers.description}
- Foto-Anzahl: ${answers.photoCount}
- Foto-Qualität (Logo/Cover): ${answers.photoQuality}
- Bewertungs-Score: ${answers.reviewScore}
- Review-Antwortrate: ${answers.reviewResponse}
- Post-Aktivität: ${answers.postActivity}
- Kategorien-Optimierung: ${answers.categories}
- Nutzung Sonderfunktionen: ${answers.specialFeatures}

Basierend auf diesen Werten:
1. Berechne den Gesamt-Score (gewichtet: Vollständigkeit 25%, Fotos 20%, Reviews 20%, Aktivität 15%, Keywords 10%, Öffnungszeiten 5%, Features 5%)
2. Erstelle 7 konkrete, handlungsorientierte Empfehlungen auf Deutsch
3. Priorisiere nach Business Impact (was bringt am schnellsten Google-Ranking-Verbesserung?)
4. Sei direkt, spezifisch und motivierend — nicht generisch

Antworte NUR in diesem JSON-Format, kein weiterer Text:
{
  "totalScore": <Zahl 0-100>,
  "scores": {
    "completeness": <Zahl>, "photos": <Zahl>, "reviews": <Zahl>,
    "activity": <Zahl>, "keywords": <Zahl>, "hours": <Zahl>, "qa": <Zahl>
  },
  "suggestions": [
    {
      "title": "<max 60 Zeichen>",
      "description": "<2-3 konkrete Sätze mit Handlungsanweisung>",
      "impact": "high" | "medium" | "low"
    }
  ]
}`
```

**Modell-Routing:**
```typescript
async function getAIClient(model: ModelChoice, apiKey?: string) {
  switch(model) {
    case 'groq-llama':
      // Groq API Key aus ENV (mapScor zahlt, kostenlos)
      return new Groq({ apiKey: process.env.GROQ_API_KEY })
    
    case 'gemini-flash':
      // Google AI aus ENV (kostenlos Tier)
      return new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)
    
    case 'openai-gpt4o-mini':
    case 'anthropic-haiku':
    case 'anthropic-sonnet':
      // BYOK — User stellt Key bereit
      if (!apiKey) throw new Error('API Key required for this model')
      // Key wird serverseitig genutzt, nie persistiert
      return createClientForModel(model, apiKey)
  }
}
```

### Rate Limiting
```typescript
// /api/audit Rate Limiting
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '24h'), // 5 Audits pro IP pro Tag
  analytics: true,
})

// Fehler-Response bei Überschreitung:
// { error: 'Limit erreicht. Versuche es morgen erneut, oder erstelle einen Account für mehr Audits.' }
```

---

## Score-Berechnung (Client-Side, nach AI Response)

```typescript
const WEIGHTS = {
  completeness: 0.25,
  photos:       0.20,
  reviews:      0.20,
  activity:     0.15,
  keywords:     0.10,
  hours:        0.05,
  qa:           0.05,
}

function calculateTotalScore(scores: ScoreBreakdown): number {
  return Math.round(
    Object.entries(WEIGHTS).reduce((total, [key, weight]) => {
      return total + (scores[key as keyof ScoreBreakdown] * weight)
    }, 0)
  )
}

function getScoreColor(score: number): string {
  if (score >= 75) return '#00E5A0' // green
  if (score >= 50) return '#F5A623' // amber
  return '#FF4B6E' // red
}
```

---

## OG Image / Share Card

```typescript
// /api/og/[auditId]/route.tsx
// Verwendet @vercel/og für Edge Image Generation (kostenlos)

// Karte zeigt:
// - mapScor Logo
// - Business Name
// - Score Circle (groß, farbcodiert)
// - "Analysiert von mapScor"
// - 4 Kategorien-Scores (klein)
// Größe: 1200x630px (Standard OG)
```

---

## Error States

| Fehler | User-Meldung (DE) | Recovery |
|--------|------------------|---------|
| URL nicht erkannt | "Diese URL sieht nicht nach einem Google Business Profil aus." | URL-Hilfe anzeigen |
| Place nicht gefunden | "Profil nicht gefunden. Ist die URL öffentlich zugänglich?" | Erneut versuchen |
| Google API Limit | "Kurze Pause nötig — bitte in 1 Minute erneut versuchen." | Auto-retry nach 60s |
| AI Error | "Die KI-Analyse ist fehlgeschlagen. Wähle ein anderes Modell." | Model-Selector öffnen |
| Rate Limit | "Tageslimit erreicht (5 Audits). Morgen wieder oder Account erstellen." | Sign-up CTA |
| Kein API Key | "Für dieses Modell ist ein API Key erforderlich." | Key-Input fokussieren |
| Netzwerk-Fehler | "Verbindungsproblem — bitte prüfe deine Internetverbindung." | Erneut versuchen |

---

## Accessibility & SEO

### Accessibility
- Alle interaktiven Elemente: Keyboard-navigierbar
- Score Circle: `aria-label="mapScor Score: 74 von 100"`
- Farbinfos immer mit Text ergänzt (nicht nur Farbe)
- Loading States: `aria-live="polite"`
- Focus-Ring: grün, 2px, deutlich sichtbar

### SEO (next/metadata)
```typescript
export const metadata = {
  title: 'mapScor — AI Audit Tool für Google Business Profiles',
  description: 'Analysiere dein Google Business Profil kostenlos. KI-gestützter Score, priorisierte Optimierungsvorschläge. Kein Account nötig.',
  openGraph: {
    title: 'mapScor — Dein GBP-Score in 30 Sekunden',
    // ...
  },
  alternates: {
    canonical: 'https://mapscor.io'
  }
}
```

### Structured Data
```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "mapScor",
  "description": "AI Audit Tool für Google Business Profiles",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "EUR"
  }
}
```

---

## Deployment Checklist (Vercel)

```bash
# Environment Variables in Vercel setzen:
GOOGLE_PLACES_API_KEY=
GROQ_API_KEY=
GOOGLE_AI_API_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# next.config.ts
const nextConfig = {
  images: {
    domains: ['maps.googleapis.com', 'lh3.googleusercontent.com'],
    formats: ['image/webp'],
  },
  headers: async () => [{
    source: '/(.*)',
    headers: [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=()' },
    ]
  }]
}
```

---

## Definition of Done (Phase 1)

- [ ] Landing Page lädt in < 2.5s (Lighthouse Performance > 88)
- [ ] Alle 13 Sektionen implementiert und responsive (375px–1440px)
- [ ] Logo korrekt eingebunden (Nav + Footer)
- [ ] Space Grotesk Font korrekt geladen
- [ ] How It Works: Auto-Rotate + manueller Klick funktioniert
- [ ] Live Demo: Score-Animation triggert beim Scroll
- [ ] Audit Form eingebettet in Landing Page (kein separater Route-Wechsel)
- [ ] Multi-Step Form: 10 Fragen + Back-Button + Auto-Advance
- [ ] Back-Button: versteckt auf Step 0, sichtbar auf Steps 1–10
- [ ] Back-Button: stellt vorherige Auswahl korrekt wieder her
- [ ] Audit Flow funktioniert End-to-End mit Groq (kostenlos)
- [ ] BYOK für GPT-4o Mini/Claude Haiku funktioniert
- [ ] Score wird korrekt berechnet und visualisiert
- [ ] Loading-Animation: Checkmarks sequenziell + Score-Countdown
- [ ] 3 freie Empfehlungen sichtbar, weitere hinter Paywall-Teaser
- [ ] Rate Limiting aktiv (5 Audits/IP/Tag via Upstash)
- [ ] Mobile auf 375px: alles nutzbar, kein Overflow
- [ ] Kein Google Places API Key nötig (Self-Assessment Ansatz)
- [ ] Keine API Keys in Logs oder Client-State
- [ ] FAQ Accordion funktioniert
- [ ] Pricing: 3 Tiers, Pro-Badge, Buttons scrollen zu Audit
- [ ] DSGVO: Datenschutzerklärung + Impressum vorhanden (Wien)
- [ ] Vercel Deployment stabil, automatische Deploys via Git
