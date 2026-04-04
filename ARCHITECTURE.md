# Nexora Signal - Scalable Architecture

This architecture is designed to handle **100,000+ users** by focusing on **Feature Isolation**, **Backend Separation**, and **Centralized Shared Core**.

## 1. Feature-First Architecture (The Scalability Engine)

The project is structured under the `src/features/` directory. Each feature is a self-contained module.

### Structure of a Feature: `src/features/[feature_name]/`
- **`api/`**: API handlers, data fetching, and external service communication (Supabase calls specifically for this feature).
- **`components/`**: UI components specific only to this feature.
- **`hooks/`**: React hooks encapsulating business logic or state (React Query integration).
- **`services/`**: Complex business logic functions that aren't hooks.
- **`types.ts`**: TypeScript interfaces related to this domain only.
- **`index.ts`**: The "Public API" of the feature. Other parts of the app *only* import from `index.ts`.

> [!TIP]
> **Zero Merge Conflicts**: Since Developer A works in `features/trend/` and Developer B works in `features/content/`, they will rarely touch the same files, preventing conflicts in a large team.

---

## 2. Nexora Signal Project Structure

```text
src/
├── app/                        # Next.js routes (App Router)
│   ├── (auth)/                 # Grouped Auth routes (login, signup)
│   ├── (dashboard)/            # Authenticated Dashboard routes
│   │   ├── seo/                # SEO Analysis Dashboard
│   │   ├── trends/             # Trend Finder
│   │   ├── content/            # Content Generator
│   │   ├── competitors/        # Competitor Analyzer
│   │   ├── leads/              # Lead Finder
│   │   └── layout.tsx          # Sidebar & Dashboard Shell
│   ├── api/                    # API Endpoints
│   │   └── seo/                # /api/seo/analyze, /api/seo/reports
│
├── features/                   # 🔥 MAIN SCALE LAYER (Feature Modules)
│   ├── auth/                   # Login, Signup, Org Switcher logic
│   ├── seo/                    # SEO Business Logic & Components
│   │   ├── api/                # analyze.ts, getReportsPaginated.ts
│   │   ├── components/         # SeoScore.tsx, SeoHistoryTable.tsx, etc.
│   │   ├── hooks/              # useSeoAnalysis.ts, useSeoHistory.ts
│   │   └── types.ts            # Detailed SeoReportV2 definitions
│   ├── trend/                  # Trend detection engine
│   ├── leads/                  # Lead generation UI
│   ├── competitor/             # Scraper and analysis UI
│   └── billing/                # Stripe integration
│
├── shared/                     # Global Shared Directory
│   ├── components/             # Reusable UI (Button, OrgSwitcher)
│   └── lib/                    # Supabase & shared utilities
│
├── server/                     # Backend-Only Logic
│   ├── db/                     # DB access layer (seoReports.ts, organizations.ts)
│   └── seo/                    # 🔥 SEO ENGINE (Modular Analyzers)
│       ├── analyzer.ts         # Orchestrator (Parallel Execution)
│       ├── seoService.ts       # Service Layer (Status & Persistence)
│       ├── scoreEngine.ts      # Weighted Scoring & Recommendations
│       ├── tagAnalyzer.ts      # Deep technical tag inspection
│       └── imageAnalyzer.ts    # Image SEO & asset optimization
```

---

## 3. High Performance & Scalability (100k+ Users)

### A. Modular SEO Engine (V2)
The SEO engine is decoupled into independent, parallelized modules. This ensures:
1. **Performance**: All scans (Meta, PageSpeed, Links, Images) run concurrently.
2. **Resilience**: A failure in one external API (like PageSpeed) doesn't crash the report.
3. **Accuracy**: A weighted scoring algorithm (Meta 20%, Performance 20%, etc.) provides realistic health scores.

### C. Production Hardening
For enterprise-level reliability, the system implements:
- **Race-Condition Safe Deduplication**: Prevents redundant compute by locking concurrent requests for the same URL.
- **Partial Failure Resilience**: Uses a "Modular Try/Catch" wrapper for each analyzer, allowing reports to complete even if one module (like PageSpeed) fails.
- **Explainable Scoring**: Provides transparent `scoreDetails` (sections, scores, and reasons) instead of just a raw number.

### D. Database Strategy
1. **Row-Level Security (RLS)**: Enforced on all tables to ensure multi-tenant data isolation.
2. **Indexing**: Strategic indexes on `(url, organization_id, created_at)` for O(1) deduplication and history retrieval.

### B. Backend Separation (`server/` Layer)
As the app grows, you can easily migrate the code in `src/server/` into a dedicated **FastAPI** or **Go** microservice. The structure already decouples DB logic from React components.

---

## 4. Implementation Checklist

- [x] Initial Directory Structure Created
- [x] Root & Dashboard Layouts Implemented
- [x] **Step 1:** SEO Analysis Engine V2 (Modular, Weighted, Parallel).
- [x] **Step 2:** SaaS-Grade Service Layer (Timeouts, Dedup, Status System).
- [x] **Step 3:** Technical SEO Module (Robots, Sitemaps, Canonicals).
- [x] **Step 4:** Production Hardening (Race-safety, Partial failures, explainable scores).
- [ ] **Step 5:** Integrate Open AI in `server/ai/content-gen.ts`.
- [ ] **Step 6:** Competitor Analysis Real-time Scrapers.
