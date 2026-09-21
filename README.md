# AXS — Flexible GA request (internal prototype)

A clickable front-end prototype of a "buy GA for any of these dates" flow for
multi-date tours, styled as an AXS product prototype.

Fictional artist and tour (so it's safe to demo without a real on-sale in
play). Branding, colours and layout are intentionally AXS's own. No backend,
no real payments, no accounts, no real inventory — everything lives in
memory for the session, and the payment screen is a fake checkout that never
sends card details anywhere.

## Stack

React + Vite + TypeScript, Tailwind CSS, React Router (hash routing).

## Run it

```bash
npm install
npm run dev
```

Open the local URL Vite prints (defaults to http://localhost:5173).

## What's here

- **Buyer flow** (`/`): event page → flexible setup (tick dates, star a
  favourite, pick quantity) → single simulated queue → held offer on the
  favourite (or the next available date, with an explicit city-change
  banner, back/forward navigation between offers, and one-tap confirm) →
  fake payment/checkout screen → confirmation showing exactly one ticket
  set as an e-ticket stub.
- **Organiser settings** (`/organiser`): toggle flexible mode, choose which
  dates are pooled, lock to a single price tier, set the quantity cap.
  Changes here immediately change what the buyer setup screen offers.
- **Prototype controls**: a dev panel pinned to the bottom of the buyer
  flow to simulate a favourite or second-choice date selling out mid-queue,
  speed up the queue, and reset state.

## Out of scope

Payments, accounts, real inventory, bot detection, refunds, presale codes —
per the build spec.
