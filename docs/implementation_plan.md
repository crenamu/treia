# 트레이아(Treia) 프로젝트 설계도 (Implementation Plan)

## 1. 프로젝트 개요

- **이름**: 트레이아 (Treia)
- **정의**: CFD/골드 트레이딩 입문자를 위한 AI 기반 트레이딩 정보 플랫폼
- **핵심 가치**: "12년의 트레이딩 경험을 통해 얻은 통찰을 입문자에게 전달하여 시행착오를 줄임"

## 2. 기술 스택 (Tech Stack)

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Vanilla CSS 기반 프리미엄 디자인)
- **Backend/DB**: Firebase (Auth, Firestore)
- **AI**: Gemini 3 Flash Preview (큐레이션 및 비용 최적화)
- **Data API**: Finnhub (경제 지표), TradingView Widget (실시간 가격), MQL5 (심층 전략 분석)
- **Deployment**: Vercel
- **Package Manager**: pnpm

## 3. 폴더 구조 (Folder Structure)

```
/app
  /layout.tsx       (전체 레이아웃, SEO, 폰트 설정)
  /page.tsx         (메인 대시보드)
  /curation
    /page.tsx       (AI 정보 큐레이션 목록)
    /[id]/page.tsx  (큐레이션 상세 내용)
  /analysis
    /page.tsx       (틱데이터 기반 시장 분석)
  /ea
    /page.tsx       (EA 및 인디케이터 큐레이션)
  /guide
    /page.tsx       (입문자 로드맵 가이드)
/components
  /AuthModal.tsx        (통합 인증 모달 - Google/Email)
  /GlobalAuthModal.tsx  (전역 모달 래퍼)
  /Ticker.tsx          (실시간 가격 및 경제 일정 티커)
  /UserProfile.tsx      (프로필 및 인증 버튼 관리)
/lib
  /firebase.ts      (Firebase 초기화 및 설정)
  /auth-context.tsx (인증 상태 및 전역 모달 상태 관리)
  /gemini.ts        (Gemini SDK 설정 및 유틸리티)
  /finnhub.ts       (Finnhub API 연동 유틸리티)
  /community.ts     (커뮤니티 포스팅 및 파일 업로드 로직)
/hooks              (커스텀 훅)
/types              (TypeScript 타입 정의)
/constants          (상수 설정)
/.env.local          (환경 변수)
```

## 4. 데이터베이스 및 API 설계

### Firebase Firestore 데이터 모델 (잠정)

- `articles`: AI 큐레이션 정보 (source, original_url, title_ko, summary_ko, category, difficulty)
- `market_analysis`: 지표 발표 전후 가격 데이터 및 AI 분석
- `users`: 사용자 정보 및 북마크 목록

### API 연동 계획

- **Gemini**: MQL5(로그인 연동), Forex Factory 데이터 요약 및 시장 패턴 분석. **Gemini 3 Flash Preview**를 기본 모델로 사용.
- **Vision AI**: 사용자가 업로드한 MT5/MT4 수익 내역(이미지/스크린샷)을 OCR로 스캔, 브로커 서버 시간(Server Time)을 한국 시간(KST)으로 자동 환산하여 **매매일지(Trade Log) 및 통계표 자동 생성**.
- **Telegram (Webhook)**: MT5 EA가 발송하는 매매 진입/청산 시그널을 `node-telegram-bot-api` 웹훅으로 실시간 수신하여 프론트엔드 대시보드에 뿌려줌.
- **Investing.com**: 임베드 위젯 및 RSS 피드를 통해 뉴스 파싱 및 고신뢰 실시간 경제 달력 제공.
- **TradingView**: 실시간 골드, 나스닥, 비트코인 가격 위젯 연동 및 **Volume Profile SVG 오버레이** 직접 구현.

## 5. 디자인 시스템 (Design System)

- **Theme**: Premium Dark Mode
- **Primary Color**: Amber/Gold (#FFC107 - 골드 트레이딩 상징)
- **Background**: Deep Charcoal / Navy
- **Points**: Glassmorphism, Subtle Gradients, Neon Accents (Success: Green, Danger: Red)
- **Font**: Inter (기본) + Outfit (제목용)

## 6. 보안 및 최적화

- API 키 `.env.local` 관리 및 서버 사이드 처리
- Next.js SEO 메타데이터 자동화
- 이미지 최적화 (next/image) 및 지연 로딩
