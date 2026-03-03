# 트레이아(Treia) 체크리스트 (Checklist)

## Phase 1: 프로젝트 기초 구축 및 환경 설정 (2.28 15:35) - [X]

- [x] Next.js 14 프로젝트 초기화 (pnpm 사용)
- [x] Tailwind CSS 기반 디자인 시스템 (globals.css) 구성
- [x] 환경 변수 (.env.local) 설정 및 API 키 관리 체계 수립
- [x] 필수 폴더 구조 (/app, /components, /lib) 생성
- [x] Firebase SDK 초기화 (/lib/firebase.ts)
- [x] Gemini SDK 설정 및 유틸리티 (/lib/gemini.ts)
- [x] Finnhub API 연동 유틸리티 (/lib/finnhub.ts)

## Phase 2: 코어 컴포넌트 및 기본 레이아웃 (2.28 16:00) - [X]

- [x] 상단 내비게이션 및 사이드바 (Nav/Logo/Status)
- [x] 공통 UI 컴포넌트 (Card, Button, Badge)
- [x] 메인 대시보드 페이지 (/app/page.tsx)
- [x] 다크 테마 및 골드 포인트 스타일링 최적화
- [x] 반응형 그리드 시스템 레이아웃 구축

## Phase 3: 기능별 페이지 구현 (2.28 16:15) - [X]

- [x] AI 정보 큐레이션 목록 및 상세 페이지 (/app/curation)
- [x] AI 시장 분석 인터페이스 (/app/analysis) (위젯 연동)
- [x] EA 및 인디케이터 데이터 바인딩 (/app/ea)
- [x] 입문 가이드 로드맵 시각화 (/app/guide)
- [x] Framer Motion을 활용한 애니메이션 효과

## Phase 4: 데이터 연동 및 AI 고도화 (진행 중)

- [x] TradingView Widget을 통한 고품질 실시간 가격 연동 (Gold/Nasdaq/BTC)
- [x] 경제 일정 연동 (오류 수정 완료)
- [x] 단독 데이터베이스 `treia` 구축 및 프리픽스 기반 데이터 관리 체계 수립 (2026.03.01)
- [x] **멀티 타임프레임(MTF) 엔진 구축**: D, H1, M2, M1 역사적 데이터를 분석하여 통합 매물대 지도 생성.
- [x] Investing.com RSS 피드 한국어 외환/선물 뉴스 파이프라인 (2026.03.03) API 연동 완료
- [x] **Telegram Webhook API**: MT5/서버 발송 신호를 수신해 메인 페이지 상단 `<TelegramSignals>` 실시간 표기 (2026.03.03 완료)
- [x] **OCR 매매일지 자동 생성기**: Gemini Vision API(1.5 Flash)를 통해 MT4/MT5 거래내역 스크린샷 이미지 업로드 시 KST(한국시간) 환산 및 통계형 매매일지 자동 작성 기능 완료.

## Phase 5: 최종 검수 및 배포 (진행 중)

- [ ] 라이트하우스 SEO/성능 점검 및 최적화
- [ ] 크로스 브라우징 및 반응형 검수
- [x] Vercel 자동 배포 연동 및 라이브 환경 테스트 완료
- [ ] 최종 시연 및 문서화 마무리 (사용자 매뉴얼 포함)

---

**업데이트 이력**:

- 2026.03.01 13:35: 단독 DB `treia` 적용 완료
- 2026.03.03 15:40: Telegram 백엔드 수신 폴링, 웹훅 API 완성. UI 레이아웃을 상단으로 변경 완료.
- 2026.03.03 20:30: 텔레그램 `Treia_Reader_Bot` 도입으로 Privacy 정책 우회 수신 완벽 성공.
- 2026.03.03 20:30: 인베스팅 닷컴 캘린더 URL 파라미터 버그 픽스 및 OCR Gemini 1.5 Flash 모델 업데이트 완료.
