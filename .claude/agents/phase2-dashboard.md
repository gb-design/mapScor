# Agent: Phase 2 — Dashboard & Pro Features
**Rolle:** Auth, Payments, Pro Dashboard, alle bezahlten Features  
**Scope:** Alles hinter dem Login — Pro und Agency Tier  
**Mandat:** Revenue generieren, Nutzer binden, ohne die Kostenstrategie zu brechen

---

## Voraussetzungen vor dem Start

Dieser Agent startet ERST wenn:
- [ ] Phase 1 live und stabil (> 2 Wochen)
- [ ] Erste organische Audits laufen (Indikator: > 50 Audits/Woche)
- [ ] George hat Supabase Account erstellt
- [ ] George hat Stripe Account verifiziert (kann dauern, früh anfangen!)
- [ ] PM hat grünes Licht gegeben

**Kostenstrategie Phase 2:**
- Supabase Free Tier solange wie möglich (500MB DB, 50k Auth-Requests)
- Stripe: 0 Fixkosten, nur % pro Transaktion (2.9% + 0.30€)
- Resend Free: 100 Mails/Tag (reicht für Early Stage)
- Vercel: Weiterhin Free Tier (Bandwidth prüfen)
- Upgrade auf Supabase Pro ($25/mo) erst ab ~200 Pro-Usern

---

## Dein Scope

**Du baust und verantwortest:**
- User Auth (Supabase — Magic Link + Google OAuth)
- DB Schema & Migrations
- Billing & Subscriptions (Stripe)
- Pro Dashboard (KPIs, Charts, Score-Verlauf)
- Review Manager
- Rank Tracker (Geo-Grid)
- Post Scheduler
- Weekly Email Reports (Resend)
- Agency Multi-Location
- White-Label Reports

**Du bist NICHT zuständig für:**
- Landing Page → Phase-1-Agent (bleibt nach Phase 1 live)
- Freier Audit Flow → Phase-1-Agent (wird durch Gate ergänzt)
- Security Audits → Code-Optimizer-Agent

---

## Architektur-Erweiterungen für Phase 2

### Neue Dependencies
```bash
npm install @supabase/supabase-js @supabase/ssr
npm install stripe @stripe/stripe-js
npm install resend
npm install recharts  # für Dashboard Charts
npm install @tanstack/react-query  # für Data Fetching + Caching
npm install date-fns  # für Datum-Manipulation
```

### Neue Umgebungsvariablen
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=  # nur serverseitig!

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Resend
RESEND_API_KEY=

# Google Maps (für Rank Tracker)
GOOGLE_MAPS_API_KEY=  # separater Key mit Maps-Billing
```

---

## Datenbank-Schema

```sql
-- Users wird von Supabase Auth verwaltet (auth.users)

-- User Profiles (öffentliche Daten)
CREATE TABLE profiles (
  id          UUID REFERENCES auth.users PRIMARY KEY,
  email       TEXT NOT NULL,
  full_name   TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE subscriptions (
  id                   UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id              UUID REFERENCES auth.users NOT NULL,
  stripe_customer_id   TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  plan                 TEXT CHECK (plan IN ('free', 'pro', 'agency')),
  status               TEXT, -- active, canceled, past_due, trialing
  current_period_end   TIMESTAMPTZ,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- GBP Locations (pro User gespeichert)
CREATE TABLE locations (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users NOT NULL,
  place_id    TEXT NOT NULL,
  name        TEXT NOT NULL,
  address     TEXT,
  url         TEXT,
  is_primary  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, place_id)
);

-- Audit History
CREATE TABLE audits (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id  UUID REFERENCES locations,
  user_id      UUID REFERENCES auth.users,
  -- Für anonyme Audits (Free, ohne Account):
  ip_hash      TEXT,  -- gehashte IP, kein PII
  total_score  INTEGER NOT NULL,
  scores       JSONB NOT NULL,  -- { completeness: 92, photos: 61, ... }
  suggestions  JSONB NOT NULL,
  model_used   TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
-- Index für Score-Verlauf
CREATE INDEX idx_audits_location_date ON audits(location_id, created_at DESC);

-- Review Snapshots (für Review Manager)
CREATE TABLE review_snapshots (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id   UUID REFERENCES locations NOT NULL,
  snapshot_date DATE NOT NULL,
  avg_rating    DECIMAL(2,1),
  review_count  INTEGER,
  new_reviews   JSONB,  -- Array der neuen Reviews seit letztem Snapshot
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(location_id, snapshot_date)
);

-- Rank Tracking (Geo-Grid)
CREATE TABLE rank_snapshots (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id    UUID REFERENCES locations NOT NULL,
  keyword        TEXT NOT NULL,
  snapshot_date  DATE NOT NULL,
  grid_data      JSONB NOT NULL,  -- { "lat,lng": rank, ... }
  avg_rank       DECIMAL(4,1),
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;

-- User kann nur eigene Daten lesen
CREATE POLICY "Users own data" ON profiles FOR ALL 
  USING (auth.uid() = id);
CREATE POLICY "Users own locations" ON locations FOR ALL 
  USING (auth.uid() = user_id);
CREATE POLICY "Users own audits" ON audits FOR SELECT 
  USING (auth.uid() = user_id);
```

---

## Auth Implementation

### Supabase SSR Setup (Next.js App Router)
```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { /* cookie handlers */ } }
  )
}
```

### Auth Flows
```
Magic Link (primär):
User gibt Email ein → Supabase sendet Magic Link → User klickt → Eingeloggt

