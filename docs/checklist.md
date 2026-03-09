# 트레이아(Treia) 체크리스트 (Checklist) - 2026.03.09 업데이트

## 1. 최근 달성 내역 (Completed Tasks)

- [x] (2026.03.06) 구글/이메일 인증 기반 로그인 시스템 연동 및 DB 인스턴스 격리 (`treia` app 설정)
- [x] (2026.03.06) 50개 문서 콘텐츠 Firestore `treia_education` DB 시딩 및 렌더링 배포
- [x] (2026.03.09) 문서 시딩 시 발생하는 중복 썸네일/깨짐 문제 100% 픽스. `picsum.photos` uniqueId 사용, 20가지 `SVG` 패턴의 중복 삽입 방지 필터 도입 (`usedSvgs` Set 객체)
- [x] (2026.03.09) "리스크 계산 랏 크기 안 바뀜" 버그 픽스. `Lot Size` 공식을 `(Balance * riskPct) / slPips` 계산 과정 최적화 및 상태 반영 로직 정정.
- [x] (2026.03.09) "EA 빌더 난해함" 사용자 피드백 반영.
  - [x] 난해한 노드형 네트워크 뷰 삭제 & 실효성 높은 "Inline Rules List" 구조로 개편.
  - [x] 골드 특화 사전 셋업 프리셋(Pre-loaded Strategies: Scalper, Breakout, Trend 등) 제공.
  - [x] Expected Performance Layout 및 포지션 사이징 계산기 Layout 통합, JSX syntax (`div` unclosed) 렌더링 크래시 디버깅 및 완전 해결. 빌드 테스트(`npm run build`) 100% 통과 완료.

## 2. 향후 및 현재 진행 과제 (To-Do)

- [ ] (보류) 백테스트 결과 히스토리 클라우드 저장 시스템 구축 (사용자 인증 후 저장)
- [ ] (진행중) 실적 페이지 구현, 실제 매매 데이터 연결 방식 구체화
- [ ] MQL5 소스 코드 내보내기 템플릿 제너레이터(Python Backend Server or API Proxy) 설계
- [ ] 모바일 환경에서 노드 리스트 UX / UI 사용성 확인
