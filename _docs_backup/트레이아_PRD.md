# 트레이아 (Treia) — PRD (Product Requirements Document)
**작성일: 2026.02.27**
**도메인: treia.kr**
**유튜브: 트레이아 채널**

---

## 1. 제품 개요

### 한 줄 정의
CFD/골드 트레이딩을 처음 시작하는 사람이 제대로 시작할 수 있도록 돕는 AI 기반 트레이딩 정보 플랫폼

### 핵심 철학
> "12년, 5천만원을 잃고 터득한 것들을 처음 시작하는 사람이 돌아가지 않도록"

- 흩어진 해외 트레이딩 정보를 AI가 수집·한국어 요약·분류
- 틱데이터 학습 AI가 시장 패턴 분석 및 솔루션 제안
- 노이즈(사기, 리딩방, 다단계) 없는 신뢰할 수 있는 정보만

### 타겟 유저
```
- CFD/골드 트레이딩 입문자
- 혼자 공부하는 사람
- 어디서 시작해야 할지 모르는 사람
- 정보가 없어서 사기/리딩방에 노출될 위험이 있는 사람
```

### 타겟 아님
```
- 한국트레이더협회 회원 (이미 정보 있는 고수)
- 전업 트레이더
```

---

## 2. 핵심 기능 (MVP)

### 메뉴 1: AI 정보 큐레이션
해외 우수 트레이딩 자료를 AI가 자동 수집 → 한국어 요약 → 분류 제공

**소스:**
- MQL5.com Articles (EA, 인디케이터, 매매기법)
- Forex Factory 포럼 (매매기법, 시스템)
- BabyPips.com (입문~중급)
- QuantConnect 커뮤니티 (알고트레이딩)

**기능:**
- 카테고리별 분류 (반자동매매 / 자동매매 / 인디케이터 / 매매기법 / 입문가이드)
- AI 한국어 요약 (핵심만 3줄)
- 난이도 태그 (입문 / 중급 / 고급)
- 저장 / 북마크

### 메뉴 2: AI 시장 분석 (틱데이터 기반)
틱데이터를 학습한 AI가 지표 발표 전후 패턴 분석 및 다양한 솔루션 제안

**예시 질문:**
- "FOMC 발표 전날 골드는 어떻게 움직였나요?"
- "CPI 발표 후 3년간 패턴은?"
- "비농업지표 발표 시 진입 전략은?"

**기능:**
- 경제지표 발표 전후 XAU/USD 가격 반응 히스토리
- AI 패턴 분석 + 차트 시각화
- 다양한 솔루션 제안 ("이럴 때 이렇게")
- 지표 일정 캘린더 연동

**데이터 소스:**
- MT5 Python API (`copy_ticks_from()`)
- HistData.com (과거 틱데이터 CSV)
- 경제지표: Investing.com API / FRED API (무료)

### 메뉴 3: EA / 인디케이터 큐레이션
검증된 자동매매 EA 및 인디케이터 정보 모음

**기능:**
- MQL5 마켓 우수 EA 한국어 소개
- 백테스트 결과 요약
- 무료 / 유료 분류
- MT5 설치 가이드 한국어 제공

### 메뉴 4: 입문 가이드
"처음 시작하는 사람을 위한 로드맵"

**기능:**
- CFD/골드 트레이딩 기초 개념
- 브로커 선택 기준 (사기 브로커 구별법 포함)
- 모의계좌 → 실계좌 전환 체크리스트
- 자주 하는 실수 TOP 10

---

## 3. 기술 스택

| 역할 | 기술 | 비고 |
|---|---|---|
| 프론트엔드 | Next.js | Vercel 배포 |
| DB | Firebase Firestore | 무료 티어 | 한글 워크북과 동일 스택 |
| Auth | Firebase Auth | 무료 | - |
| AI 큐레이션 | Gemini 2.5 Flash | 크롤링 + 한국어 요약 |
| 틱데이터 | MT5 Python API | 실시간 + 히스토리 |
| 과거 데이터 | HistData.com CSV | XAU/USD 틱 |
| 경제지표 | FRED API / Investing.com | 무료 |
| 차트 | TradingView Lightweight Charts | 무료 라이브러리 |
| 배포 | Vercel | - |
| 환경변수 | .env.local | API 키 보안 |