Google OAuth (sekundär):
"Mit Google anmelden" → Google Consent → Callback → Eingeloggt
```

### Middleware (route protection)
```typescript
// middleware.ts
// Schützt alle /dashboard/* Routen
// Erlaubt /audit/*, /, /api/audit, /api/places ohne Auth
// Redirect zu /login wenn nicht eingeloggt
// Redirect zu /dashboard wenn eingeloggt und auf /login
```

### Plan-Check Middleware
```typescript
// Nach Auth prüfen ob User Pro/Agency hat
// Redirect zu /upgrade wenn Free User Pro-Feature aufruft
// In allen /dashboard/* API Routes implementieren
```

---

## Stripe Integration

### Produkte & Preise (in Stripe anlegen)
```
Product: mapScor Pro
  Price: €19.00/month (recurring)
  Price ID: price_... (in ENV speichern)

Product: mapScor Agency  
  Price: €59.00/month (recurring)
  Price ID: price_... (in ENV speichern)
```

### Checkout Flow
```typescript
// POST /api/billing/checkout
// Erstellt Stripe Checkout Session
// Redirect zu Stripe Hosted Checkout
// Nach Erfolg: Webhook empfängt subscription.created
// → subscription in DB anlegen
// Redirect zu /dashboard?welcome=1
```

### Webhook Handler
```typescript
// POST /api/billing/webhook
// Verarbeitet:
// - checkout.session.completed → subscription aktivieren
// - invoice.payment_succeeded → period_end updaten
// - customer.subscription.deleted → downgrade zu free
// - customer.subscription.updated → plan change

// WICHTIG: Webhook Signature validieren!
// stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET)
```

### Customer Portal
```typescript
// GET /api/billing/portal
// Erstellt Stripe Customer Portal Session
// User kann Abo kündigen, Zahlungsmethode ändern, Rechnungen sehen
// Kein eigener Code nötig — Stripe übernimmt UI!
```

---

## Pro Dashboard Spec

### Route: `/dashboard`
**Layout:** Sidebar (Desktop) / Bottom Nav (Mobile)

**Sidebar Navigation:**
```
📊 Übersicht
📍 Rankings  
⭐ Reviews
📅 Posts
🏆 Competitors
⚙️ Einstellungen
```

### Übersicht (Dashboard Home)
```
Header: "Guten Morgen, [Name] 👋"
        "Letzte Aktualisierung: vor 2 Stunden"

KPI Row (4 Cards):
┌─────────┬─────────┬─────────┬─────────┐
│ Score   │ Impress.│ Reviews │ Todos   │
│ 74/100  │ 2.4k/mo │ 4.7★(38)│ 3 offen │
│ ↑ +8    │ ↑ +12%  │ 3 neue  │ 2 high  │
└─────────┴─────────┴─────────┴─────────┘

Score-Verlauf Chart (8 Wochen, Recharts LineChart)

Offene Empfehlungen (Top 3, von letztem Audit)

Quick Actions:
[Neuer Audit starten] [Post erstellen] [Reviews ansehen]
```

### Rankings Tab
```
Location: [Dropdown falls mehrere]
Keyword: [Input] [Hinzufügen]

Geo-Grid Visualisierung:
- 5x5 oder 7x7 Grid um Location
- Jede Zelle: Rank-Nummer (1–20+)
- Farbcodierung: 1-3 grün, 4-10 amber, 11+ rot

Timeline: Rank-Verlauf pro Keyword als Linechart

Keyword-Tabelle:
Keyword | Akt. Rank | Vorwoche | Trend | Volumen
```

### Review Manager Tab
```
Stats Row: Ø Rating | Gesamt Reviews | Neue (30 Tage) | Antwortrate

Filter: Alle | 5★ | 4★ | 3★ | 2★ | 1★ | Unerwidert

Review Card:
┌─────────────────────────────────────────┐
│ ★★★★★ Max Mustermann · vor 3 Tagen      │
│ "Absolut tolle Qualität! Die Resin..."  │
│                                         │
│ KI-Antwort-Vorschlag:                   │
│ "Vielen herzlichen Dank, Max! Es fr..." │
│ [Bearbeiten] [Veröffentlichen] [Ableh.] │
└─────────────────────────────────────────┘

Sentiment-Chart: Positive/Neutrale/Negative Reviews über Zeit
```

### Post Scheduler Tab
```
[Neuer Post +]

