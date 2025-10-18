# YouRank CRM

## Project Description
YouRank.ai is a modular SEO analytics platform built with Next.js 15, TypeScript, and Supabase.
It integrates with the DataForSEO API to provide professional SEO tools for keyword research, SERP analysis, domain analytics, backlink tracking, and on-page audits — all accessible under one dashboard.

The backend uses Supabase (PostgreSQL + Auth) for authentication, data storage, and credit-based billing.
Each analysis request creates an entry in the analyses table with a task status (pending, processing, completed).
The frontend is built using ShadCN UI, Tailwind CSS, and Recharts for data visualization.

The application architecture follows a modular design defined in modules.config.ts, allowing easy expansion with new APIs such as Content Generation, Merchant Data, and AI-powered SEO Insights (via OpenAI).

The UI layout is inspired by SEMrush — featuring a sidebar navigation for modules and tab-based sections inside each tool (e.g., Overview, Research, Competition, Trends, Audience).

Planned integrations include Google Analytics, Google Search Console, and OpenAI for automated SEO recommendations and content optimization.

## Product Requirements Document
1. Introduction

1.1. Project Overview
YouRank.ai is a modular SEO analytics platform designed for digital marketing agencies, SEO professionals, and tech-driven businesses. Built with Next.js 15, TypeScript, and Supabase, it provides professional SEO tools for keyword research, SERP analysis, domain analytics, backlink tracking, and on-page audits – all accessible under one dashboard. The platform integrates with the DataForSEO API for comprehensive data, while leveraging Supabase (PostgreSQL + Auth) for secure authentication, data storage, and a flexible credit-based billing system. The frontend utilizes ShadCN UI, Tailwind CSS, and Recharts for a clean, modern, and data-rich user experience, inspired by SEMrush but with a focus on refinement and simplification. Its modular architecture ensures easy expansion with future integrations like Google Analytics, Google Search Console, OpenAI for AI-powered insights, and other specialized data APIs.

1.2. Vision & Mission
Our vision is to empower SEO professionals and agencies with a modular, privacy-first, and AI-ready platform that combines DataForSEO's accuracy with a SEMrush-level user experience - at a fraction of the cost. YouRank.ai aims to be the go-to solution for reliable, scalable, and GDPR-compliant SEO data analytics, providing actionable insights through a streamlined, transparent, and intelligent interface.

1.3. Target Audience & Value Proposition
Target Audience:
The primary target audience consists of digital marketing agencies, SEO professionals, and tech-driven businesses that need reliable, scalable, and privacy-compliant SEO data solutions.

Pain Points YouRank.ai Solves:
*   High subscription costs: Existing tools often have expensive monthly fees that don't scale well for small agencies or freelancers.
*   Limited customization: Users often can't tailor dashboards, data views, or workflows to specific client needs.
*   Opaque data sources: Many platforms hide their data origins and use proprietary metrics that can't be verified.
*   Slow data refresh rates: Delays in keyword, backlink, and SERP updates reduce actionable insights.
*   Data privacy and compliance concerns: Most tools host data outside the EU, creating GDPR and compliance issues.
*   Lack of AI-driven insights: Existing tools provide raw data but few intelligent, context-aware recommendations.
*   Overwhelming interfaces: Non-technical users struggle with bloated UIs and unnecessary complexity.

YouRank.ai's Unique Value Proposition:
*   Modular design: Users can activate only the tools they need (e.g., Keywords, SERP, Domain), making it lightweight and efficient.
*   Transparent data: All metrics are sourced directly from DataForSEO APIs, ensuring verifiable accuracy.
*   GDPR-compliant architecture: Hosted in the EU using Supabase (Frankfurt region) for full data sovereignty.
*   Flexible credit system: Pay only for what you analyze, ideal for freelancers and agencies of all sizes.
*   AI-enhanced recommendations: Future integration with OpenAI will generate actionable SEO insights, keyword clustering, and content suggestions.
*   User-friendly interface: Inspired by SEMrush but simplified with a clear tab structure (Overview, Research, Competition, Trends, etc.).
*   White-label ready: Agencies can brand the dashboard for clients with custom domains and themes.

2. Goals & Objectives

2.1. Overall Project Goals
*   Establish a stable, performant, and scalable modular SEO analytics platform.
*   Provide accurate and transparent SEO data from DataForSEO.
*   Offer a flexible credit-based billing model.
*   Ensure GDPR compliance with EU-based hosting.
*   Deliver a modern, intuitive UI/UX inspired by SEMrush.
*   Lay the groundwork for future AI-powered SEO insights and external integrations.
*   Achieve sustainable growth and revenue within the first year.

2.2. Phase-Based Objectives
*   Phase 1 – MVP Core (October – November 2025): Establish the foundational platform, ensuring all core functionalities (authentication, credits, basic keyword/SERP/domain analysis) are stable and fully functional. No technical debt carried into the next phase.
*   Phase 2 – AI & Content Integration (February – March 2026): Integrate OpenAI to provide valuable AI-driven insights and content optimization tools. Ensure AI outputs are consistent and meaningful.
*   Phase 3 – Analytics & Integrations (April – June 2026): Securely integrate external data sources like Google Analytics (GA4) and Google Search Console (GSC) to enable comprehensive data correlation and reporting.
*   Phase 4 – Billing, Teams & White Label (July – December 2026): Commercialize the platform with robust billing (Stripe), multi-user/team management, and white-label branding for agency readiness.

3. Key Features & Functionality

YouRank.ai will launch with Keyword Research as its core pillar, progressively building on this foundation with subsequent modules to deliver a complete SEO suite.

3.1. Core Modules

3.1.1. Keyword Research (Highest Priority – Phase 1)
*   Goal: Help users discover, evaluate, and prioritize keywords for SEO and PPC campaigns.
*   Data Source: DataForSEO (keywords_data, labs, trends, clickstream)
*   Essential Functionalities:
    *   Keyword Overview (search volume, CPC, difficulty, competition level, trend)
    *   Keyword Suggestions & Related Keywords
    *   Keyword Ideas (based on seed keyword or URL)
    *   Keyword Gap (compare competitors’ keywords)
    *   Search Volume History (12–24 months)
    *   Demographics & Geo Distribution (DataForSEO Trends)
    *   Keyword Intent Classification (Informational, Navigational, Transactional – later with AI)
    *   Bulk Keyword Analysis (CSV upload and batch evaluation)
*   Key Data Points: Search Volume, CPC (Cost Per Click), Keyword Difficulty (KD), Competition Index, Trend Over Time, SERP Features, Country / Language, Demographic Split.

3.1.2. SERP Analysis (Phase 2)
*   Goal: Provide detailed insight into search engine result pages (SERPs) and ranking opportunities.
*   Data Source: DataForSEO (serp/google/organic/live, serp/google/people_also_ask/live, onpage)
*   Essential Functionalities:
    *   SERP Overview for a given keyword (top 10 results with URLs, positions, titles, snippets)
    *   Featured Snippets & People Also Ask detection
    *   AI Overview Analysis (summarize top results – planned for later)
    *   Local Pack Detection (map listings)
    *   SERP Volatility Trends (daily change tracking)
    *   Intent Classification for each ranking page (AI-assisted)
*   Key Data Points: Rank Position, URL / Title / Meta Description, Domain Authority / Visibility, SERP Features, Ranking Stability (volatility), CTR Estimates.

3.1.3. Domain Analytics (Phase 3)
*   Goal: Analyze any domain's organic performance, keyword rankings, and traffic estimation.
*   Data Source: DataForSEO (domain_analytics, labs, merchant)
*   Essential Functionalities:
    *   Domain Overview (traffic, visibility, backlinks, top keywords)
    *   Competitors by Overlapping Keywords
    *   Keyword Rankings (current + changes)
    *   Traffic Estimation (organic & paid)
    *   Top Pages by Traffic
    *   Historical Traffic Trends
*   Key Data Points: Estimated Organic Traffic, Ranking Keywords, Domain Visibility Index, Top Competitors, Traffic Distribution, Traffic Trend Graph.

