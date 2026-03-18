# Treia (FinTable) Implementation Plan

## Phase 1: Core Foundation & Modern Design System (Completed)
- Next.js 15 & Tailwind CSS setup
- Premium beige/charcoal design implementation
- Mobile-first responsive layout

## Phase 2: Financial Data & Intelligence (Completed)
- FSS API integration (Loans, Deposits, Savings)
- Smart URL mapping for direct product links
- Client-side filtering and sorting logic

## Phase 3: Premium UI/UX & Detail Features (Completed)
- PremiumProductTemplate implementation
- Deposit/Loan calculation simulators
- Enhanced card benefit UI

## Phase 4: Emergency UI/UX & Data Refinement (Completed)
- **High Contrast Readability**: Darkened text colors and improved theme contrast.
- **Desktop Width Optimization**: Restricted main content to `max-w-5xl` for better focus.
- **Loan Data Accuracy**: Fixed 0% interest rate display by handling missing values as `null`.
- **Diagnostic Flow**: Implemented `LoanDiagnosticFlow` to simulate premium application processes.
- **Card Enhancement**: Integrated high-quality generated card images and detailed benefit information.
- **Mobile Usability**: Improved horizontal scrolling for simulators and responsive card layouts.
- **Smart Direct Linking**: Expanded direct product mapping to avoid generic search links.

## Phase 5: Treia Sub-brand Lead Generation Funnel & Automation (Completed)
- **Isolated Layout**: Implemented `LayoutWrapper` to separate the Treia landing page from the FinTable context.
- **Copywriting & Aesthetic**: Replaced negative/cheap phrasing with premium SaaS terminology (Treia Gold Auto-Trading Engine) and applied a consistent glowing hero grid pattern.
- **Backend Automation**: Next.js Serverless API (`/api/lead`) integrated with Firebase Firestore for lead storage (with email deduplication logic) and Telegram Bot for instant free admin push notifications.
- **Waitlist Logic**: Replaced direct channel links with a Waitlist UX offering an MT4/MT5 Investor password as a high-converting lead magnet.
