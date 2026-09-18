# Flexible GA request — prototype

A clickable front-end prototype of a "buy GA for any of these dates" flow for
multi-date tours. Built as the Part 2 build spec for a Senior Product Manager
II application (Powered by TodayTix).

Fictional artist, fictional tour, no real ticketing brand. No backend, no
payments, no accounts — everything lives in memory for the session.

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
  banner and one-tap confirm) → confirmation showing exactly one ticket set.
- **Organiser settings** (`/organiser`): toggle flexible mode, choose which
  dates are pooled, lock to a single price tier, set the quantity cap.
  Changes here immediately change what the buyer setup screen offers.
- **Prototype controls**: a dev panel pinned to the bottom of the buyer
  flow to simulate a favourite or second-choice date selling out mid-queue,
  speed up the queue, and reset state.

## Out of scope

Payments, accounts, real inventory, bot detection, refunds, presale codes —
per the build spec.