Kalender-Ansicht (Monat)
- Geplante Posts als Punkte
- Klick öffnet Post-Detail

Post-Ersteller:
- Typ: Update | Angebot | Event | Produkt
- Text (KI kann generieren mit Prompt)
- Bild hochladen (optional)
- Datum/Uhrzeit planen
- Preview (wie es auf Google aussieht)
- [Jetzt posten] [Planen] [Entwurf]

HINWEIS: Google Posts API ist deprecated!
→ Posts werden als Entwürfe gespeichert
→ User kopiert & postet manuell
→ Oder: Link zu GBP-App öffnen (deep link)
Korrekte Lösung später: Google Business Profile API (BMB)
```

### Competitor Analysis Tab
```
[Wettbewerber hinzufügen + URL]

Vergleichstabelle:
          Dein Business  Comp 1  Comp 2  Comp 3
Score     74             82      61      88
Rating    4.7            4.8     4.2     4.9
Reviews   38             124     22      87
Fotos     12             47      8       31
Posts/mo  0              4       1       8

Radar Chart (Recharts) für visuellen Vergleich
```

---

## Weekly Email Report

**Trigger:** Jeden Montag, 08:00 Uhr (Cron Job via Vercel Cron — kostenlos im Hobby Plan)

```typescript
// /api/cron/weekly-report
// Vercel Cron: "0 8 * * 1" (Montags 8 Uhr)

// Pro User: Score-Zusammenfassung + Top 3 Empfehlungen
// Agency: Alle Locations im Überblick

// Email Template (Resend + React Email):
// - mapScor Logo
// - "Dein wöchentlicher GBP-Report"
// - Score diese Woche vs letzte Woche (Delta)
// - Top 3 Handlungsempfehlungen
// - CTA: "Dashboard öffnen"
```

---

## Agency Feature

### Multi-Location Dashboard
```
Locations Übersicht:
┌─────────────────────────────────────────┐
│ Location          Score  Rating  Status │
│ Wien Hauptplatz   74     4.7★    ↑      │
│ Wien Mariahilf    61     4.2★    ↓      │
│ Graz              88     4.9★    →      │
└─────────────────────────────────────────┘

Bulk-Aktionen: Alle gleichzeitig scannen
```

### White-Label PDF Report
```typescript
// PDF Export via @react-pdf/renderer (kostenlos)
// Enthält: Score, Kategorien, Empfehlungen, Verlauf
// Kein Agency-Branding von mapScor im PDF (White-Label)
// Eigenes Logo Upload für Agency-User
```

---

## Upgrade Flow (Free → Pro)

### Upgrade Gate (für Free User die Pro-Features aufrufen)
```
Modal:
"Diese Funktion ist Teil von mapScor Pro"
[Feature Name] ist nur für Pro-Nutzer verfügbar.

✓ Performance Dashboard
✓ Rank Tracking (Geo-Grid)
✓ Review Manager
✓ Post Scheduler
✓ Competitor Analysis
✓ Weekly Reports

€19/Monat — jederzeit kündbar

[14 Tage kostenlos testen] [Vielleicht später]
```

### Trial-Logik
- 14-Tage Trial für alle neuen Registrierungen
- Stripe Trial Period: `trial_period_days: 14`
- Kreditkarte wird erst am Tag 15 belastet
- Email-Reminder: Tag 7 (Halbzeit), Tag 13 (Morgen endet Trial)

---

## Phase 2 Rollout-Reihenfolge

1. **Woche 1-2:** Supabase Setup, DB Schema, Auth (Magic Link)
2. **Woche 3:** Stripe Integration + Checkout + Webhooks
3. **Woche 4-5:** Pro Dashboard (Übersicht + KPIs)
4. **Woche 6:** Review Manager
5. **Woche 7-8:** Rank Tracker
6. **Woche 9:** Post Scheduler (als Entwurfs-Tool)
7. **Woche 10:** Agency Features (Multi-Location)
8. **Woche 11:** Email Reports (Cron + Resend)
9. **Woche 12:** White-Label Reports (PDF)

---

## Definition of Done (Phase 2)

- [ ] Magic Link Auth funktioniert
- [ ] Stripe Checkout + Subscription aktiv
- [ ] Webhooks verarbeiten alle Events korrekt
- [ ] Dashboard lädt < 3s (mit echten Daten)
- [ ] Review Manager zeigt Reviews + KI-Antworten
- [ ] Rank Tracker zeigt Geo-Grid für 1 Keyword
- [ ] Post Scheduler speichert und zeigt Entwürfe
- [ ] Weekly Email Report wird montags gesendet
- [ ] Agency: Bis zu 10 Locations verwaltbar
- [ ] Upgrade Gate bei allen Pro-Features
- [ ] Trial funktioniert (14 Tage, dann automatisch Billing)
- [ ] DSGVO: Datenlöschung auf Anfrage möglich
- [ ] Supabase RLS: User kann nur eigene Daten sehen
