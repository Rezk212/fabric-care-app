# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

<!-- Assumption: one Expo app (iOS + Android) sharing a single design language, plus a Next.js site. Recorded as stated in the brief; confirm. -->

## Stack
Monorepo (npm workspaces): Expo (React Native, Expo Router) for the app, Next.js for the website, a shared TypeScript package for tokens, i18n and care logic. Supabase for accounts, database and image storage. Claude vision (via a server-side proxy) for image analysis. Stated by the user.

## Users
People who do laundry at home and are unsure how to treat a garment: which wash program, temperature, drying and ironing, and which products to buy. Arabic- and English-speaking, starting with Oman.

## Product Purpose
The user uploads a photo of a garment or its care label, and a photo or model number of their washing machine. The app identifies fabric and machine, recommends the best wash program for that machine, recommends care products, and shows where to buy them nearby (country, city, location).

## Positioning
Recommendations tied to the user's own machine and local shops, not generic laundry tips.

## Operating Context
Used on a phone, at the laundry or in a shop. Photos of care labels and machine panels. Bilingual Arabic (RTL) and English (LTR).

## Capabilities and Constraints
- Inputs: garment photo, care-label photo, machine photo, machine model number (typed).
- Output: fabric identification, wash program for the user's machine, drying/ironing guidance, product picks, nearest stores.
- Country, city and location are user-selected; nearest-store ranking uses distance.
- Store and product data is sample data until a real source exists. It must be clearly labelled as sample.
- Languages: Arabic and English, full RTL support.
- Undecided: final name and visual identity (proposed, changeable), real store data source, pricing.

## Brand Commitments
Modern, fluid, professional design and execution (stated). Name and identity are a proposal and may change.

## Evidence on Hand
None. No real store list, product catalogue, testimonials or machine database exist yet; do not fabricate them.

## Product Principles
- Recommend for the user's machine and place, never generically.
- Show confidence and uncertainty; never present an AI guess as certain.
- Arabic and English are equal first-class experiences.
- Sample data is always labelled as sample.