---

## 4. Supabase DB 설계

### 테이블 1: articles
```sql
id            uuid (PK)
source        text        -- 'mql5' / 'forexfactory' / 'babypips'
original_url  text
title_ko      text        -- AI 번역 제목
summary_ko    text        -- AI 3줄 요약
category      text        -- '자동매매' / '인디케이터' / '매매기법' 등
difficulty    text        -- '입문' / '중급' / '고급'
created_at    timestamp
```

### 테이블 2: market_analysis
```sql
id            uuid (PK)
indicator     text        -- 'FOMC' / 'CPI' / 'NFP' 등
date          timestamp   -- 발표 일시
before_price  float       -- 발표 전 XAU/USD
after_price   float       -- 발표 후 XAU/USD
movement      float       -- 변동폭 (pips)
direction     text        -- 'up' / 'down' / 'volatile'
analysis_ko   text        -- AI 분석 요약
created_at    timestamp
```

### 테이블 3: users
```sql
id            uuid (PK)
email         text
bookmarks     jsonb       -- 저장한 아티클 ID 목록
created_at    timestamp
```

---

## 5. UI/UX 설계

### 전체 톤앤매너
- 신뢰감 있는 다크 테마 (트레이딩 플랫폼 느낌)
- 깔끔하고 정보 밀도 높게
- 차트 중심 레이아웃

### 메인 화면
```
[상단] 트레이아 로고 + 오늘의 경제지표 일정
[중앙] 메뉴 4개 카드
       - AI 정보 큐레이션
       - AI 시장 분석
       - EA/인디케이터
       - 입문 가이드
[하단] 최신 업데이트 아티클
```

---

## 6. 유입 채널 전략

```
① 유튜브 복기 매매 영상
   → "이 분석은 트레이아에서 뽑은 거예요" 자연스럽게 노출
   → 영상 설명란에 treia.kr 링크

② SEO
   → "FOMC 골드 분석" "XAU/USD 자동매매" 등 롱테일 키워드
   → AI 요약 콘텐츠가 SEO 자산

③ 트레이딩 커뮤니티 자연스러운 공유
   → 좋은 정보 → 알아서 퍼짐
```

---

## 7. 수익화 로드맵

```
단기 (1~3개월)
→ 브로커 제휴 수수료 (계좌 개설 리베이트)
  단, 특정 브로커 추천 아님 — "브로커 선택 기준" 안내 후
  제휴 링크 (법적 안전)

중기 (3~6개월)
→ 프리미엄 구독
  - AI 시장 분석 심화 기능
  - 맞춤형 지표 알림

장기
→ 유튜브 광고 수익
→ EA 마켓플레이스 (한국판)
→ 교육 콘텐츠 유료화
```

---

## 8. 법적 고려사항

```
✅ 안전한 포지셔닝
- "정보 제공 및 교육 목적" 명시
- 투자 권유 아님 면책 고지
- 공식 데이터 기반 분석만

❌ 절대 금지
- 특정 브로커 추천 (투자중개업 위반)
- 수익 보장 언급
- 리딩/매매 신호 제공
```

---

## 9. 개발 단계 (로드맵)

### Phase 1 — 프로토타입 (1~2주)
- [ ] Next.js 프로젝트 셋업
- [ ] 기본 UI (4개 메뉴 구조)
- [ ] MQL5 아티클 AI 크롤링 + 한국어 요약 테스트
- [ ] Supabase 연동

### Phase 2 — 콘텐츠 (2~3주)
- [ ] AI 자동 크롤링 파이프라인 완성
- [ ] 카테고리/난이도 자동 분류
- [ ] 북마크 기능
- [ ] 입문 가이드 콘텐츠 작성