3.1.4. Backlink Tracking (Phase 4)
*   Goal: Evaluate link profiles, identify new/lost links, and assess domain authority.
*   Data Source: DataForSEO (backlinks/*)
*   Essential Functionalities:
    *   Backlink Overview (total links, referring domains, anchor texts)
    *   New vs Lost Backlinks
    *   Referring Domains by Authority
    *   Anchor Text Analysis
    *   Top Linking Pages
    *   Link Type Breakdown
    *   Link Toxicity / Spam Score (later AI-assisted)
    *   Competitor Backlink Comparison
*   Key Data Points: Referring Domains, Total Backlinks, Anchor Texts, Domain Rating, Dofollow / Nofollow Ratio, New vs Lost Links, Top Pages by Link Count.

3.1.5. On-page Audits (Phase 5)
*   Goal: Diagnose technical SEO issues and provide optimization suggestions for specific URLs or domains.
*   Data Source: DataForSEO (onpage/*), optional Lighthouse API.
*   Essential Functionalities:
    *   Site Health Overview (summary score)
    *   Page Speed & Core Web Vitals
    *   Meta Data Audit (titles, descriptions, duplicates)
    *   Broken Links Report
    *   Schema & Structured Data Check
    *   Image Optimization & Alt Text Review
    *   Internal Linking Map
    *   AI Fix Suggestions (future OpenAI integration)
*   Key Data Points: SEO Health Score, Number of Issues, Title / Meta / H1 Validation, Link Count, Load Speed / Page Size / Requests, Mobile Usability.

3.2. Common System Functionalities (MVP Core)
*   Authentication: Secure user login/logout, password management via Supabase Auth + RLS.
*   Dashboard: Real-time statistics, credit balance, recent analyses, customizable widgets.
*   Credits System: Real-time credit deduction, purchase options, usage history.
*   Analysis Storage: All analysis requests and results stored in Supabase (JSONB).
*   Async Task System: Manages DataForSEO API requests with status tracking (pending, processing, completed, failed).
*   Logging & Error Handling: Comprehensive logging of system events and errors (Sentry + Supabase).
*   UI Performance Optimization: Fast loading times and responsive interactions.

4. UI/UX Design

4.1. Design Vision
YouRank.ai takes strong design inspiration from SEMrush, focusing on clarity, power, refinement, and simplification. The goal is a lighter, modular, and more modern experience with intuitive data visualization and streamlined workflows.

4.2. Key UI/UX Elements
*   Dashboard Overview: Unified view showing overall SEO health (keyword performance, domain traffic, SERP changes) with a cleaner, card-based layout (ShadCN + Tailwind grids), real-time updates, and project/module toggles.
*   Keyword Research Workflow: Single search field leading to tabbed results (Overview, Keyword Ideas, Related Keywords, Difficulty, Trends) with progressive loading and search persistence.
*   Project-Based Navigation: Global project switcher in top navigation (Linear.app style), breadcrumb navigation, and optional quick-view modal for latest analyses.
*   Result Visualization: Clean, responsive charts (Recharts) and color-coded metrics. Toggle between table and chart views. Dark mode optimized for readability.
*   Task/Report Management: Central list of all analyses with status icons (pending, completed, failed), inline result previews, and filtering options.

4.3. Must-Have UX Components
*   Persistent Sidebar Navigation with collapsible groups.
*   Sticky Topbar with search field, credit balance indicator, and user profile dropdown.
*   Dynamic Breadcrumbs (`Project > Module > Page`).
*   Status Chips (Pending / Completed / Error).
*   Loading Skeletons for async sections.
*   Export Buttons (CSV / JSON / PDF).
*   Dark & Light Mode Toggle.

4.4. Branding Guidelines
*   Brand Name: YouRank.ai
*   Tagline: "Smarter SEO Intelligence"
*   Design Philosophy: Modern, trustworthy, data-driven.
*   Color Palette:
    *   Primary: #FF6B00 (Orange) - Accent color, CTA buttons
    *   Secondary: #111827 (Charcoal Black) - Text, Sidebar BG
    *   Tertiary: #F9FAFB (Off-White) - Background
    *   Highlight: #16A34A (Green) - Success / Completed
    *   Warning: #EAB308 (Yellow) - Pending / Info
    *   Error: #DC2626 (Red) - Failed / Error States
    *   Graph Accent Colors: Shades of teal, blue, orange.
*   Typography:
    *   Headings: Inter Bold / 600
    *   Body: Inter Regular
    *   Monospace (Optional): JetBrains Mono
*   Logo Usage: Primary logo "YouRank.ai" with orange highlight on "Rank". Icon: stylized upward arrow or gradient bar. Light and dark variants.

5. Billing Model

5.1. Core Concept
YouRank.ai uses a flexible credit-based billing system where users pay only for the analyses they perform. Each API request consumes a specific number of credits based on complexity, number of endpoints, and data volume. This ensures fairness and scalability for all user types.

5.2. Credit Acquisition
*   Credit Packages (One-Time Purchases): Users can buy bundles via Stripe. Example packages: 100 Credits (€9.90), 500 Credits (€39.90), 1,000 Credits (€69.90), 5,000 Credits (€299.00).
*   Subscription Tiers (Optional Add-on): Pro, Agency, Enterprise tiers providing monthly credits with 30-day rollover.
*   Trial Credits: New users receive 25–50 free credits (expires after 7 days) to test tools.
*   Referral & Bonus Credits: Incentives for inviting new users or periodic promotions.

5.3. Credit Consumption Rates
*   Keyword Overview: 3 credits
*   Keyword Research (Related, suggestions): 1–2 credits
*   SERP Analysis (Top 10 results, snippets, PAA): 2 credits
*   Domain Overview: 3 credits
*   Backlink Overview: 3 credits
*   On-page Audit: 5 credits
*   Competitor Gap: 3 credits
*   Clickstream Data: 2 credits
*   AI Recommendations: 2 credits (optional, billed only when used)

5.4. Credit Management & Tracking
*   Database Structure (Supabase): `user_credits` table tracks `total_credits`, `used_credits`, `last_updated` per user.
*   Real-Time Credit Tracking: Before each API request, a Supabase RPC function (`deduct_user_credits`) checks and deducts credits upon successful API response. Insufficient credits block the request.
*   User Tracking: Dashboard widgets display available credits, monthly usage charts, and a detailed history table (Date | Tool | Credits Used | Status | Duration). Notifications trigger for low credit balance (20% remaining, 0 credits).

5.5. Future Enhancements
*   Auto Top-Up Option.
*   Team Credit Sharing.
*   Per-Project Billing for reporting.
*   Usage-based Invoicing.

6. Technical Specifications & Architecture

6.1. Tech Stack
*   Frontend: Next.js 15, TypeScript, ShadCN UI, Tailwind CSS, Recharts.
*   Backend: Next.js API Routes (serverless), TypeScript.
*   Database & Auth: Supabase (PostgreSQL + Auth + RLS), hosted in EU (Frankfurt).
*   External APIs: DataForSEO, OpenAI (future), Google Analytics API (future), Google Search Console API (future), Google Merchant API (future).
*   Task Queue: n8n / Supabase Edge Functions (for async DataForSEO tasks).
*   Monitoring & Error Tracking: Vercel Analytics, Supabase Logs, UptimeRobot, Sentry (optional).
*   Caching: Upstash Redis or Supabase Cache (optional).
*   Storage: Supabase Storage.
*   CDN: Vercel Edge Network.
*   Testing Frameworks: Jest, Playwright.

6.2. Application Architecture
YouRank.ai follows a modular design (`modules.config.ts`), allowing for easy expansion. The frontend consumes Next.js API routes, which in turn interact with Supabase and external APIs (DataForSEO, OpenAI). Analysis requests are processed asynchronously to prevent UI blocking.

6.3. DataForSEO API Integration

6.3.1. Key Endpoints for Initial Features:
*   Keywords Data API: `/v3/keywords_data/google_ads/search_volume/live`, `/v3/keywords_data/google_ads/keywords_for_site/live`, `/v3/keywords_data/google_ads/keywords_for_keywords/live`, `/v3/keywords_data/clickstream_data/dataforseo_search_volume/live`, `/v3/keywords_data/google_trends/explore/live`.
*   Domain Analytics API: `/v3/domain_analytics/overview/live`, `/v3/domain_analytics/traffic_analytics/live`, `/v3/domain_analytics/ranked_keywords/live`.
*   Labs API: `/v3/dataforseo_labs/google/keyword_ideas/live`, `/v3/dataforseo_labs/google/competitors_domain/live`.

6.3.2. Expected API Call Volume (per user/month, estimate):
*   Free Plan: 100 Credits = ~50 Keyword analyses.
*   Pro Plan: 1,000 Credits = ~500 Keyword analyses.
*   Enterprise: 10,000+ Credits = ~5,000+ Keyword analyses.
*   Most frequent endpoints: Search Volume (40%), Keywords for Site (25%), Keywords for Keywords (20%), Trend Analysis (15%).

6.3.3. Data Structure in Supabase (PostgreSQL):
*   `analyses` table: Stores `id` (UUID), `user_id` (UUID), `type` (TEXT), `input` (JSONB - request parameters), `result` (JSONB - full API response), `credits_used` (INTEGER), `status` (TEXT, default 'pending').
*   `dataforseo_usage` table: Tracks `id` (UUID), `user_id` (UUID), `analysis_id` (UUID), `api_endpoint` (TEXT), `request_data` (JSONB), `response_data` (JSONB), `credits_used` (INTEGER), `status` (TEXT, default 'completed').
*   JSONB Structure for API Responses: Flexible to store full API responses (e.g., `keyword_data` array, `metadata`).
*   Indexing: GIN indexes on JSONB fields (`idx_analyses_result_gin`, `idx_dataforseo_usage_response_gin`) and specific indexes for common queries (`idx_analyses_type_created`, `idx_dataforseo_usage_endpoint`).
*   Data Processing: Raw storage in JSONB, processed views for common queries, Redis caching for recurring requests (24h TTL), archiving of old data.
*   Rate Limiting & Monitoring: `CREDIT_COSTS` object per endpoint, retry logic with exponential backoff (max 3 retries).

6.4. Development Workflow & Environment

6.4.1. Development Philosophy: Modular, scalable DevOps approach focusing on clarity, reproducibility, and zero-downtime deployments.

6.4.2. Version Control Strategy: Hybrid Gitflow + Trunk-based workflow using GitHub.
*   Branch Structure: `main` (Production), `develop` (Staging), `feature/*`, `hotfix/*`, `release/*`.
*   Workflow: Feature branch -> PR to `develop` -> Staging deployment -> QA -> Merge to `main` -> Production deployment.
*   Commit Convention: Conventional Commits (e.g., `feat(keywords): add keyword difficulty analysis`).
*   Tagging & Versioning: Semantic Versioning (SemVer), automatic Changelogs via GitHub Actions.

6.4.3. Deployment Environments:
*   Local Dev: `http://localhost:3000`, uses `.env.local`.
*   Staging: `https://staging.yourank.ai`, Vercel (Preview Env), connected to Supabase "staging" DB, triggered by merge to `develop`.
*   Production: `https://yourank.ai`, Vercel (Main Env), connected to Supabase "production" DB, triggered by merge to `main`.
*   Supabase (DB): Supabase Cloud (EU Frankfurt), auto-sync via migrations.

6.4.4. CI/CD Requirements: Vercel + GitHub Actions.
*   Continuous Integration: Triggered by PR/commit to `develop`. Steps: Linting, TypeScript Check, Unit Tests, Build Check, Preview Deployment on Vercel.
*   Continuous Deployment: Triggered by merge to `main`. Steps: Auto-Deploy via Vercel Production, Build Optimizations, Slack/Discord notification, Supabase migration (`supabase db push`). Optional manual approval.

6.4.5. Infrastructure Overview:
*   Frontend/API: Next.js 15 on Vercel (SSR, ISR, Edge Functions).
*   Database: Supabase (PostgreSQL) for Auth, RLS, JSONB Storage.
*   Task Queue: n8n / Supabase Edge Functions for async DataForSEO tasks.
*   Monitoring: Vercel Analytics + Supabase Logs + UptimeRobot, Sentry (optional).
*   Cache Layer: Upstash Redis or Supabase Cache (optional).
*   Storage: Supabase Storage (Frankfurt Region).
*   CDN: Vercel Edge Network.
*   Testing Framework: Jest + Playwright.

6.4.6. Environment Variables & Secrets:
*   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATAFORSEO_API_KEY`, `OPENAI_API_KEY`, `NEXT_PUBLIC_APP_URL`.
*   Management: `.env.local` (local), Vercel UI (Project Settings -> Environment Variables).

6.4.7. Development Best Practices:
*   Code Style: Prettier + ESLint (enforced in CI).
*   Security: No client-side API keys, all requests via Next.js API Routes, RLS policies active.
*   Performance: Lazy Loading, `useMemo`, React Query Cache.
*   Data Safety: RLS, authenticated access only.
*   Testing: Unit tests for utils, integration tests for API routes.
*   Documentation: `/docs/` folder, Swagger/OpenAPI for API.
*   Feature Flags: `config/modules.config.ts`.
*   Rollback Plan: Vercel Deploy Rollback via dashboard/CLI.

6.5. Error Handling, Logging & Monitoring

6.5.1. Goals: Automatic error detection, traceable root causes, user-friendly error messages, system stability, centralized logging and classification (Warning, Error, Critical).

6.5.2. Architecture Overview: Frontend (ErrorBoundary + Toasts) and API Layer (Server Logger + Supabase Logs) feed into a centralized Sentry/Datadog system.

6.5.3. Frontend Error Handling (Next.js 15):
*   Error Boundaries: `error.tsx` files per module display friendly messages and log to Sentry.
*   Toast & Notification System: UI shows `Toast` for temporary issues (timeout, rate limit) and success messages.
*   Network & API Error Handling: Central `useApi()` hook catches errors and sends them to Sentry (Frontend DSN).
*   Client Logging in Supabase: Optional storage of light client errors in `frontend_logs` table for debugging.

6.5.4. Backend Error Handling (Next.js API Layer):
*   Global Error Middleware: `handleApiError()` function centrally logs errors to Sentry and returns generic 500.
*   Error Categories: Validation (400), Auth (redirect to login), Rate Limit (429 + wait), Integration (retry), Database (logging + alert).

6.5.5. API Integrations Error Handling (DataForSEO, OpenAI, GA4, GSC):
*   DataForSEO: Interprets error codes, 3 automatic retries for timeout/429. Failed requests set `analyses.status='failed'`.
*   OpenAI: Timeout limit (30s), immediate session invalidation on token error. AI errors anonymized.
*   Logging Table (`api_logs`): Stores `provider`, `endpoint`, `status_code`, `duration_ms`, `error_message`, `created_at` for auditability.

6.5.6. Centralized Logging:
*   Tools: Sentry JS/Node SDKs, Supabase Log Drains, Vercel Analytics / Datadog (optional), custom Supabase tables (`api_logs`, `frontend_logs`).
*   Sentry & Datadog activation via `SENTRY_DSN`, `DATADOG_API_KEY`.

6.5.7. Monitoring & Alerting:
*   Uptime: UptimeRobot / Cronitor (App + DB + API).
*   Server Status: Vercel Analytics.
*   Database: Supabase Insights.
*   Error Alerts: Sentry Alerts (real-time emails/Slack for critical errors).
*   Task Performance: n8n Logs.

6.5.8. Privacy & Data Protection (GDPR):
*   No storage of sensitive data (API keys, user IPs) in logs.
*   Error data pseudonymized (User-ID).
*   Log Retention: Sentry/Datadog (30 days), Supabase Logs (90 days). Aggregated metrics stored indefinitely.

6.6. Performance & Scalability

6.6.1. Core Performance KPIs:
*   Average API Response Time (Live DataForSEO Calls): <= 2.5 seconds.
*   Asynchronous Task Completion (OnPage, Domain Audit): <= 90 seconds.
*   Queue Latency (Supabase + n8n): <= 5 seconds.
*   Retry Success Rate: >= 99%.
*   Error Rate (API Calls): <= 1%.
*   Initial Dashboard Load Time: <= 2 seconds.
*   Subpage Navigation Time: <= 500 ms.
*   Perceived Loading Delay (Skeleton Display): <= 300 ms.
*   Frontend FPS Stability: >= 55 FPS.
*   Mobile Responsiveness: 100% on Core Views.
*   Data Rendering Time (Charts & Tables): <= 1.5 seconds.

6.6.2. Database Performance (Supabase / PostgreSQL):
*   Query Response Time: <= 200 ms for CRUD.
*   Insert Latency: <= 50 ms.
*   Concurrent Writes: >= 200/sec.
*   Row-Level Security Execution Time: <= 5 ms overhead.
*   Database Size Management: <= 50 GB/month active, old raw data archived after 90 days.
*   Storage Growth Rate: Linear & controlled.

6.6.3. Scalability Benchmarks:
*   Frontend (Next.js 15): 100 req/s via Vercel Edge Functions + ISR.
*   API Layer: 300 concurrent requests via Serverless Functions.
*   Database Layer (Supabase): 500 writes/s, 2000 reads/s via horizontal scaling + caching.
*   Storage (Raw JSON Results): 2 TB (after 12 months) via Supabase Storage + Cold Archive.
*   AI Requests (OpenAI): 50 parallel GPT Calls, rate-limited per user via RLS.

7. Phased Development Plan & Milestones

7.1. Project Methodology: "Gate-Driven Delivery"
Each phase ends with a Gate Review before further development. Criteria:
1.  All functionalities must work – no open bugs or temporary workarounds.
2.  Stability Check – at least 7 days without critical errors.
3.  Performance Test – load times & error rates below target.
4.  Security Review – RLS, Auth, GDPR checked.
5.  Documentation Complete – Readme, API Docs, Feature Guide finished.
Only then: Merge into `main` + Deploy to Production.

7.2. Phase 1 – MVP Core (October – November 2025)
*   Goal: The foundation is stable. Everything works smoothly – from login to keyword analysis. No AI, no additional modules – just the core.
*   Modules & Functions: Authentication (Supabase Auth + RLS), Dashboard with Realtime-Stats, Credits-System with deduction logic, 3 Core Modules (Keywords Data - 5 Tools, SERP Analysis - 2 Tools, Domain Overview - 1 Tool), Analysis-Speicherung (Supabase JSONB), Async Task System (with status `pending` -> `completed`), Logging & Error Handling (Sentry + Supabase), UI-Performance optimized (<= 2.5s load time).
*   Definition of Done:
    *   Backend/API: All API endpoints deliver consistent results & store in DB.
    *   Frontend/UI: No error messages, UI responds <500 ms.
    *   Credits-System: Deduction, increase, and history function correctly.
    *   Analyses: All tasks are tracked correctly (pending -> completed).
    *   Monitoring: Errors <1%, Logs active in Sentry.
    *   Uptime-Test: 48 h without downtime.
    *   QA-Test: Successful beta test with 3 real users.
*   Next Step: Gate-Review -> Release for Phase 2.

7.3. Phase 2 – AI & Content Integration (February – March 2026)
*   Goal: AI understands keywords & content, provides valid optimizations. Users can generate concrete action recommendations.
*   Modules & Functions: OpenAI-Anbindung (GPT-4/5), 3 AI-Tools (Keyword Insights, Content Optimization, SEO Recommendations), Content Generator (Meta Tags, Product Descriptions), Speichern der AI-Ergebnisse in `ai_recommendations`, Credits-Abzug for AI-Aufrufe integriert.
*   Definition of Done:
    *   AI-Verarbeitung: Every GPT call provides usable answer <30 s.
    *   Backend: AI-Tools integrated into API with retry logic.
    *   UI: All results displayed correctly with Markdown.
    *   Credits: AI consumption visible in Dashboard.
    *   Monitoring: AI error rate <3%.
    *   Security: No API-Keys in Frontend.
    *   Stabilität: 7 days continuous operation without crash.
*   Next Step: Gate-Review -> Release for Phase 3.

7.4. Phase 3 – Analytics & Integrations (April – June 2026)
*   Goal: The system can securely retrieve and combine data from external sources (Google Analytics, Search Console, Merchant).
*   Modules & Functions: Google Analytics (GA4) Integration (Traffic, Pages, Conversions), Google Search Console Integration (CTR, Impressions, Positions), Merchant Data API (Google Shopping), OAuth 2.0 for Google-Dienste, Vergleichsberichte (DataForSEO + GA4 + GSC).
*   Definition of Done:
    *   Google APIs: OAuth works stably for multiple users.
    *   Data Correlation: GA4 + GSC + DataForSEO data mergeable.
    *   Dashboard: Comparison view (Traffic vs. Rankings) active.
    *   Fehlerquote: <2% for API queries.
    *   Performance: Load times <3 s.
    *   DSGVO: All Google-APIs via EU-Server + consent texts.
    *   QA: Beta test with 3 linked Google accounts passed.
*   Next Step: Gate-Review -> Release for Phase 4.

7.5. Phase 4 – Billing, Teams & White Label (July – December 2026)
*   Goal: Commercialization and agency capability. System becomes a full SaaS product with multi-tenancy.
*   Modules & Functions: Stripe Integration (One-Time + Subscription), Multi-User / Teamverwaltung, Roles (Admin, Editor, Viewer), White-Label Branding (Logo, Colors, Domain), Automatic Invoices & E-Mail-Notifications, API-Key Management per customer.
*   Definition of Done:
    *   Billing: Stripe Checkout, Webhooks, credit purchases function.
    *   User-Roles: Rights correctly enforced by RLS.
    *   White-Label: Branding settings storable & immediately visible.
    *   Security: DSGVO-compliant data processing.
    *   Reports: PDF/CSV Export functions.
    *   Monitoring: Uptime >=99.9%, Sentry Logs active.
    *   Support-Tools: Admin-Dashboard for support and invoices active.
*   Next Step: Public v2.0 Launch after full test run with 5 agency clients.

7.6. Advantages of this Approach
*   No chaos during growth (every version stable).
*   Developers & testers know exactly when a feature is "done".
*   Clear QA metrics (no discussions about partial completion).
*   Customer trust through gradual expansion.
*   Fewer technical debts, as everything remains modular.

8. Future Enhancements & Roadmap

These integrations and modules are planned as future expansion stages beyond Phase 4.

8.1. Google Analytics (GA4) – Future Integration (Phase 3)
*   Goal: Integrate GA4 data directly into the dashboard to link SEO data with website traffic and user behavior.
*   Functions: Traffic Overview, Top Landing Pages, Conversion Mapping, Traffic Sources.
*   Data Exchange: Inbound (GA4 -> YouRank via OAuth 2.0). Read-only access.
*   System Actions: Daily synchronization via Supabase Edge Function/Cronjob, data comparison (Keywords <=> Sessions <=> Conversions).

8.2. Google Search Console (GSC) – Future Integration (Phase 3)
*   Goal: Compare actual clicks, impressions, and CTRs with YouRank ranking data.
*   Functions: Keyword Performance (clicks, impressions, CTR, position), Top Pages Report (high impressions, low CTR), Device & Country Filter, Ranking Gaps (GSC + DataForSEO).
*   Data Exchange: Inbound (GSC -> YouRank via OAuth, read-only).
*   System Actions: Daily data synchronization per verified domain, AI-driven recommendations.

8.3. OpenAI – Planned Integration for AI-Powered Optimization (Phase 2, further development in Phase 4-7)
*   Goal: Leverage OpenAI for SEO recommendations, content optimization, and competitive analysis to provide automatically generated improvement suggestions.
*   Functions: AI Keyword Insights, SEO Recommendations, Content Optimization, Competitor Insights.
*   Data Exchange: Inbound (SEO data from YouRank), Outbound (GPT-generated texts/recommendations).
*   System Actions: Store AI results in `ai_recommendations`, display as Markdown/card.

8.4. Content Generation Module – Future Planning (Phase 5)
*   Goal: Provide AI-powered generation of SEO texts, product descriptions, and meta tags based on keyword and domain data.
*   Functions: Meta Tag Generator, AI Product Descriptions, Article Outline Builder, Paraphrasing Tool.
*   System Actions: Store generated content in `content_generation`, export function (HTML/Markdown/JSON).

8.5. Merchant Data Module – Future Planning (Phase 6)
*   Goal: Expand with Google Shopping and e-commerce data to analyze competitor products, price trends, and SERP representation.
*   Functions: Google Shopping Overview, Seller Analysis, Product Spec Fetch.

8.6. AI-Powered SEO Insights – Long-Term Vision (Phase 7)
*   Goal: A full AI SEO assistant combining all modules to provide automated, actionable recommendations (e.g., "Your domain is losing traffic because X keywords are losing visibility. Here are optimization suggestions.").
*   Functions: AI Dashboard Insights (weekly reports), Alert System (ranking loss notifications), Smart Recommendations (prioritized to-do list), AI Report Generator (White-Label PDF/HTML).

9. Key Performance Indicators (KPIs) & Success Metrics

YouRank.ai will be designed for speed, scalability, and data stability from the outset, targeting suitability for SEM/SEO agencies.

9.1. API & Analysis Performance
*   Average API Response Time (Live DataForSEO Calls): <= 2.5 seconds.
*   Asynchronous Task Completion (OnPage, Domain Audit): <= 90 seconds.
*   Queue Latency (Supabase + n8n): <= 5 seconds.
*   Retry Success Rate: >= 99%.
*   Error Rate (API Calls): <= 1%.

9.2. UI Responsiveness & User Experience
*   Initial Dashboard Load Time: <= 2 seconds.
*   Subpage Navigation Time: <= 500 ms.
*   Perceived Loading Delay (Skeleton Display): <= 300 ms.
*   Frontend FPS Stability: >= 55 FPS.
*   Mobile Responsiveness: 100% on Core Views.
*   Data Rendering Time (Charts & Tables): <= 1.5 seconds.

9.3. Database Performance (Supabase / PostgreSQL)
*   Query Response Time: <= 200 ms for CRUD operations.
*   Insert Latency: <= 50 ms.
*   Concurrent Writes: >= 200/sec.
*   Row-Level Security Execution Time: <= 5 ms overhead.
*   Database Size Management: <= 50 GB/month active.

9.4. User Growth & Usage Forecast (Year 1)
*   Active Users:
    *   Month 1–3 (Beta): 50–100 active users.
    *   Month 4–6 (Public Launch): 300–500 users.
    *   Month 7–12 (Scaling Phase): 1,000–2,000 active users.
*   Analysis Volume:
    *   Start Phase (0–3 months): ~100–300 analyses/day (~9,000/month).
    *   Growth Phase (4–6 months): ~800–1,500 analyses/day (~40,000/month).
    *   Scaling Phase (7–12 months): ~3,000–5,000 analyses/day (~120,000–150,000/month).
*   API Calls: Up to 500,000 API calls/month from Phase 2.

9.5. Reliability & Uptime KPIs
*   System Uptime (App + DB + API): >= 99.9%.
*   Failover Recovery Time: <= 60 seconds.
*   Error Logging Coverage: 100%.
*   Data Integrity Failures: 0.

9.6. Business-Level KPIs (Target after 12 months)
*   Registrierte Accounts: 2,000+.
*   Retention Rate (30 days): >= 60%.
*   Avg. Credits Used / User / Month: 200–400 Credits.
*   Conversion Rate (Free -> Paid): 10–15%.
*   Revenue Goal (Year 1): ~€8,000–€15,000 MRR.
*   Customer Support Tickets: Average response time < 1 hour.

## Technology Stack
## TECHSTACK - YouRank.ai Technology Stack

YouRank.ai is engineered with a modern, high-performance, and scalable technology stack designed to deliver a robust, real-time SEO analytics platform. Our choices prioritize developer experience, cost-effectiveness, GDPR compliance, and seamless integration with industry-leading data providers.

### 1. Frontend & User Interface

The user-facing application is built for speed, responsiveness, and a clean, intuitive experience inspired by leading SEO tools like SEMrush, but with a simplified, modular approach.

*   **Framework**: **Next.js 15 (App Router)**
    *   **Justification**: Leverages server-side rendering (SSR), static site generation (SSG/ISR), and server components for optimal performance, faster initial page loads, and efficient data fetching. The App Router provides a robust foundation for modularity and scalability.
*   **Language**: **TypeScript**
    *   **Justification**: Enhances code quality, maintainability, and developer productivity by providing static type checking, reducing bugs, and improving collaboration across the team.
*   **UI Component Library**: **ShadCN UI**
    *   **Justification**: Offers a collection of headless, accessible, and customizable React components that are built on Radix UI and styled with Tailwind CSS. This ensures a consistent, modern, and highly adaptable UI with excellent developer ergonomics.
*   **Styling**: **Tailwind CSS**
    *   **Justification**: A utility-first CSS framework that enables rapid UI development, consistent styling, and highly optimized bundle sizes. Its flexibility supports the modular page layouts and white-label branding requirements.
*   **Data Visualization**: **Recharts**
    *   **Justification**: A composable charting library built with React and D3.js. It's ideal for displaying complex SEO data (trends, volumes, distributions) in clear, interactive, and responsive charts, replacing outdated graph solutions.

### 2. Backend & Database

Our backend leverages a powerful serverless platform that simplifies authentication, data storage, and real-time capabilities, all while ensuring robust security and GDPR compliance.

*   **Backend-as-a-Service (BaaS)**: **Supabase**
    *   **Justification**: Provides a comprehensive suite of tools including:
        *   **PostgreSQL Database**: A highly reliable, ACID-compliant relational database. It supports JSONB columns for flexible storage of DataForSEO API responses and complex nested data structures, crucial for our analyses table.
        *   **Supabase Auth**: Manages user authentication (email/password, social logins) with row-level security (RLS) policies for granular data access control, critical for multi-user and multi-tenant scenarios.
        *   **Supabase Edge Functions**: Powers our Next.js API routes, enabling serverless execution of backend logic, secure API key handling, and asynchronous task processing.
        *   **Supabase Storage**: Securely stores generated reports, exports (CSV/PDF), and other project-related files.
        *   **Realtime**: Facilitates real-time updates for dashboards and analysis statuses (e.g., "pending" to "completed"), enhancing user experience.
    *   **Hosting Region**: **EU (Frankfurt)**
        *   **Justification**: Ensures full GDPR compliance by keeping all user data and operations within the European Union, a key value proposition for YouRank.ai.
*   **Language**: **TypeScript** (for Next.js API Routes / Edge Functions)
    *   **Justification**: Same benefits as frontend TypeScript, ensuring consistency and type safety across the entire application stack.

### 3. Core API Integrations

YouRank.ai's core functionality relies on integrating with best-in-class external APIs for data enrichment and service provision.

*   **Main Data Source**: **DataForSEO API**
    *   **Justification**: Provides comprehensive and highly accurate SEO data (keyword research, SERP analysis, domain analytics, backlinks, on-page audits). Its credit-based model aligns perfectly with YouRank.ai's billing strategy. Essential endpoints include `keywords_data`, `serp`, `domain_analytics`, `backlinks`, and `onpage`.
*   **Billing & Payments**: **Stripe**
    *   **Justification**: A leading payment processing platform offering secure and flexible solutions for one-time credit package purchases and future subscription tiers. Its robust API and webhook system integrate seamlessly with Supabase for credit management.
*   **AI-Powered Insights (Future)**: **OpenAI API (GPT-4/5)**
    *   **Justification**: Will enable advanced AI features such as automated SEO recommendations, content optimization suggestions, keyword intent classification, and content generation. This provides YouRank.ai with a competitive edge by transforming raw data into actionable intelligence.
*   **Analytics Integration (Future)**: **Google Analytics (GA4) API**
    *   **Justification**: Will allow users to connect their GA4 accounts to view website traffic, user behavior, and conversion data directly within YouRank.ai, correlating SEO performance with business outcomes. OAuth 2.0 for secure authentication.
*   **Performance Data (Future)**: **Google Search Console (GSC) API**
    *   **Justification**: Will enable fetching actual clicks, impressions, CTR, and average positions directly from Google, providing a verifiable performance overlay to DataForSEO's ranking data. OAuth 2.0 for secure authentication.

### 4. Infrastructure & Deployment

Our infrastructure choices focus on serverless principles for automatic scaling, zero-downtime deployments, and global performance.

*   **Frontend & API Hosting**: **Vercel**
    *   **Justification**: Optimized for Next.js applications, Vercel provides a global CDN, serverless functions for API routes, and advanced features like Incremental Static Regeneration (ISR) and Edge Functions. It ensures lightning-fast load times and automatic scaling under varying traffic loads.
*   **CI/CD**: **Vercel's Built-in CI/CD + GitHub Actions**
    *   **Justification**: Vercel automatically deploys preview environments for every pull request and production on merges to `main`. GitHub Actions will orchestrate additional tasks like running Supabase migrations, comprehensive testing, and sending notifications, ensuring a robust and automated development pipeline ("Gate-Driven Delivery").
*   **Database Hosting**: **Supabase Cloud (EU Frankfurt)**
    *   **Justification**: Managed PostgreSQL database with automatic backups, scaling, and high availability, located in the EU for data sovereignty.

### 5. Monitoring, Logging & Error Handling

A comprehensive observability stack is crucial for maintaining system stability, quickly diagnosing issues, and ensuring a smooth user experience.

*   **Error Tracking**: **Sentry**
    *   **Justification**: Provides real-time error reporting and performance monitoring for both frontend (Next.js client-side) and backend (Next.js API routes/Edge Functions). It captures stack traces, user context, and environment details, enabling rapid debugging. Alerts are configured for critical errors.
*   **Application & Infrastructure Monitoring**: **Vercel Analytics & Supabase Logs/Insights**
    *   **Justification**: Vercel Analytics offers insights into frontend performance, build times, and serverless function invocations. Supabase provides detailed database query logs, performance metrics, and usage statistics.
*   **Uptime Monitoring**: **UptimeRobot / Cronitor (External)**
    *   **Justification**: Ensures external monitoring of application availability and response times, providing immediate alerts in case of downtime.
*   **Custom Logging**: **Supabase Tables (`api_logs`, `frontend_logs`)**
    *   **Justification**: Dedicated tables for structured logging of API integration calls (DataForSEO, OpenAI), performance metrics, and specific client-side events, allowing for auditability and internal analysis.

### 6. Development Tools & Practices

Our development workflow emphasizes code quality, efficient collaboration, and rigorous testing.

*   **Version Control**: **Git / GitHub**
    *   **Justification**: Industry-standard for collaborative development, enabling robust branching strategies (Hybrid Gitflow), pull requests, and code reviews.
*   **Code Quality & Formatting**: **ESLint & Prettier**
    *   **Justification**: Enforces consistent code style, identifies potential issues, and automates code formatting, improving readability and reducing conflicts. Integrated into CI for automated checks.
*   **Testing Frameworks**: **Jest (Unit/Integration) & Playwright (End-to-End)**
    *   **Justification**: Jest is used for fast unit and integration tests of utility functions and API routes. Playwright provides reliable end-to-end testing for critical user flows, ensuring application stability across browsers.
*   **Documentation**: **Markdown (GitHub Wiki/Docs Folder) & JSDoc**
    *   **Justification**: Maintains clear, up-to-date documentation for code, API endpoints, feature guides, and setup instructions.

### Conclusion

The YouRank.ai tech stack is meticulously chosen for its ability to deliver a modern, performant, and scalable SaaS product. By combining Next.js and Supabase, we benefit from a unified, full-stack TypeScript environment that prioritizes developer velocity, security through RLS, and real-time capabilities. With a strong focus on GDPR-compliant hosting, robust API integrations like DataForSEO and Stripe, and a comprehensive observability strategy, YouRank.ai is built to be a reliable, future-proof platform for SEO professionals.

## Project Structure
PROJECT STRUCTURE

YouRank.ai utilizes a highly modular and scalable project structure, built around Next.js 15's App Router, TypeScript, and Supabase. The architecture emphasizes separation of concerns, maintainability, and extensibility, especially for integrating new SEO modules and external APIs.

The core principle is to keep related logic (UI, API routes, data fetching) co-located within features or modules, while centralizing shared utilities, configurations, and UI components.

## 1. Root Level Directories

*   `.next/`:
    *   Next.js build output. Automatically generated and should not be manually edited.
*   `node_modules/`:
    *   Node.js dependencies installed via `pnpm`.
*   `public/`:
    *   Static assets served directly by Next.js, such as images, fonts, favicons, and robots.txt.
    *   `public/images/`: Brand logos, module icons, illustration assets.
    *   `public/icons/`: SVG icons used in the UI.
*   `src/`:
    *   **The primary directory for all application source code.** This encapsulates the frontend, backend (API routes), and shared logic.
*   `supabase/`:
    *   Configuration and management files for the Supabase backend, including migrations, database functions, and seed data.
*   `docs/`:
    *   Project documentation, including architecture overviews, API references, and this project structure document.
*   `tests/`:
    *   Contains unit, integration, and end-to-end tests for various parts of the application.

## 2. `src/` - Application Source Code

This is the heart of the YouRank.ai application, organized to support Next.js 15's App Router conventions and a modular feature-based development approach.

### 2.1 `src/app/` - Next.js App Router

Handles all page routing, layouts, and API routes. It's structured around authenticated (`(dashboard)`) and unauthenticated (`(auth)`) route groups.

*   `app/(dashboard)/`:
    *   **Authenticated routes for the main application dashboard.** This group includes the persistent sidebar navigation and overall dashboard layout.
    *   `layout.tsx`: The main dashboard layout, including the sidebar navigation, top bar, and content area. This is where components like `<Sidebar />` and `<Topbar />` are rendered.
    *   `loading.tsx`: A shared loading UI for the dashboard content, displayed during data fetching or initial page load.
    *   `error.tsx`: The error boundary for the dashboard, gracefully handling unexpected errors within the authenticated routes.
    *   `page.tsx`: The main dashboard overview page, providing a snapshot of overall SEO health and recent analyses, inspired by SEMrush's dashboard.
    *   `projects/`:
        *   Module for managing client projects.
        *   `[projectId]/`: Dynamic route for specific project details.
        *   `layout.tsx`: Layout specific to a project view (e.g., project-level navigation).
        *   `page.tsx`: Project overview page, showing aggregated data for a selected project.
        *   `settings/page.tsx`: Project-specific settings and configurations.
        *   `create/page.tsx`: Page for creating a new project.
        *   `page.tsx`: Lists all available projects.
    *   `keywords/` (Phase 1):
        *   **The primary module for Keyword Research.** This is a core feature in MVP.
        *   `layout.tsx`: Layout specific to the Keywords module, potentially including tab-based navigation for different keyword tools (Overview, Research, Difficulty, Trends).
        *   `page.tsx`: Main entry point for the Keyword Research module (e.g., Keyword Overview search).
        *   `research/page.tsx`: Detailed keyword ideas and suggestions.
        *   `difficulty/page.tsx`: Keyword difficulty analysis.
        *   `trends/page.tsx`: Keyword trend analysis using DataForSEO Trends.
    *   `serp/` (Phase 2):
        *   Module for SERP Analysis, inspired by SEMrush's SERP features.
        *   `layout.tsx`: Layout for SERP tools.
        *   `page.tsx`: SERP overview for a given keyword.
    *   `domain/` (Phase 3):
        *   Module for Domain Analytics (traffic, keywords, competitors).
        *   `layout.tsx`: Layout for Domain Analytics tools.
        *   `page.tsx`: Domain overview and analysis.
    *   `backlinks/` (Phase 4):
        *   Module for Backlink Tracking.
        *   `layout.tsx`: Layout for Backlink tools.
        *   `page.tsx`: Backlink overview and analysis.
    *   `onpage/` (Phase 5):
        *   Module for On-page Audits.
        *   `layout.tsx`: Layout for On-page tools.
        *   `page.tsx`: Site health overview and audit reports.
    *   `ai-tools/` (Phase 2):
        *   Module for AI & Content Integration (Keyword Insights, Content Optimization).
        *   `layout.tsx`: Layout for AI tools.
        *   `page.tsx`: Entry point for AI-powered SEO tools.
    *   `integrations/` (Phase 3):
        *   Module for external integrations (Google Analytics, Google Search Console, OpenAI).
        *   `layout.tsx`: Layout for integration settings.
        *   `page.tsx`: Manages connections to external services.
    *   `settings/`:
        *   User and application-wide settings.
        *   `layout.tsx`: Settings-specific layout.
        *   `profile/page.tsx`: User profile and account settings.
        *   `billing/page.tsx`: Credit management, purchase history, and subscription options (Phase 4).
        *   `team/page.tsx`: Multi-user and team management (Phase 4).
        *   `branding/page.tsx`: White-label branding options (logo, colors, domain) (Phase 4).
    *   `analysis-history/page.tsx`:
        *   A central view listing all analyses performed by the user, with status tracking (pending, completed, failed) as outlined in `billing_model_details`.
    *   `feedback/page.tsx`:
        *   User feedback and support contact page.
*   `app/(auth)/`:
    *   **Unauthenticated routes for user authentication.**
    *   `layout.tsx`: Layout for authentication pages (e.g., minimalist layout without sidebar).
    *   `login/page.tsx`: User login page.
    *   `signup/page.tsx`: User registration page.
    *   `reset-password/page.tsx`: Password reset functionality.
*   `app/api/`:
    *   **Next.js API Routes, acting as the backend for the application.** All sensitive API calls (DataForSEO, OpenAI, Supabase Service Role) are proxied through these routes.
    *   `auth/`:
        *   Supabase authentication handlers (e.g., callback for OAuth).
        *   `callback/route.ts`: Handles Supabase OAuth redirects.
        *   `user/route.ts`: API endpoint to get/update user details.
    *   `dataforseo/`:
        *   API routes to interact with the DataForSEO API. Each sub-route handles a specific DataForSEO endpoint or a collection of related endpoints.
        *   `keyword-overview/route.ts`: Handles requests for keyword overview data (`keywords_data/google_ads/search_volume/live`).
        *   `serp-analysis/route.ts`: Proxies SERP analysis requests.
        *   `domain-analytics/route.ts`: Proxies domain analytics requests.
        *   `task-status/route.ts`: Endpoint for polling the status of asynchronous DataForSEO tasks.
    *   `openai/`:
        *   API routes for OpenAI integration (AI recommendations, content generation).
        *   `recommendations/route.ts`: Handles requests for AI-generated SEO recommendations.
    *   `supabase/`:
        *   API routes for server-side Supabase interactions, particularly for credit deduction logic.
        *   `credits/route.ts`: Endpoint for securely deducting user credits after a successful analysis.
    *   `webhooks/`:
        *   Endpoints for receiving webhooks from external services.
        *   `stripe/route.ts`: Handles Stripe webhook events (e.g., successful payments, subscription updates).
        *   `dataforseo/route.ts`: Handles DataForSEO asynchronous task completion webhooks.
    *   `health/route.ts`: A simple health check endpoint for monitoring purposes (`error_logging_monitoring`).
*   `app/global-error.tsx`:
    *   The highest-level error boundary, catching errors not handled by specific route group error boundaries.
*   `app/layout.tsx`:
    *   The root layout for the entire application (e.g., `<html>` and `<body>` tags, global CSS imports).
*   `app/not-found.tsx`:
    *   Custom 404 error page.

### 2.2 `src/components/` - Reusable UI Components

Contains all React components, organized for reusability.

*   `components/ui/`:
    *   **ShadCN UI components.** These are generated and can be extended but typically contain the basic, styled building blocks (Button, Input, Card, Table, etc.).
*   `components/app/`:
    *   Application-specific components, further categorized by their function or module.
    *   `navigation/`: Sidebar, Topbar components.
    *   `charts/`: Recharts components wrapped for YouRank.ai's data visualization needs.
    *   `dashboard/`: Components specific to the main dashboard overview.
    *   `modules/`:
        *   Components tightly coupled to a specific module, but still reusable within that module's context (e.g., a `KeywordTable` for the `keywords` module, `SerpResultsCard` for the `serp` module).
    *   `common/`: Generic UI elements like `loading-spinner.tsx`, `toast-provider.tsx`, modal components.
    *   `auth/`: Components for authentication forms.

### 2.3 `src/lib/` - Libraries & Utilities

Houses utility functions, API clients, database interaction logic, and custom hooks. This is where the core business logic and external service integrations are defined.

*   `lib/api/`:
    *   Clients and wrappers for external APIs.
    *   `dataforseo.ts`: The DataForSEO API client, handling requests, retries, and error parsing.
    *   `openai.ts`: The OpenAI API client for AI features.
    *   `supabase.ts`: Supabase client instances (for both client-side and server-side/service role interactions).
    *   `google-auth.ts`: Configuration for Google OAuth 2.0 (for GA4, GSC integrations).
*   `lib/db/`:
    *   Database interaction functions using the Supabase client.
    *   `queries/`: Functions for specific CRUD operations on Supabase tables (e.g., `analyses.ts`, `credits.ts`).
    *   `schema.ts`: Zod schemas for input validation against database models.
*   `lib/utils/`:
    *   General utility functions.
    *   `auth.ts`: Authentication-related helpers (e.g., session validation).
    *   `date.ts`, `format.ts`: Date and data formatting utilities.
    *   `error-handler.ts`: **Centralized error handling logic for API routes**, ensuring consistent error responses and logging to Sentry, as described in `error_logging_monitoring`.
    *   `async-tasks.ts`: Logic for managing and interacting with the asynchronous task system (DataForSEO tasks).
*   `lib/hooks/`:
    *   Custom React hooks (e.g., `use-auth.ts`, `use-credits.ts` for real-time credit balance).
*   `lib/types/`:
    *   Global TypeScript type definitions.
    *   `api.d.ts`: Types for API request/response payloads.
    *   `db.d.ts`: TypeScript types generated from the Supabase database schema.
*   `lib/constants.ts`:
    *   Application-wide constants.

### 2.4 `src/styles/` - Stylesheets

*   `globals.css`: Global CSS styles, including Tailwind CSS imports.
*   `tailwind.css`: Generated Tailwind CSS utility classes.

### 2.5 `src/config/` - Application Configuration

Centralizes important application settings.

*   `modules.config.ts`:
    *   **Crucial for the modular design.** Defines available SEO modules, their routes, icons, and whether they are active or hidden, enabling feature flagging and staged rollouts (`timeline_milestones`).
*   `site.config.ts`:
    *   Site-wide metadata, branding information, and external links.
*   `credits.config.ts`:
    *   **Defines the credit costs for each analysis type**, as detailed in `billing_model_details`.

### 2.6 `src/contexts/` - React Context Providers

*   `auth-context.tsx`: Provides user authentication status globally.
*   `settings-context.tsx`: Provides application-wide settings (e.g., dark mode, language).

### 2.7 `src/services/` - Business Logic Services (Optional)

This directory is an optional layer for more complex business logic that might span multiple database queries or API calls, often used when `lib/db` or `lib/api` become too large.
*   `analysis-service.ts`: Handles the end-to-end flow of initiating, tracking, and processing an analysis.
*   `credit-service.ts`: Encapsulates credit deduction, top-up, and history management.

## 3. `supabase/` - Supabase Configuration

This directory manages the Supabase backend.

*   `migrations/`:
    *   SQL files for database schema migrations. These track all changes to the PostgreSQL database.
    *   `20231026100000_init.sql`: Initial schema setup (e.g., `users`, `analyses`, `user_credits` tables).
    *   `20231115143000_add_ai_tables.sql`: Example migration for adding AI-related tables.
*   `functions/`:
    *   Supabase Edge Functions (Deno-based serverless functions), used for specific backend logic that benefits from being closer to the database or for complex RPC calls.
    *   `deduct_credits.ts`: An example for a Supabase Edge Function to securely deduct user credits via an RPC call, as mentioned in `billing_model_details`.
*   `seed.sql`:
    *   SQL script to populate the database with initial data for development and testing environments.
*   `config.toml`:
    *   Supabase CLI configuration file.

## 4. `docs/` - Project Documentation

Houses comprehensive project documentation.

*   `architecture.md`: High-level overview of the application architecture.
*   `project-structure.md`: This document.
*   `api-reference.md`: Detailed documentation for internal and external API integrations.
*   `developer-guide.md`: Setup instructions, contribution guidelines.

## 5. `tests/` - Testing

Organized by test type, crucial for maintaining code quality and stability (`dev_workflow_environment`).

*   `unit/`: Unit tests for individual functions and components.
*   `integration/`: Integration tests for API routes and combined logic flows.
*   `e2e/`: End-to-end tests using Playwright.
    *   `playwright.config.ts`: Playwright configuration.
    *   `auth.spec.ts`: Example E2E test for authentication flow.

## 6. Root Level Configuration Files

*   `.env.local`, `.env.production`: Environment variables for different deployment environments (`dev_workflow_environment`).
*   `.eslintrc.json`: ESLint configuration for code linting.
*   `.gitignore`: Specifies intentionally untracked files to ignore.
*   `next.config.js`: Next.js specific configuration (e.g., image optimization, webpack customization).
*   `package.json`: Project metadata, scripts, and dependency declarations.
*   `pnpm-lock.yaml`: Lock file for `pnpm` dependencies.
*   `postcss.config.js`: PostCSS configuration, used by Tailwind CSS.
*   `prettier.config.js`: Prettier configuration for code formatting.
*   `tailwind.config.ts`: Tailwind CSS configuration (e.g., custom themes, colors, breakpoints), incorporating branding guidelines (`ui_ux_design_vision`).
*   `tsconfig.json`: TypeScript compiler configuration.
*   `README.md`: Project README file.

---

**Summary of Key Structural Elements:**

*   **App Router (`src/app/`)**: Organizes routes, layouts, and API endpoints by feature and authentication status.
*   **Modular Design**: Features like `keywords/`, `serp/`, `domain/` are independent modules with their own pages and potentially layouts, driven by `config/modules.config.ts`.
*   **API Proxies (`src/app/api/`)**: All external API calls (DataForSEO, OpenAI) are routed through Next.js API routes for security and server-side credit deduction.
*   **Supabase Integration (`supabase/` & `src/lib/db/`)**: Dedicated directories for database migrations, functions, and interaction logic.
*   **Centralized Utilities (`src/lib/utils/`)**: Shared helpers, including the global error handler (`error-handler.ts`).
*   **ShadCN UI (`src/components/ui/`)**: Provides a consistent and extendable UI component library.
*   **Configuration Files (`src/config/`)**: Central place for global settings, module definitions, and credit costs.

This structure allows YouRank.ai to be developed in phases (`timeline_milestones`), ensuring each module is stable and independently deployable, while providing a clear path for future integrations and scalability.

## Database Schema Design
# SCHEMADESIGN

This section outlines the database schema design for YouRank.ai, detailing the data models, relationships, and overall structure built on Supabase (PostgreSQL). The schema is designed for modularity, scalability, and GDPR compliance, supporting the core SEO analytics features, credit-based billing, user authentication, and future AI/integration expansions.

## 1. Core Principles

*   **Relational Model with JSONB Flexibility**: Primarily uses a relational structure with UUIDs as primary keys, enhanced by PostgreSQL's JSONB for storing flexible, schema-less API responses and configuration data.
*   **Row-Level Security (RLS)**: Crucial for multi-tenancy and data isolation. All sensitive tables will have RLS policies enforced, ensuring users can only access data they own or are authorized for within an organization.
*   **Scalability**: Optimized for high read/write volumes, especially for analysis results and API logs, with appropriate indexing strategies.
*   **Auditability**: Comprehensive logging for credit usage, API calls, and system events.

## 2. Entity-Relationship Diagram (Conceptual)

```
+------------+     +-------------------+     +-------------+     +------------------+
|   users    |-----|  organization_members |-----| organizations |-----| white_label_settings |
+------------+ 1:N +-------------------+ N:1 +-------------+ 1:1 +------------------+
     | 1:N              | 1:N               |
     |                  |                   |
     |                  |                   | 1:N
     |                  |                   +-----------------> +-------------+
     |                  |                   |                     |  projects   |
     | 1:1              |                   |                     +-------------+
     +-----------------> +-------------+   | 1:N                   | 1:N
                       | user_credits|   |                       |
                       +-------------+   |                       |
                             | 1:N         |                       |
                             +-----------------------------------+
                             | 1:N                               |
+----------------------+     |                                   |
| credit_transactions  |<----+                                   |
+----------------------+     |                                   |
                             | N:1                               | N:1
+----------------------+     |                                   |
| billing_subscriptions|<----+                                   |
+----------------------+     |                                   |
                             |                                   |
+----------------------+     |                                   |
| stripe_webhooks_log  |<----+                                   |
+----------------------+     |                                   |
                             | N:1                               |
+------------------+         |                                   |
|  analyses        |<--------------------------------------------+
+------------------+         | 1:N
     | 1:N                   |
     +-----------------------+----------------------------------+
     | 1:N                                                      |
+----------------+          +------------------------+          +-------------------------+
| ai_recommendations |        |   api_call_logs        |          | analytics_integrations  |
+----------------+          +------------------------+          +-------------------------+
                                                                         | 1:N
                                                                         |
                                               +------------------------+-------------------------+
                                               |                        |                         |
                                       +--------------------+    +---------------------------+
                                       | google_analytics_data |    | google_search_console_data|
                                       +--------------------+    +---------------------------+
```

## 3. Database Tables

### `users`

Stores user authentication and profile data. Inherits from Supabase's `auth.users` table for core authentication.

| Column Name      | Data Type                    | Constraints                                       | Description                                     |
| :--------------- | :--------------------------- | :------------------------------------------------ | :---------------------------------------------- |
| `id`             | `UUID`                       | `PRIMARY KEY`, `REFERENCES auth.users(id)`        | Unique identifier for the user.                 |
| `email`          | `TEXT`                       | `UNIQUE`, `NOT NULL`                              | User's email address.                           |
| `created_at`     | `TIMESTAMP WITH TIME ZONE`   | `DEFAULT NOW()`                                   | Timestamp when the user account was created.    |
| `name`           | `TEXT`                       | `NULLABLE`                                        | User's display name.                            |
| `last_login_at`  | `TIMESTAMP WITH TIME ZONE`   | `NULLABLE`                                        | Last login timestamp.                           |
| `organization_id`| `UUID`                       | `NULLABLE`, `REFERENCES organizations(id)`        | The default organization the user belongs to.   |

### `organizations`

Manages agencies or teams that can share projects and credits, supporting white-label features.

| Column Name         | Data Type                    | Constraints                                       | Description                                                                  |
| :------------------ | :--------------------------- | :------------------------------------------------ | :--------------------------------------------------------------------------- |
| `id`                | `UUID`                       | `PRIMARY KEY`, `DEFAULT gen_random_uuid()`        | Unique identifier for the organization.                                      |
| `name`              | `TEXT`                       | `NOT NULL`                                        | Name of the organization (e.g., "SEO Wizards Agency").                      |
| `owner_id`          | `UUID`                       | `NOT NULL`, `REFERENCES users(id)`                | The user who created and owns the organization.                              |
| `created_at`        | `TIMESTAMP WITH TIME ZONE`   | `DEFAULT NOW()`                                   | Timestamp when the organization was created.                                 |
| `updated_at`        | `TIMESTAMP WITH TIME ZONE`   | `DEFAULT NOW()`                                   | Last update timestamp.                                                       |
| `white_label_config`| `JSONB`                      | `NULLABLE`                                        | Stores white-label branding settings (logo, colors, domain) for custom UI.   |

### `organization_members`

Junction table defining which users belong to which organizations and their respective roles.

| Column Name     | Data Type                  | Constraints                               | Description                                                                 |
| :-------------- | :------------------------- | :---------------------------------------- | :-------------------------------------------------------------------------- |
| `organization_id` | `UUID`                     | `PRIMARY KEY`, `REFERENCES organizations(id)` | Foreign key to the `organizations` table.                                   |
| `user_id`       | `UUID`                     | `PRIMARY KEY`, `REFERENCES users(id)`     | Foreign key to the `users` table.                                           |
| `role`          | `TEXT`                     | `NOT NULL`                                | User's role within the organization (e.g., 'admin', 'editor', 'viewer').    |
| `joined_at`     | `TIMESTAMP WITH TIME ZONE` | `DEFAULT NOW()`                           | Timestamp when the user joined the organization.                            |

### `projects`

Allows users/organizations to group and manage their SEO efforts for specific domains or clients.

| Column Name     | Data Type                  | Constraints                                   | Description                                                               |
| :-------------- | :------------------------- | :-------------------------------------------- | :------------------------------------------------------------------------ |
| `id`            | `UUID`                     | `PRIMARY KEY`, `DEFAULT gen_random_uuid()`    | Unique identifier for the project.                                        |
| `organization_id` | `UUID`                     | `NULLABLE`, `REFERENCES organizations(id)`    | Optional: Organization to which the project belongs.                      |
| `user_id`       | `UUID`                     | `NOT NULL`, `REFERENCES users(id)`            | The individual user who owns the project (or created it within an org).   |
| `name`          | `TEXT`                     | `NOT NULL`                                    | Name of the project (e.g., "Client X Website Redesign").                 |
| `domain`        | `TEXT`                     | `NOT NULL`                                    | Primary domain associated with the project (e.g., "example.com").         |
| `created_at`    | `TIMESTAMP WITH TIME ZONE` | `DEFAULT NOW()`                               | Timestamp when the project was created.                                   |
| `updated_at`    | `TIMESTAMP WITH TIME ZONE` | `DEFAULT NOW()`                               | Last update timestamp.                                                    |
| `is_archived`   | `BOOLEAN`                  | `DEFAULT FALSE`                               | Flag to indicate if the project is archived (soft delete).                |

### `analyses`

Stores metadata and results for every SEO analysis performed by a user.

| Column Name       | Data Type                  | Constraints                                   | Description                                                               |
| :---------------- | :------------------------- | :-------------------------------------------- | :------------------------------------------------------------------------ |
| `id`              | `UUID`                     | `PRIMARY KEY`, `DEFAULT gen_random_uuid()`    | Unique identifier for the analysis.                                       |
| `user_id`         | `UUID`                     | `NOT NULL`, `REFERENCES users(id)`            | User who initiated the analysis.                                          |
| `project_id`      | `UUID`                     | `NULLABLE`, `REFERENCES projects(id)`         | Optional: Project to which this analysis belongs.                         |
| `type`            | `TEXT`                     | `NOT NULL`                                    | Type of analysis (e.g., 'keyword_overview', 'serp_analysis', 'onpage_audit', 'ai_recommendation'). |
| `input_params`    | `JSONB`                    | `NOT NULL`                                    | JSON object containing the input parameters for the analysis (e.g., keyword, location). |
| `raw_result`      | `JSONB`                    | `NULLABLE`                                    | Full, raw API response from DataForSEO, OpenAI, etc.                      |
| `processed_result`| `JSONB`                    | `NULLABLE`                                    | Normalized or simplified result for faster UI rendering.                  |
| `credits_used`    | `INTEGER`                  | `NOT NULL`                                    | Number of credits consumed for this analysis.                             |
| `status`          | `TEXT`                     | `DEFAULT 'pending'`                           | Current status of the analysis ('pending', 'processing', 'completed', 'failed'). |
| `created_at`      | `TIMESTAMP WITH TIME ZONE` | `DEFAULT NOW()`                               | Timestamp when the analysis was requested.                                |
| `completed_at`    | `TIMESTAMP WITH TIME ZONE` | `NULLABLE`                                    | Timestamp when the analysis was completed or failed.                      |
| `error_message`   | `TEXT`                     | `NULLABLE`                                    | Details of any error that occurred during the analysis.                   |

### `user_credits`

Tracks the current credit balance for each user.

| Column Name     | Data Type                  | Constraints                               | Description                                     |
| :-------------- | :------------------------- | :---------------------------------------- | :---------------------------------------------- |
| `user_id`       | `UUID`                     | `PRIMARY KEY`, `REFERENCES users(id)`     | User ID.                                        |
| `total_credits` | `INTEGER`                  | `NOT NULL`, `DEFAULT 0`                   | Current total available credits.                |
| `used_credits`  | `INTEGER`                  | `NOT NULL`, `DEFAULT 0`                   | Total credits consumed by the user over time.   |
| `last_updated`  | `TIMESTAMP WITH TIME ZONE` | `DEFAULT NOW()`                           | Timestamp of the last credit change.            |

### `credit_transactions`

Logs every credit movement (purchase, deduction, bonus) for auditing and user history.

| Column Name     | Data Type                  | Constraints                                   | Description                                                                 |
| :-------------- | :------------------------- | :-------------------------------------------- | :-------------------------------------------------------------------------- |
| `id`            | `UUID`                     | `PRIMARY KEY`, `DEFAULT gen_random_uuid()`    | Unique identifier for the transaction.                                      |
| `user_id`       | `UUID`                     | `NOT NULL`, `REFERENCES users(id)`            | User involved in the transaction.                                           |
| `amount`        | `INTEGER`                  | `NOT NULL`                                    | Amount of credits (positive for addition, negative for deduction).          |
| `type`          | `TEXT`                     | `NOT NULL`                                    | Type of transaction (e.g., 'purchase', 'analysis_deduction', 'bonus', 'refund'). |
| `reference_id`  | `UUID`                     | `NULLABLE`, `REFERENCES analyses(id)`         | Links to the `analyses` table for deductions, or `billing_subscriptions`/`stripe_webhooks_log` for purchases. |
| `description`   | `TEXT`                     | `NULLABLE`                                    | Human-readable description of the transaction.                              |
| `created_at`    | `TIMESTAMP WITH TIME ZONE` | `DEFAULT NOW()`                               | Timestamp of the transaction.                                               |

### `api_call_logs`

Detailed log of every external API call made (DataForSEO, OpenAI, Google APIs) for monitoring and debugging.

| Column Name       | Data Type                  | Constraints                                   | Description                                                                 |
| :---------------- | :------------------------- | :-------------------------------------------- | :-------------------------------------------------------------------------- |
| `id`              | `UUID`                     | `PRIMARY KEY`, `DEFAULT gen_random_uuid()`    | Unique identifier for the API call log.                                     |
| `user_id`         | `UUID`                     | `NULLABLE`, `REFERENCES users(id)`            | User who triggered the API call (if applicable).                            |
| `analysis_id`     | `UUID`                     | `NULLABLE`, `REFERENCES analyses(id)`         | Links to the parent analysis that initiated this API call.                  |
| `provider`        | `TEXT`                     | `NOT NULL`                                    | API provider (e.g., 'dataforseo', 'openai', 'google_analytics', 'google_search_console'). |
| `endpoint`        | `TEXT`                     | `NOT NULL`                                    | Specific API endpoint called (e.g., '/v3/keywords_data/google_ads/search_volume/live'). |
| `request_payload` | `JSONB`                    | `NULLABLE`                                    | JSON object of the parameters sent to the external API.                     |
| `response_payload`| `JSONB`                    | `NULLABLE`                                    | Raw JSON response received from the external API.                           |
| `status_code`     | `INTEGER`                  | `NULLABLE`                                    | HTTP status code of the API response.                                       |
| `credits_cost`    | `INTEGER`                  | `NULLABLE`                                    | Actual credits charged by the provider for this specific call.              |
| `duration_ms`     | `INTEGER`                  | `NULLABLE`                                    | Duration of the API call in milliseconds.                                   |
| `error_message`   | `TEXT`                     | `NULLABLE`                                    | Error message if the API call failed.                                       |
| `created_at`      | `TIMESTAMP WITH TIME ZONE` | `DEFAULT NOW()`                               | Timestamp of the API call.                                                  |

### `ai_recommendations`

Stores AI-generated content or insights based on user analyses.

| Column Name        | Data Type                  | Constraints                                   | Description                                                               |
| :----------------- | :------------------------- | :-------------------------------------------- | :------------------------------------------------------------------------ |
| `id`               | `UUID`                     | `PRIMARY KEY`, `DEFAULT gen_random_uuid()`    | Unique identifier for the AI recommendation.                              |
| `user_id`          | `UUID`                     | `NOT NULL`, `REFERENCES users(id)`            | User who requested the AI recommendation.                                 |
| `analysis_id`      | `UUID`                     | `NOT NULL`, `REFERENCES analyses(id)`         | The base analysis for which AI insights were generated.                   |
| `type`             | `TEXT`                     | `NOT NULL`                                    | Type of AI output (e.g., 'keyword_insights', 'content_optimization', 'meta_tag_generation'). |
| `input_data`       | `JSONB`                    | `NOT NULL`                                    | Data fed to the AI model.                                                 |
| `ai_response`      | `JSONB`                    | `NULLABLE`                                    | Raw response from the AI model (e.g., OpenAI API response).               |
| `generated_content`| `TEXT`                     | `NULLABLE`                                    | Cleaned, formatted AI-generated text or recommendation.                   |
| `credits_used`     | `INTEGER`                  | `NOT NULL`                                    | Credits consumed for this AI operation.                                   |
| `created_at`       | `TIMESTAMP WITH TIME ZONE` | `DEFAULT NOW()`                               | Timestamp of the AI generation.                                           |

### `analytics_integrations`

Stores OAuth tokens and configuration for Google Analytics and Google Search Console integrations.

| Column Name         | Data Type                  | Constraints                                   | Description                                                               |
| :------------------ | :------------------------- | :-------------------------------------------- | :------------------------------------------------------------------------ |
| `id`                | `UUID`                     | `PRIMARY KEY`, `DEFAULT gen_random_uuid()`    | Unique identifier for the integration.                                    |
| `user_id`           | `UUID`                     | `NOT NULL`, `REFERENCES users(id)`            | User who authorized the integration.                                      |
| `project_id`        | `UUID`                     | `NOT NULL`, `REFERENCES projects(id)`         | Project associated with this integration.                                 |
| `provider`          | `TEXT`                     | `NOT NULL`                                    | External analytics provider ('google_analytics', 'google_search_console'). |
| `auth_token_encrypted`| `TEXT`                     | `NOT NULL`                                    | Encrypted OAuth access token.                                             |
| `refresh_token_encrypted`| `TEXT`                     | `NOT NULL`                                    | Encrypted OAuth refresh token.                                            |
| `external_account_id`| `TEXT`                     | `NOT NULL`                                    | External account ID (e.g., GA4 Property ID, GSC site URL).                |
| `status`            | `TEXT`                     | `DEFAULT 'connected'`                         | Current status of the integration ('connected', 'disconnected', 'error'). |
| `created_at`        | `TIMESTAMP WITH TIME ZONE` | `DEFAULT NOW()`                               | Timestamp when the integration was created.                               |
| `updated_at`        | `TIMESTAMP WITH TIME ZONE` | `DEFAULT NOW()`                               | Last update timestamp.                                                    |

### `google_analytics_data`

Stores retrieved data from Google Analytics 4 for reporting and comparison.

| Column Name     | Data Type                  | Constraints                                   | Description                                                           |
| :-------------- | :------------------------- | :-------------------------------------------- | :-------------------------------------------------------------------- |
| `id`            | `UUID`                     | `PRIMARY KEY`, `DEFAULT gen_random_uuid()`    | Unique identifier for the data record.                                |
| `integration_id`| `UUID`                     | `NOT NULL`, `REFERENCES analytics_integrations(id)` | Foreign key to the analytics integration.                             |
| `project_id`    | `UUID`                     | `NOT NULL`, `REFERENCES projects(id)`         | Project to which this data belongs.                                   |
| `date`          | `DATE`                     | `NOT NULL`                                    | Date of the analytics data.                                           |
| `metric_type`   | `TEXT`                     | `NOT NULL`                                    | Type of metric (e.g., 'sessions', 'users', 'bounceRate', 'pageViews', 'conversions'). |
| `value`         | `DECIMAL`                  | `NOT NULL`                                    | Numeric value of the metric.                                          |
| `dimensions`    | `JSONB`                    | `NULLABLE`                                    | JSON object for dimensions (e.g., `{"pagePath": "/blog/post", "device": "mobile"}`). |
| `created_at`    | `TIMESTAMP WITH TIME ZONE` | `DEFAULT NOW()`                               | Timestamp when the data was fetched and stored.                       |

### `google_search_console_data`

Stores retrieved data from Google Search Console for performance analysis.

| Column Name     | Data Type                  | Constraints                                   | Description                                                               |
| :-------------- | :------------------------- | :-------------------------------------------- | :------------------------------------------------------------------------ |
| `id`            | `UUID`                     | `PRIMARY KEY`, `DEFAULT gen_random_uuid()`    | Unique identifier for the data record.                                    |
| `integration_id`| `UUID`                     | `NOT NULL`, `REFERENCES analytics_integrations(id)` | Foreign key to the analytics integration.                             |
| `project_id`    | `UUID`                     | `NOT NULL`, `REFERENCES projects(id)`         | Project to which this data belongs.                                   |
| `date`          | `DATE`                     | `NOT NULL`                                    | Date of the GSC data.                                                     |
| `query`         | `TEXT`                     | `NOT NULL`                                    | Search query.                                                             |
| `page`          | `TEXT`                     | `NOT NULL`                                    | Landing page URL.                                                         |
| `clicks`        | `INTEGER`                  | `NOT NULL`                                    | Number of clicks.                                                         |
| `impressions`   | `INTEGER`                  | `NOT NULL`                                    | Number of impressions.                                                    |
| `ctr`           | `DECIMAL`                  | `NOT NULL`                                    | Click-through rate.                                                       |
| `position`      | `DECIMAL`                  | `NOT NULL`                                    | Average position in SERP.                                                 |
| `device`        | `TEXT`                     | `NULLABLE`                                    | Device type (e.g., 'desktop', 'mobile').                                  |
| `country`       | `TEXT`                     | `NULLABLE`                                    | Country of origin for the search.                                         |
| `created_at`    | `TIMESTAMP WITH TIME ZONE` | `DEFAULT NOW()`                               | Timestamp when the data was fetched and stored.                           |

### `white_label_settings`

Configuration for white-label branding, linked to organizations.

| Column Name       | Data Type                  | Constraints                                   | Description                                                               |
| :---------------- | :------------------------- | :-------------------------------------------- | :------------------------------------------------------------------------ |
| `organization_id` | `UUID`                     | `PRIMARY KEY`, `REFERENCES organizations(id)` | Foreign key to the organization.                                          |
| `logo_url`        | `TEXT`                     | `NULLABLE`                                    | URL for the custom logo.                                                  |
| `primary_color`   | `TEXT`                     | `NULLABLE`                                    | Hex code for the primary brand color.                                     |
| `secondary_color` | `TEXT`                     | `NULLABLE`                                    | Hex code for the secondary brand color.                                   |
| `custom_domain`   | `TEXT`                     | `NULLABLE`, `UNIQUE`                          | Custom domain for white-label access (e.g., "seo.client-agency.com").    |
| `cname_verified`  | `BOOLEAN`                  | `DEFAULT FALSE`                               | Indicates if the custom domain's CNAME record has been verified.          |
| `updated_at`      | `TIMESTAMP WITH TIME ZONE` | `DEFAULT NOW()`                               | Last update timestamp.                                                    |

### `billing_subscriptions`

Manages user subscriptions to recurring credit plans.

| Column Name             | Data Type                  | Constraints                               | Description                                                                 |
| :---------------------- | :------------------------- | :---------------------------------------- | :-------------------------------------------------------------------------- |
| `id`                    | `UUID`                     | `PRIMARY KEY`, `DEFAULT gen_random_uuid()`| Unique identifier for the subscription.                                     |
| `user_id`               | `UUID`                     | `NOT NULL`, `REFERENCES users(id)`        | User associated with the subscription.                                      |
| `stripe_subscription_id`| `TEXT`                     | `UNIQUE`, `NOT NULL`                      | Unique ID for the subscription in Stripe.                                   |
| `plan_name`             | `TEXT`                     | `NOT NULL`                                | Name of the subscription plan (e.g., 'Pro', 'Agency').                      |
| `status`                | `TEXT`                     | `NOT NULL`                                | Current status ('active', 'canceled', 'past_due', 'trialing').            |
| `current_period_start`  | `TIMESTAMP WITH TIME ZONE` | `NOT NULL`                                | Start of the current billing period.                                        |
| `current_period_end`    | `TIMESTAMP WITH TIME ZONE` | `NOT NULL`                                | End of the current billing period.                                          |
| `credits_included_monthly`| `INTEGER`                  | `NOT NULL`                                | Number of credits included monthly with the subscription.                   |
| `created_at`            | `TIMESTAMP WITH TIME ZONE` | `DEFAULT NOW()`                           | Timestamp when the subscription was created.                                |
| `updated_at`            | `TIMESTAMP WITH TIME ZONE` | `DEFAULT NOW()`                           | Last update timestamp.                                                      |

### `stripe_webhooks_log`

Logs all incoming Stripe webhook events for processing and auditing.

| Column Name     | Data Type                  | Constraints                                   | Description                                                               |
| :-------------- | :------------------------- | :-------------------------------------------- | :------------------------------------------------------------------------ |
| `id`            | `UUID`                     | `PRIMARY KEY`, `DEFAULT gen_random_uuid()`    | Unique identifier for the webhook log entry.                              |
| `event_id`      | `TEXT`                     | `UNIQUE`, `NOT NULL`                          | Unique ID from Stripe for the event.                                      |
| `event_type`    | `TEXT`                     | `NOT NULL`                                    | Type of Stripe event (e.g., 'checkout.session.completed', 'invoice.paid'). |
| `payload`       | `JSONB`                    | `NOT NULL`                                    | Full JSON payload received from Stripe webhook.                           |
| `processed_at`  | `TIMESTAMP WITH TIME ZONE` | `NULLABLE`                                    | Timestamp when the webhook was successfully processed by YouRank.ai.      |
| `status`        | `TEXT`                     | `DEFAULT 'pending'`                           | Processing status ('pending', 'processed', 'failed').                     |
| `created_at`    | `TIMESTAMP WITH TIME ZONE` | `DEFAULT NOW()`                               | Timestamp when the webhook was received.                                  |

## 4. Row-Level Security (RLS) Policies

All tables handling user-specific or organization-specific data will have RLS policies enabled.

*   **`users`**: Publicly accessible profile data is minimal; sensitive data is only accessible by `auth.uid()`.
*   **`organizations`**: Owners and members can view/update their organization's details based on their `role` in `organization_members`.
*   **`organization_members`**: Users can only see their own memberships. Admins of an organization can manage members within their organization.
*   **`projects`**: Users can access projects they own (`user_id = auth.uid()`) or projects belonging to an organization they are a member of (`organization_id IN (SELECT organization_id FROM organization_members WHERE user_id = auth.uid())`).
*   **`analyses`**: Users can only read/write their own analyses (`user_id = auth.uid()`) or analyses within projects they have access to.
*   **`user_credits`**: Only the user can view/update their own credit balance (`user_id = auth.uid()`). Credit deductions are handled by secure backend functions.
*   **`credit_transactions`**: Users can only view their own credit transaction history.
*   **`api_call_logs`**: Access restricted to `user_id` or `organization_id` if the `analysis_id` belongs to an accessible analysis.
*   **`ai_recommendations`**: Restricted by `user_id` or `analysis_id` access.
*   **`analytics_integrations`**: Only the `user_id` who created the integration can access their credentials.
*   **`google_analytics_data`, `google_search_console_data`**: Restricted by `user_id` or `project_id` access.
*   **`white_label_settings`**: Accessible by `organization_id` admins only.
*   **`billing_subscriptions`, `stripe_webhooks_log`**: Restricted to `user_id` for subscriptions, and primarily backend-managed for webhook logs with limited admin visibility.

## 5. Indexing Strategy

To optimize query performance for common access patterns, the following indexes will be created:

*   **Foreign Keys**: Automatically indexed by PostgreSQL, but explicit indexes will be added for clarity.
*   **`created_at` / `updated_at`**: For time-based queries and sorting.
*   **`status`**: For quickly filtering tasks or items by their current state (e.g., 'pending', 'completed').
*   **`type`**: For filtering analyses or AI recommendations by their specific functionality.
*   **`JSONB` Columns**: `GIN` indexes will be used on `JSONB` columns (`raw_result`, `input_params`, `processed_result`, `dimensions`, `payload`) when querying specific keys within the JSON data, optimizing search capabilities without requiring full-text search.
    *   Example: `CREATE INDEX idx_analyses_raw_result_gin ON analyses USING GIN (raw_result);`
*   **Unique Constraints**: Ensured for critical columns like `email`, `stripe_subscription_id`, `custom_domain`.

## 6. Supabase Functions (RPC)

For secure and atomic operations, especially credit management and sensitive data processing, PostgreSQL functions (RPC calls via Supabase) will be used.

*   `deduct_user_credits(user_id UUID, credits_needed INTEGER)`: Atomically deducts credits and logs the transaction.
*   `add_user_credits(user_id UUID, amount INTEGER, type TEXT, reference_id UUID)`: Adds credits to a user's balance.
*   `get_user_available_credits(user_id UUID)`: Retrieves current credit balance for RLS-protected read.

## 7. Data Archiving Strategy

To manage database size and performance, particularly for large `JSONB` columns, a data archiving strategy will be implemented for older, less frequently accessed raw data:

*   **Raw API Responses (`analyses.raw_result`, `api_call_logs.response_payload`)**: After 90 days, raw results and detailed API responses will be moved to a separate "cold storage" table (or Supabase Storage for JSON files) or truncated, with only key metadata retained in the primary tables.
*   **Aggregated Data**: Frequently accessed aggregated metrics (e.g., daily unique visitors from GA) will be stored in dedicated tables (`google_analytics_data`, `google_search_console_data`) to avoid re-querying large raw datasets.

## 8. GDPR Compliance Considerations

*   **Data Residency**: All Supabase data will be hosted in the EU (Frankfurt region).
*   **Pseudonymization**: User-specific data in logs (`api_call_logs`, `frontend_logs`) will rely on `user_id` rather than directly identifiable information like email.
*   **Encryption**: Sensitive API tokens (e.g., for Google Analytics) will be stored encrypted at rest within the database.
*   **Data Minimization**: Only necessary data will be stored, and excessive logging of sensitive details will be avoided.
*   **Consent**: For Google Analytics/Search Console integrations, explicit user consent will be obtained via OAuth 2.0.

## User Flow
USERFLOW

YouRank CRM: User Flow Document

This document outlines the key user journeys, interactions, and system behaviors within YouRank.ai. It details how users will navigate the application, interact with its core features, and the expected system responses, informed by the project's UI/UX vision, core features, and technical architecture.

1.  GLOBAL APPLICATION USER FLOWS

    1.1. User Onboarding & Authentication
        Purpose: Enable new users to sign up, log in, and existing users to access their accounts securely.
        Triggers: New user arriving at YouRank.ai homepage, existing user accessing the application.

        Flow:
        1.  User navigates to YouRank.ai.
        2.  System presents a login/signup screen.
        3.  **[SIGNUP]** User clicks "Sign Up" -> Enters email, password (or uses Google SSO).
            *   Supabase Auth handles registration.
            *   System provisions initial 25-50 free credits (Phase 4: Trial Credits).
            *   User is redirected to the Dashboard.
        4.  **[LOGIN]** User clicks "Log In" -> Enters email, password (or uses Google SSO).
            *   Supabase Auth validates credentials.
            *   User is redirected to the Dashboard.
        5.  **[PASSWORD RESET]** User clicks "Forgot Password" -> Enters email -> Receives password reset link via email.
            *   Supabase Auth handles the reset process.
        Wireframe Description (Login/Signup Screen):
        *   Centralized form for email/password.
        *   Prominent "Sign Up" and "Log In" buttons.
        *   "Forgot Password?" link.
        *   Google SSO button (with YouRank.ai branding).
        *   YouRank.ai logo and tagline "Smarter SEO Intelligence".

    1.2. Dashboard Overview (Multi-Module Snapshot)
        Purpose: Provide a unified, high-level view of a user's SEO health and key metrics across all active projects and modules.
        Triggers: Successful login, clicking "Dashboard" in sidebar.

        Flow:
        1.  User logs in or navigates to the Dashboard.
        2.  System fetches data for active projects/modules (Keyword Performance, Domain Traffic, SERP changes).
            *   Real-time updates from Supabase via subscriptions if possible (or efficient fetching).
        3.  Dashboard displays key metrics in a card-based layout (ShadCN + Tailwind).
        4.  User can toggle between "Overview by Project" and "Overview by Module" to change the data context.
        5.  User can click "Add-to-Report" on any widget to initiate a custom report generation (future Phase 4).
        6.  User sees a global credit balance indicator in the sticky topbar.
        Wireframe Description (Dashboard):
        *   **Sidebar Navigation (Persistent):** "Dashboard", "Keywords", "SERP", "Domain" (Phase 1), "Backlinks", "On-Page" (future), "AI Tools" (future).
        *   **Sticky Topbar:** YouRank.ai logo, Project Switcher (Dropdown), Search Field, Credit Balance (e.g., "Credits: 254 / 500 🔋"), User Profile Dropdown.
        *   **Main Content Area (Card-based grid):**
            *   "Project Performance Summary" card (e.g., Overall Visibility, Top 5 Keywords, Traffic Trend).
            *   "Latest Analyses" card (list of recent tasks with status icons).
            *   "Keyword Health" card (Avg. KD, Top Search Volume).
            *   "Domain Overview" card (Estimated Traffic, Top Competitor).
            *   Optional: "Credit Usage This Month" chart.
        Interaction Patterns:
        *   Card widgets should be clickable, leading to the respective module with pre-filtered data.
        *   Hovering over data points in charts shows tooltips.
        *   Skeleton loaders for async data fetching.

    1.3. Global Navigation & Project Switching
        Purpose: Allow users to seamlessly switch between different SEO modules and client projects.
        Triggers: User wants to access a specific tool or change the active project context.

        Flow:
        1.  User clicks on a module in the persistent sidebar navigation (e.g., "Keywords", "SERP").
            *   UI transitions to the selected module, displaying its main page.
            *   Breadcrumbs update (`Dashboard > Keywords`).
        2.  User clicks the Project Switcher dropdown in the sticky topbar (like Linear.app style).
        3.  User selects a different project from the list.
            *   System loads data specific to the chosen project across all modules.
            *   Dashboard and module views update to reflect the new project context.
        4.  User can access "Latest Analyses" via an optional quick-view modal (from topbar or dashboard).
        Wireframe Description (Global):
        *   Sidebar: Collapsible groups for modules.
        *   Topbar: Global project switcher (dropdown next to logo), Search.
        *   Breadcrumbs: Dynamic, showing `Dashboard > Project Name > Module Name > Tool Name`.
        Interaction Patterns:
        *   Smooth page transitions.
        *   Breadcrumbs are clickable to navigate back.
        *   Project switcher shows active project and a list of others.

2.  MODULE-SPECIFIC USER FLOWS (PHASE 1 CORE MVP)

    2.1. Keyword Research Workflow
        Purpose: Discover, evaluate, and prioritize keywords.
        Triggers: User clicks "Keywords" in the sidebar, or clicks a "Keyword" related widget on the Dashboard.

        Flow:
        1.  User navigates to the "Keywords" module.
        2.  System presents a prominent search field for keyword input.
        3.  User enters a seed keyword (e.g., "SEO tools") and clicks "Analyze".
        4.  **[CREDIT CHECK]** System initiates `deduct_user_credits` RPC call with `credits_needed` (e.g., 3 credits for Keyword Overview).
            *   If sufficient: Credits deducted.
            *   If insufficient: System displays "Insufficient credits" toast and redirects to "Top Up" page.
        5.  System sends API requests to DataForSEO (e.g., `/v3/keywords_data/google_ads/search_volume/live`, `/v3/keywords_data/google_ads/keywords_for_keywords/live`).
            *   An entry is created in the `analyses` table with `status: 'pending'`.
        6.  While processing, UI displays skeleton loaders for each tab.
        7.  Data progressively loads into tabbed sections:
            *   **Overview:** Search Volume, CPC, Keyword Difficulty, Competition, Trend (Recharts line graph).
            *   **Keyword Ideas:** List of related keywords, suggestions with metrics.
            *   **Related Keywords:** Keywords semantically related to the seed.
            *   **Difficulty:** Detailed breakdown of keyword difficulty score.
            *   **Trends:** Historical search volume data (12-24 months).
        8.  `analyses.status` updates to `completed` upon successful data retrieval and storage (Supabase JSONB).
        9.  User can:
            *   Filter, sort, and search within each data table.
            *   Toggle between table view and chart view.
            *   Export data (CSV, JSON) from individual tabs.
            *   Pin specific metrics for quick reference.
        10. Previous keyword queries are saved (Supabase, `keyword_history` table) for easy re-access.
        Wireframe Description (Keywords Module):
        *   **Main Area:**
            *   **Top Filters/Input:** Large search bar for keyword, country/language selectors.
            *   **Tabs:** "Overview", "Keyword Ideas", "Related Keywords", "Difficulty", "Trends".
            *   **Content per tab:**
                *   Tables with sortable columns, inline mini-charts.
                *   Recharts graphs for trends and distributions.
                *   Loading skeletons appear immediately upon tab/data load.
                *   Export buttons (CSV, JSON) per data section.
        Interaction Patterns:
        *   Asynchronous loading of tabs (no full-page reloads).
        *   Each data table includes inline charts, filters, and sorting.
        *   Search field persists recent queries.

    2.2. SERP Analysis Workflow
        Purpose: Analyze search engine result pages for ranking insights.
        Triggers: User clicks "SERP Analysis" in sidebar, or link from Keyword Overview.

        Flow:
        1.  User navigates to the "SERP Analysis" module.
        2.  User enters a keyword (and optional location/language) into the search field and clicks "Analyze".
        3.  **[CREDIT CHECK]** System checks and deducts credits (e.g., 2 credits).
        4.  System calls DataForSEO `/v3/serp/google/organic/live` API.
            *   `analyses` entry created with `status: 'pending'`.
        5.  UI displays loading skeleton while data is fetched.
        6.  Results load, showing:
            *   Top 10 organic results (URL, Title, Meta Description, Rank Position, Domain Authority).
            *   Featured Snippets detection.
            *   People Also Ask (PAA) section.
            *   Local Pack detection (if applicable).
        7.  User can filter results, view changes over time (SERP Volatility - future).
        Wireframe Description (SERP Analysis Module):
        *   **Top Filters/Input:** Search bar for keyword, location/language.
        *   **Main Content:**
            *   Overview section for keyword + SERP features.
            *   List of organic results (URL, title, snippet, position, other metrics).
            *   Dedicated sections for Featured Snippet and PAA if found.
            *   Table with filters and export options.
        Interaction Patterns:
        *   Results are displayed in a clear, sortable list.
        *   Visual indicators for different SERP features.

    2.3. Domain Analytics Workflow
        Purpose: Get an overview of a domain's organic performance.
        Triggers: User clicks "Domain Analytics" in sidebar, or link from Dashboard/SERP.

        Flow:
        1.  User navigates to the "Domain Analytics" module.
        2.  User enters a domain (e.g., "semrush.com") into the search field and clicks "Analyze".
        3.  **[CREDIT CHECK]** System checks and deducts credits (e.g., 3 credits).
        4.  System calls DataForSEO `/v3/domain_analytics/overview/live` API.
            *   `analyses` entry created with `status: 'pending'`.
        5.  UI displays loading skeleton.
        6.  Results load, showing:
            *   Estimated Organic Traffic (graph).
            *   Total Ranking Keywords.
            *   Domain Visibility Index.
            *   Top Competitors by Overlapping Keywords (list).
            *   Top Pages by Traffic (list).
            *   Traffic trends over time.
        7.  User can explore detailed views of ranking keywords or top pages.
        Wireframe Description (Domain Analytics Module):
        *   **Top Filters/Input:** Search bar for domain.
        *   **Main Content:**
            *   Overview cards (Traffic, Keywords, Visibility).
            *   Recharts graphs for Traffic Trend.
            *   Tables for Top Competitors and Top Pages (with metrics, filters).
        Interaction Patterns:
        *   Clicking on a competitor or top page link could navigate to a new analysis with that entity.

3.  CREDIT MANAGEMENT USER FLOWS

    3.1. Viewing Credit Balance & History
        Purpose: Provide transparency on credit usage and remaining balance.
        Triggers: Any page view (for balance), clicking on credit indicator or "Billing" in user dropdown.

        Flow:
        1.  User sees their current credit balance in the sticky topbar (e.g., "Credits: 254 / 500 🔋").
        2.  User clicks the credit balance -> System navigates to the "Billing" or "Credit Management" page.
        3.  Page displays:
            *   Larger credit counter.
            *   Monthly usage chart (Recharts line graph) showing consumption over time.
            *   Detailed history table: Date, Tool, Credits Used, Status, Duration.
        4.  System provides notifications when credits are low (e.g., <20% remaining) via toast.
        Wireframe Description (Credit Management Page):
        *   **Header:** "Credit Management" or "Billing".
        *   **Section 1: Current Balance:** Large number for `total_credits`.
        *   **Section 2: Usage Chart:** Line graph showing `used_credits` over time.
        *   **Section 3: History Table:**
            *   Columns: Date, Tool, Credits Used, Status, Duration.
            *   Filters for date range, tool, status.
            *   Export option.
        Interaction Patterns:
        *   Real-time updates to credit balance.
        *   Color-coded status for analyses in history table (🟢 completed, 🔴 failed).

    3.2. Purchasing Credits
        Purpose: Allow users to acquire more credits to continue using the platform.
        Triggers: User runs out of credits, clicks "Top Up" button/link.

        Flow:
        1.  User's credit balance is low or zero.
        2.  System displays a "Insufficient credits" toast or notification.
        3.  User clicks "Top Up Credits" button/link (on notification or Credit Management page).
        4.  System redirects to the "Credit Packages" page.
        5.  Page displays various credit packages (e.g., 100, 500, 1000 credits).
        6.  User selects a package -> Clicks "Buy Now".
        7.  System initiates a Stripe Checkout session.
        8.  User completes payment via Stripe.
        9.  Upon successful payment, Stripe webhook notifies Supabase.
            *   Supabase `user_credits` table is updated (`total_credits` increased).
            *   `credit_transactions` entry created.
        10. User is redirected back to YouRank.ai, sees updated credit balance.
        Wireframe Description (Credit Packages Page):
        *   **Header:** "Top Up Credits".
        *   **Content:**
            *   List of credit packages with prices.
            *   "Buy Now" button for each.
            *   (Future Phase 4) Options for subscription tiers.
            *   "Trial Credits" info.
        Interaction Patterns:
        *   Clear pricing and credit amounts.
        *   Seamless integration with Stripe for payment.

4.  ASYNCHRONOUS TASK MANAGEMENT

    Purpose: Manage long-running data analysis requests (e.g., On-page Audits, large batch keyword analysis).
    Triggers: User initiates an analysis that requires extended processing time.

    Flow:
    1.  User initiates a complex analysis (e.g., uploading a CSV for Bulk Keyword Analysis, or an On-page Audit).
    2.  **[CREDIT CHECK]** System checks/deducts credits.
    3.  System creates an entry in `analyses` table with `status: 'pending'`.
    4.  System queues an asynchronous task (e.g., via Supabase Edge Function or n8n).
    5.  UI immediately shows a "Task Initiated" toast and redirects to the "My Analyses" (or "Task Queue") page.
    6.  On the "My Analyses" page:
        *   The new task appears with `status: 'pending'` (🟡 yellow chip).
        *   User can refresh the page or rely on real-time updates (if implemented).
    7.  Backend processing for the task begins (`status: 'processing'` - optional step).
        *   Multiple DataForSEO API calls are made in the background.
        *   Partial results might be stored.
    8.  Upon task completion or failure:
        *   `analyses.status` updates to `completed` (🟢 green chip) or `failed` (🔴 red chip).
        *   `analyses.result` (JSONB) is updated with the full API response.
        *   User receives an in-app notification/toast "Analysis Completed: [Task Name]".
    9.  User can click on a completed task to view its detailed results page.
    10. If a task `failed`, user can click to see error details and retry (if appropriate).
    Wireframe Description ("My Analyses" Page):
    *   **Header:** "My Analyses" or "Task Queue".
    *   **Content:**
        *   Filter options (Category, Status, Date Range).
        *   Search bar for task name/keyword.
        *   Table of analyses:
            *   Columns: Task Name, Module, Input, Status (color-coded chip), Credits Used, Date, Actions (View Results, Export, Delete, Retry).
        *   On hover over a task, an inline preview of key results might appear (Phase 4).
    Interaction Patterns:
    *   Visual status indicators (🟡, 🟢, 🔴).
    *   Clickable rows to view full results.
    *   Asynchronous updates of task status without full page reloads.

5.  FUTURE / ADVANCED USER FLOWS (PHASE 2+)

    5.1. AI-Powered Recommendations Workflow (Phase 2)
        Purpose: Generate actionable SEO insights and content suggestions using OpenAI.
        Triggers: User clicks "AI Tools" in sidebar, or "Generate AI Insight" button on a module's results page.

        Flow:
        1.  User navigates to an analysis result (e.g., Keyword Overview for "SEO tools").
        2.  User clicks "Generate AI Insights" button.
        3.  **[CREDIT CHECK]** System checks/deducts credits (e.g., 2 credits for AI analysis).
        4.  System sends relevant SEO data (keyword, SERP results, etc.) to OpenAI API via secure backend.
        5.  UI displays a loading indicator (e.g., "AI is generating insights...").
        6.  OpenAI processes the request.
            *   If timeout or error: System displays an error toast.
        7.  Upon receiving OpenAI response, system stores it in `ai_recommendations` table.
        8.  AI-generated insights (e.g., "Keyword Briefing", "Content Gaps", "Title Ideas") are displayed in a dedicated section (e.g., a card or tab).
        9.  User can copy the suggestions or use them for further actions (e.g., "Send to Content Generator").
        Wireframe Description (AI Insights Section):
        *   Integrated into module results pages, or a dedicated AI Tools module.
        *   Output displayed as formatted text (Markdown), often in cards or a dedicated tab.
        *   "Copy to Clipboard" buttons for generated text.

    5.2. Google Analytics & Search Console Integration (Phase 3)
        Purpose: Connect external Google data to YouRank.ai for combined analysis.
        Triggers: User accesses "Integrations" section in settings, or clicks a prompt to connect Google services.

        Flow:
        1.  User navigates to "Settings" -> "Integrations".
        2.  User sees options to "Connect Google Analytics" and "Connect Google Search Console".
        3.  User clicks "Connect Google Analytics".
        4.  System initiates OAuth 2.0 flow, redirecting user to Google's authorization page.
        5.  User logs into their Google account and grants YouRank.ai read-only permissions for GA4 properties.
        6.  Google redirects user back to YouRank.ai.
        7.  System fetches a list of available GA4 properties.
        8.  User selects the GA4 property to integrate with their YouRank.ai project.
        9.  System begins daily synchronization of GA4 data (Traffic, Pages, Conversions) via Supabase Edge Function.
        10. Integrated GA4 data becomes visible in YouRank.ai Dashboard and dedicated reports (e.g., "Traffic vs. Rankings" comparison view).
        Flow is similar for GSC integration.
        Wireframe Description (Integrations Page):
        *   **Header:** "Integrations & API".
        *   **Sections:**
            *   "Google Services": "Google Analytics (GA4) - [Connect / Connected]", "Google Search Console - [Connect / Connected]".
            *   "API Keys": Section for generating API keys (Phase 4).
        Interaction Patterns:
        *   Clear "Connect" / "Disconnect" states.
        *   OAuth 2.0 redirection for secure external service linking.

    5.3. Team Management & White-Labeling (Phase 4)
        Purpose: Allow agencies to manage team members and brand YouRank.ai for their clients.
        Triggers: Admin user accesses "Team Settings" or "Branding" in settings.

        Flow (Team Management):
        1.  Admin user navigates to "Settings" -> "Team Management".
        2.  Admin sees a list of current team members.
        3.  Admin clicks "Invite New Member" -> Enters email, selects role (Admin, Editor, Viewer).
        4.  System sends an invitation email (Supabase Auth).
        5.  Invited user accepts -> Account is added to the team, roles enforced via RLS.
        Flow (White-Labeling):
        1.  Admin user navigates to "Settings" -> "Branding".
        2.  Admin uploads client logo, sets primary/secondary colors, defines custom domain.
        3.  System saves branding settings (Supabase storage for logo, database for colors/domain).
        4.  Changes are applied immediately or after a short propagation period for custom domains.
        Wireframe Description (Team Management Page):
        *   **Header:** "Team Management".
        *   **Content:**
            *   Table of team members: Name, Email, Role, Last Activity, Actions (Edit Role, Remove).
            *   "Invite New Member" button.
        Wireframe Description (Branding Page):
        *   **Header:** "White-Label Branding".
        *   **Content:**
            *   Logo upload field.
            *   Color pickers for Primary, Secondary accents.
            *   Input field for Custom Domain.
            *   "Save Changes" button.

6.  ERROR HANDLING USER EXPERIENCE

    Purpose: Provide clear, user-friendly feedback when errors occur, and guide users to resolution.
    Triggers: API call failure, network issue, backend error, credit shortage.

    Flow:
    1.  **[CREDIT ERROR]** User initiates analysis without enough credits.
        *   System immediately displays a red `Toast` notification: "Insufficient Credits. Please top up to continue."
        *   A "Top Up" button may be included in the toast or user is redirected to the "Credit Packages" page.
    2.  **[API INTEGRATION ERROR]** DataForSEO/OpenAI API request fails (e.g., timeout, rate limit).
        *   Backend attempts automatic retries (max 3 times).
        *   If retries fail: `analyses.status` updates to `failed` (🔴 red chip).
        *   User receives a `Toast` notification: "Analysis Failed: [Task Name]. Please try again later."
        *   On "My Analyses" page, user can click to view error details (e.g., "DataForSEO API returned status 500").
    3.  **[FRONTEND COMPONENT ERROR]** An unhandled error occurs within a UI component.
        *   Next.js `error.tsx` boundary catches the error.
        *   User sees a fallback UI (e.g., "Oops! Something went wrong here.") instead of a blank page/crash.
        *   The error is logged to Sentry silently.
    4.  **[NETWORK ERROR]** User loses internet connectivity.
        *   UI might display a subtle persistent banner: "You are offline. Data might be outdated."
        *   API requests will fail, leading to relevant error toasts.
    Interaction Patterns:
    *   Error messages are clear, concise, and actionable (if possible).
    *   System provides contextual information (e.g., which API failed, specific error code if safe to show).
    *   Visual cues (red toasts, red status chips) indicate negative outcomes.

This comprehensive user flow document covers the core interactions for YouRank.ai, from initial login to advanced features and error handling, ensuring a clear understanding of the user experience and system behavior.

## Internationalization (i18n) Guidelines

### Multi-Language Support Implementation

YouRank.ai implements comprehensive internationalization using `next-intl` for Next.js 15 App Router, supporting multiple languages with automatic detection and manual switching capabilities.

#### Supported Languages
- **Primary**: Deutsch (DE) - Default language
- **Secondary**: Englisch (EN) - Full implementation
- **Prepared**: Spanisch (ES), Französisch (FR) - Structure ready for future implementation

#### Technical Implementation
- **Library**: `next-intl` v3.x for Next.js 15 App Router compatibility
- **Routing**: All pages wrapped in `[locale]` folder structure
- **Detection**: Automatic browser language detection with manual override
- **Persistence**: User language preference stored in database and cookies
- **Type Safety**: Full TypeScript support for translation keys

#### Translation File Structure
```
messages/
├── de.json          # German translations (primary)
├── en.json          # English translations
├── es.json          # Spanish (prepared, empty)
├── fr.json          # French (prepared, empty)
└── index.ts         # Type exports
```

#### Namespace Organization
- `common`: Shared UI elements (buttons, labels, status messages)
- `navigation`: Menu items, breadcrumbs, module names
- `keywords`: Keyword research specific translations
- `auth`: Authentication related texts
- `api`: Server-side error messages and responses

### Cursor AI Guidelines for i18n

#### When Creating New Pages or Components
1. **Always use translation keys** instead of hardcoded German text
2. **Check existing translations** before creating new keys
3. **Follow namespace structure** for organized translation management
4. **Implement both DE and EN** translations simultaneously
5. **Use proper TypeScript types** for translation keys

#### Translation Key Patterns
```typescript
// ✅ Correct usage
const t = useTranslations('keywords.overview');
return <h1>{t('title')}</h1>;

// ❌ Incorrect usage
return <h1>Keyword Übersicht</h1>;
```

#### Required Checks for Cursor AI
1. **Verify all UI text uses translation keys** - No hardcoded German/English text
2. **Check translation completeness** - Both DE and EN keys must exist
3. **Validate namespace usage** - Correct namespace for context
4. **Ensure proper fallbacks** - English fallback for missing translations
5. **Test language switching** - Verify smooth transitions between languages

#### Language Switcher Integration
- **Location**: Topbar with glassmorphism design
- **Functionality**: Dropdown with flag icons and language names
- **Persistence**: Saves preference to database and localStorage
- **Styling**: Teal accent (`#34A7AD`) for active language, `rounded-xl` buttons

#### Database Integration
```sql
-- User language preference storage
ALTER TABLE user_settings 
ADD COLUMN preferred_language VARCHAR(5) DEFAULT 'de';
```

#### API Route Considerations
- **Locale Detection**: Extract from headers or query parameters
- **Error Messages**: Return translated error messages
- **Success Responses**: Use appropriate language for user feedback

## Styling Guidelines
STYLING GUIDELINES: YouRank.ai

This document outlines the styling guidelines, design system, color palette, typography, and core UI/UX principles for YouRank.ai. Our goal is to create a modern, trustworthy, and data-driven user experience that is both powerful and intuitive.

Design Philosophy
YouRank.ai takes strong design inspiration from SEMrush, focusing on refinement and simplification. The aim is to deliver the same clarity and power but with a lighter, modular, and more modern experience, emphasizing efficiency, consistency, and a clean aesthetic.

A. Design System & Components

YouRank.ai is built upon a robust and modern design system to ensure consistency, scalability, and developer efficiency:

*   **Frameworks:** ShadCN UI (component library) and Tailwind CSS (utility-first CSS framework).
*   **Core Components:** Consistent design for buttons, forms, input fields, modals, dialogs, dropdowns, and navigation elements across the entire application.
*   **Data Visualization:** Recharts is used for all data visualization, ensuring clean, responsive, and easily understandable charts and graphs.
*   **Modularity:** Leveraging the modular architecture, each module and tool adheres to a standardized UI structure, promoting intuitive navigation and reduced learning curves.

B. Color Palette

The YouRank.ai color palette is chosen to be modern, professional, and visually engaging, with a clear purpose for each color.

*   **Primary:** #FF6B00 (Orange)
    *   Use: Accent color, Call-to-Action (CTA) buttons, interactive elements, branding highlights.
*   **Secondary:** #111827 (Charcoal Black)
    *   Use: Primary text, sidebar background, important headings, dark mode elements.
*   **Tertiary:** #F9FAFB (Off-White)
    *   Use: Main background color for content areas, light mode elements.
*   **Highlight:** #16A34A (Green)
    *   Use: Success states, "Completed" status, positive metrics, growth indicators.
*   **Warning:** #EAB308 (Yellow)
    *   Use: Pending states, informational alerts, caution messages, "Info" status.
*   **Error:** #DC2626 (Red)
    *   Use: Failed states, error messages, critical alerts, "Failed" status.
*   **Graph Accent Colors:** Shades of teal, blue, orange, and purple
    *   Use: Data visualizations in charts and graphs, to differentiate data series.

C. Typography

Inter is selected for its modern, legible, and professional appearance, suitable for data-heavy applications. JetBrains Mono provides clear readability for any code or API-related content.

*   **Headings:** Inter Bold / 600
    *   Use: Module titles, section headers, chart titles, prominent labels.
*   **Body:** Inter Regular
    *   Use: All descriptive text, table content, form labels, general UI text.
*   **Monospace (Optional):** JetBrains Mono
    *   Use: Displaying JSON / API responses, code snippets, credit usage logs.

D. UI/UX Principles & Patterns

Our UI/UX strategy is inspired by the clarity and analytical depth of SEMrush, but focuses on streamlining the workflow for modern users, with fewer clicks, faster results, and a modular layout.

1.  Core UI/UX Elements (Replicated and Improved)
    *   **Dashboard Overview (Multi-Module Snapshot)**
        *   **Replicate:** Unified view showing overall SEO health (keyword performance, domain traffic, SERP changes).
        *   **Improve:** Cleaner, card-based layout using ShadCN + Tailwind grids. Real-time updates from Supabase (no page reloads). Option to toggle between "Overview by Project" and "Overview by Module". Example improvement: "Add-to-Report" button on each widget to generate a custom client summary.
    *   **Keyword Research Workflow**
        *   **Replicate:** Single search field leading to tabbed results: "Overview", "Keyword Ideas", "Related Keywords", "Difficulty", "Trends".
        *   **Improve:** All tabs load progressively with individual skeleton loaders (no full-page reloads). Users can pin metrics or export directly per tab. Search persistence (previous queries saved in local Supabase table). Feels like SEMrush's "Keyword Magic Tool" -- but faster and modular.
    *   **Project-Based Navigation**
        *   **Replicate:** Each project has multiple data views (Keywords, SERP, Domain, etc.).
        *   **Improve:** Global project switcher in top navigation (like Linear.app style). Breadcrumb navigation (`Dashboard > Project > Module > Tool`). Optional quick-view modal for latest analyses. Enables agencies to handle multiple client projects seamlessly.
    *   **Result Visualization**
        *   **Replicate:** Use of charts and color-coded metrics to make complex data intuitive.
        *   **Improve:** Replace outdated graphs with Recharts (clean, responsive). Add toggle between table view and chart view. Dark mode optimized for data readability. Every data table includes inline charts, filters, and sorting options.
    *   **Task/Report Management**
        *   **Replicate:** Central list of all analyses performed by the user.
        *   **Improve:** Each analysis stored in `analyses` table with status icons (🟡 pending, 🟢 completed, 🔴 failed). Inline result preview on hover (no redirect). Filter by category, status, or date. Think "Task Queue + Analytics History" merged into one.

2.  Key UI/UX Enhancements Unique to YouRank.ai
    *   **Simplified Navigation:** Only 6 core modules in the sidebar: Keywords, SERP, Domain, Backlinks, On-Page, AI. This results in a faster, less cluttered user experience.
    *   **Modular Page Layouts:** Each module uses an identical structure (Top Filters, Tabs, Results), promoting intuitive consistency.
    *   **Asynchronous Loading:** Each data section loads independently, reducing waiting time and improving perceived performance.
    *   **Credit Indicator:** A global credit bar is visible in the header, ensuring cost transparency for users.
    *   **Clean Design System:** Consistent use of ShadCN components (buttons, forms, modals) for a unified visual style.
    *   **White-Label Support:** The ability to replace the logo, colors, and domain, making it agency rebranding ready.

3.  Must-Have UX Components
    *   Persistent Sidebar Navigation with collapsible groups (Keywords, Domain, etc.).
    *   Sticky Topbar with: Search field 🔍, Credit balance indicator 💳, User profile dropdown 👤.
    *   Dynamic Breadcrumbs (`Project > Module > Page`).
    *   Status Chips: Pending / Completed / Error (color-coded).
    *   Loading Skeletons for asynchronous sections to reduce perceived waiting time.
    *   Export Buttons: CSV / JSON / PDF for data download.
    *   Dark & Light Mode Toggle for user preference.

E. Logo Usage

*   **Brand Name:** YouRank.ai
*   **Primary Logo:** "YouRank.ai" with an orange highlight on "Rank".
*   **Icon:** A stylized upward arrow (↗) or a gradient bar symbolizing ranking growth.
*   **Variants:** Light and dark versions for both sidebar and login screen backgrounds.
*   **Spacing:** A minimum of 16px padding on all sides when used in the header or login page, ensuring clear visibility.

Conclusion

YouRank.ai replicates the clarity and analytical depth of SEMrush but significantly streamlines the workflow for modern users. It offers fewer clicks, faster results, and a modular layout designed for scalability, providing a powerful yet intuitive SEO intelligence platform.
