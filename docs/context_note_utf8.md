# 트레이아(Treia) 맥락노트 (Context Note)

## 1. 프로젝트 배경 및 목적

- **작성일**: 2026.02.28 15:30 (최종 업데이트: 2026.03.06 19:20)
- **배경**: 12년 경력의 트레이더로서, 입문자들이 사기 혹은 불필요한 시행착오로 돈과 시간의 손실을 겪는 것을 막기 위해 신뢰할 수 있는 정보를 제공함.
- **핵심 목표**: 정보의 큐레이션 및 AI를 통한 번역・요약 기능을 통해 입결자가 스스로 매매 기준을 세울 수 있도록 돕는 커뮤니티 성격의 프리미엄 정보 플랫폼.

## 2. 개발 상세 가이드 (스타일/기능)

### 2.1 Next.js 14 설정

- **기본 구조**: `src` 생략, 루트 하위에 `app`, `components`, `lib` 배치
- **App Router**: 동적 라우팅 및 서버 컴포넌트 우선 사용 (SEO 최적화)

### 2.2 UI/UX 디자인 정책 (Premium Look)

- **Primary Theme**: Deep Dark (#0B0C10)
- **Accent Color**: Gold (#D4AF37) / Amber (#FFBF00) -> 주된 강조색
- **마이크로 애니메이션**: Framer Motion 등으로 요소들을 부드럽게 전환. Glassmorphism(유리 질감) 활용.

### 2.3 AI (Gemini) 활용 및 보안 정책

- **모델**: 비용 및 속도 최적화를 위해 사용자 향 API는 `gemini-3-flash-preview` 기본 설정.
- **보안**: MQL5 등 타 플랫폼 크롤링 관련 정보나 내부 핵심 알고리즘(Proprietary Momentum Index 등)은 'Top Secret' 처리되어 UI 상에 직접적인 계산 로직은 노출하지 않음.

### 2.4 데이터 인프라 및 API

- **Firestore**: 단독 DB `treia` 구축 완료. 모든 컬렉션은 `treia_` 접두사를 붙여 분리.
- **DB 인스턴스 격리 완료 (2026.03.06)**: Firebase 클라이언트 및 서버사이드에서 `getFirestore(app, 'treia')`로 명시적 분리.
- **TradingView**: 실시간 차트 제공 (Gold 등 메인 지표). 심리적 저항선/지지선 오버레이 제공.
- **Finnhub -> Investing.com**: 기존 Finnhub 뉴스 지연/오류 문제로 Investing.com RSS 한국어 피드 및 캘린더 위젯으로 완전 교체 완료.
- **Telegram Webhook 연동**: MT5가 발송하는 매매 시그널을 우리 서버가 계속 폴링하는 것이 아니라 `Webhook`으로 즉시 푸시받아 프론트엔드(<TelegramSignals /> 컴포넌트)에 뿌려주는 구조 완성.
- **Vision AI (OCR) 매매일지 생신기 구축**: 사용자가 캡처한 MT4/MT5 거래 내역 이미지를 업로드 시 Gemini Vision API가 데이터 추출 변환.

## 3. 리서치 및 참고 자료

- MQL5, Forex Factory
- MTF(Multi-Timeframe) 데이터베이스 연산

## 4. 특이 사항 및 주의점

- "리딩방"이나 "투자 권유" 느낌을 탈피하기 위해 모든 용어는 Educational Perspective(교육적 관점)나 Bias(성향) 등으로 통일하고, 법적 면책 조항(Disclaimer)을 Footer에 강제 노출.
- Telegram 연동 시 보안 강화를 위해 Token/Chat ID 등은 무조건 `.env.local`로 관리.
- **Vercel 배포 시 타입 에러 주의**: Firestore Timestamp 직렬화 등 Next.js Server Components와의 데이터 교환 시 `undefined`나 타입 불일치 크래시 발생 가능성이 있으므로 방어적 파싱(Defense parsing) 철저.

## 5. 주요 업데이트 내용 (2026.03.06)

- **교육 콘텐츠 대규모 시딩(Seeding)**: 총 50개의 실전/기초 Markdown 교육 콘텐츠를 `treia_education` Firestore 컬렉션에 자동 적재하는 스크립트 작성 및 실행 완료 (`scripts/seed_from_docs.mjs`).
- **타입 에러 픽스**: Vercel 배포 환경에서 교육 페이지 조회 시 `createdAt.seconds` undefined 크래시가 발생하던 문제를 해결하여 `typeof string` 및 `_seconds` 구조 모두 대응하도록 조치 완성.