### Phase 3 — AI 시장 분석 (3~5주)
- [ ] MT5 Python API 틱데이터 연동
- [ ] 경제지표 발표 전후 분석 AI
- [ ] TradingView 차트 연동
- [ ] 질문 → 인사이트 제공 인터페이스

### Phase 4 — 마무리 (5~8주)
- [ ] EA/인디케이터 큐레이션
- [ ] SEO 최적화
- [ ] Vercel 배포
- [ ] 유튜브 채널 연동

---

## 10. 환경변수 (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GEMINI_API_KEY=
MT5_LOGIN=
MT5_PASSWORD=
MT5_SERVER=
FRED_API_KEY=
```

---

## 11. 성공 지표

```
MVP 성공 기준:
- 월 방문자 1,000명+
- 아티클 100개 이상 큐레이션
- 유튜브 영상 1개 이상 → 트레이아 유입 확인
- 브로커 제휴 첫 수익 발생
```

---

## 12. 역할 분담

```
Claude          → PRD, 방향 설계, 코드 작성, 맥락 관리
Vercel          → 배포
Supabase        → DB
Gemini API      → AI 크롤링/요약/분석
MT5 Python API  → 틱데이터
TradingView     → 차트
```

---

## 13. API 상세 목록 (업데이트)

### DB / 인프라
```
Firebase Firestore  → DB (한글 워크북과 동일 스택, 익숙함)
Firebase Auth       → 로그인
Vercel              → 배포
```

### 틱데이터 / 골드 시세
```
MT5 Python API      → 실시간 틱데이터 (copy_ticks_from)
                      인피녹스/한텍 계좌 연결
                      무료

HistData.com        → 과거 틱데이터 CSV 무료 다운로드
                      XAU/USD 2000년~현재
                      무료

QuantConnect LEAN   → XAUUSD CFD 틱데이터
                      회원 무료, Python 코드로 접근
                      `self.history(symbol, timedelta(2), Resolution.TICK)`

MetalpriceAPI       → XAU 실시간/히스토리 골드 시세
                      무료 티어 있음
```

### 경제지표 캘린더 (별 3개, 미국+중국만)
```
1순위: Finnhub API
       → 무료 티어 제공
       → 경제 캘린더 엔드포인트 있음
       → 국가 필터 가능 (US, CN만)
       → 별 1~3개 임팩트 필터 가능
       → finnhub.io/docs/api/economic-calendar

2순위: Investing.com 위젯 임베드
       → MVP 초기에 가장 빠름
       → 코드 한 줄로 캘린더 임베드
       → 별도 API 필요 없음
       → investing.com/webmaster-tools/economic-calendar

3순위: Trading Economics API
       → 가장 정확하고 풍부
       → 유료 (나중에 업그레이드용)
```

### AI 크롤링 / 요약
```
Gemini 2.5 Flash    → MQL5, Forex Factory 자료 크롤링
                      한국어 요약 (3줄)
                      카테고리/난이도 자동 분류
```

### 차트
```
TradingView Lightweight Charts
       → 오픈소스, 무료
       → 틱데이터 시각화
       → 경제지표 이벤트 오버레이 가능
```

### 환경변수 (.env.local)
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
GEMINI_API_KEY=
MT5_LOGIN=
MT5_PASSWORD=
MT5_SERVER=
FINNHUB_API_KEY=
METALPRICE_API_KEY=
```

### MVP 초기 우선순위
```
Phase 1에서 꼭 필요한 것:
✅ Firebase (이미 앎)
✅ Gemini API (이미 씀)
✅ Investing.com 위젯 (코드 한 줄, 즉시)
✅ HistData.com CSV (무료 다운로드)

나중에 추가:
⏳ MT5 Python API (틱데이터 연동)
⏳ Finnhub API (캘린더 고도화)
⏳ QuantConnect (분석 고도화)
```
