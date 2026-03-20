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

## Phase 6: Treia Funnel Redesign (Scrollytelling & Proof) [Completed: 2026-03-19]
1. **[구조 설계]** 기존 퍼널을 폐기하고 100vh 단위의 원페이지 스크롤 10-Screen 플로우로 확장
2. **[디자인 고도화]** #c8a84b 골드 포인트 컬러와 미니멀리즘 다크 테마 기반 프리미엄 UI 설계 (fade-in 인터랙션 적용)
3. **[콘텐츠 인포그래픽]** 실제 1000불 거래 내역 기반의 SVG 성장 곡선 및 Net Flow 통계 대시보드 구현
4. **[리드 캡처]** MT5 Investor Password 사전 예약 신청 폼 및 관리자 알림 자동화 연동

## Phase 7: Admin & Delivery Automation [Completed: 2026-03-19]
1. **[Admin Dashboard]** `/treia/admin` 페이지 구현. 비밀번호 보호 및 실시간 신청자 리스트 조회/승인 기능.
2. **[Email Automation]** `nodemailer` 기반의 전용 이메일 발송 API (`/api/admin/send-email`) 구축. 블랙/골드 톤의 프리미엄 HTML 템플릿 적용.
3. **[Internal Guide]** 외부 노션 대신 자체 웹페이지 가이드(`/treia/guide`) 구축. 3단계 모바일 접속 매뉴얼 및 MT5 가이드 최적화.
4. **[Copywriting Refinement]** 자본주의적 신뢰 논리(시드 확보 명분) 및 1년 한정 개방(FOMO) 전략 FAQ 섹션 최종 완성.

## Phase 8: Treia 콘텐츠 고도화 및 통합 (Completed: 2026-03-20)
- [x] **Phase 1: Brand & Philosophy**: 라이선스 명칭 추가 및 Hero/철학 문구 보정.
- [x] **Phase 2: Benefits & Infographic**: 구체적 혜택 사례(FOMC 등) 업데이트 및 Drawdown 포인트 강화.
- [x] **Phase 3: Proof & Trust**: MT5 관전자 계정 조작 불가 논리 보강.
- [x] **Phase 4: FAQ Expansion**: 기존 7개 핵심 질문 통합 및 고도화 (총 10개 질문 가치 함축).
- [x] **Phase 5: CTA & Legal**: 신청 폼 라벨링 및 면책 조항 핵심 요약 교체(리스크 고지 강화).


## Phase 9: 랜딩페이지 섹션 확장 & 비즈니스 모델 정립 (2026-03-20)

### 9-1. 랜딩페이지 신규 섹션 추가
- [x] **THE ORIGIN 섹션**: 12년의 트레이딩 여정 스토리텔링. 2,000명 커뮤니티 & 트레이딩 시장의 97% 손실률(파레토 법칙 이하) 명시. 3단계 로드맵(모의 테스트 → 실계좌 검증 → 관전자 초대) 카드 구조화. CTA 링크 연결.
- [x] **WHY TREIA 섹션**: 국내 일반 자동매매 vs. Treia Gold Engine 정량 비교표(7개 항목: 종목/시간/방향/수익/리스크/검증/최소 시드). XAUUSD 시장의 기술적 우위 보조 설명 추가.
- [x] **Proof 섹션 강화**: 데이터 소스 주석에 "백테스트가 아닌 실제 시장 구동 모의 프론트테스트" 명시. 브로커(한텍)/기간(1개월)/종목(XAUUSD)/세팅(멀티타임프레임) 상세화.
- [x] **FAQ 업데이트**: 구독 관련 Q&A를 현재 모의 테스트 단계에 맞게 수정. "왜 인원 제한을 하나요?" 항목 추가 (슬리피지 및 Edge 보호 근거 명시).
- [x] **GNB 확장**: 데스크탑 & 모바일 메뉴에 'Origin', 'Why Treia' 링크 추가. 각 섹션에 고유 ID 앵커 부여 (smooth scroll 작동).

### 9-2. 비즈니스 모델 전략 정립 (내부 논의)
- **선별적 소수 운영 원칙 확정**: Slippage 방지 및 전략 Edge 보호를 위한 기술적 필수 조치. 단순 마케팅 희소성이 아닌 실제 퍼포먼스 보전 전략.
- **라이선스 서버 방식 채택 결정**: 단일 `.ex5` 파일 배포 후 Firebase Firestore에서 계좌별 `{ max_equity, expire_date, active }` 동적 제어 구조. Admin 페이지에 라이선스 관리 탭 추가 예정.
- **시드 기반 티어형 과금 구조 설계 (향후)**:
  - Standard (~$10,000): 고정 월정액
  - Premium ($10,000~$100,000): 고정 월정액 + 수익 성과 보수 %
  - Whale ($100,000+): 개별 협의 (VIP 케어)
- **유저 수 상한 전략**: 초기 100명 이내로 시작 → 브로커별 체결 품질 모니터링 → 단계적 확장 (3,000~5,000명부터 진지하게 고민).

---
**최종 업데이트:** 2026-03-20 (금)
