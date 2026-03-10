# 트레이아(Treia) 맥락 노트 (Context Note) - 2026.03.10 업데이트

## 1. 개요 및 배경

- 핵심 목적: 투명한 매매 데이터 공개와 신뢰도 높은 교육 콘텐츠 결합
- 주요 기술 스택: Next.js(Turbopack), Tailwind CSS, Firebase (Firestore 분리 `treia` app 설정)
- Vercel 배포 시 오류 발생 방지를 위한 런타임 최적화.

## 2. 최근 주요 작업 사항 (2026.03.10)

### EA 빌더 (EA Builder) 고도화 및 UI/UX 개편

- 사용자 피드백 5: "EA 빌더에 스토캐스틱(Stochastic) 지표 추가 및 추천 전략 카테고리화 필요."
  - 해결: `INDICATOR_DB` 시스템 코어에 스토캐스틱 오실레이터(Stochastic Oscillator, parameters: kPeriod, dPeriod, slowing, overbought, oversold) 지표 추가.
  - 해결: `STRATEGY_DATA` 항목 및 사이드바 목록을 **카테고리별(구분)**로 UI 그룹핑 처리 완료(스캘핑/데이트레이딩, 돌파/추세추종, 역추세/변동성). 기존 템플릿 외에 **스토캐스틱 기반 역추세 템플릿(Stochastic Reversal M30)** 전략 프리셋 신규 추가.

### 교육 문서 사이드바 UI 개선 (위험 단어 배제)

- 기존의 "시그널 구독하기 (MQL5)" 유도 버튼을 전면 삭제하고 그 자리에 내부 "EA Builder 로직 만들기" 버튼과 안내 문구로 깔끔하게 교체. 이를 통해 사행성을 조장할 수 있는 위험한 단어(시그널)를 배제하고, 서비스 내부 체류 시간을 높임.

### 이미지 매칭 및 버그 픽스 (이전 내역 유지)

- `seed_from_docs.mjs`에 고유 ID(`uniqueId`)를 도입.
- 문서 내 SVG 이미지 주입 방식을 시맨틱 문맥 매칭(Semantic Context Matching)으로 상향 개선 (1순위: 타이틀 직접 키워드 / 2순위: 본문 내 빈도 판별). DB 재구축 완료.
- EA Builder `riskState` 계산 로직 실시간 연동 버그 정정.

## 3. 남아 있는 과제 및 주의 사항

- UX 고도화 진행하며 EA Builder 의 모바일 / 태블릿 UI 사용성 점검 최적화.
- 사용자가 직접 작성한 EA 프로필을 `treia_ea` DB에 저장하고 언제든지 불어올 수 있도록 클라우드 세이브 시스템 추가 기획 필요.
- 실적 게시판(Performance Track) API 연결 및 설계.
