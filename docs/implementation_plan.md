# 트레이아(Treia) 실행 계획서 (Implementation Plan) - 2026.03.09 업데이트

## 1. 현재 상황 분석 (Strategic Pivot)

- **배경**: EA(자동매매) 빌더 기능 개편 및 교육 콘텐츠 데이터의 안정적 제공 필요.
- **핵심 목표**: **"투명한 매매 데이터 공개와 신뢰도 높은 교육 콘텐츠, 실효성 높은 EA 설계 툴"**의 결합.
- **최신 성과**:
  1. `npm run build` 단계에서 에러 없음을 확인.
  2. 사용자 피드백에 맞춰 EA Builder 노드 UI에서 실용적인 Inline 리스트 UI로 교체 완료.
  3. Lot 포지션 사이즈 계산 로직 반영 개선.
  4. Firestore에 중복 없는 SVG와 picsum 이미지 썸네일로 50건 DB 리시딩(Seeding) 성공.

## 2. 향후 릴리즈 계획 (Phase: Education & Builder Performance)

### Phase 1: 교육 콘텐츠(Education) 안정화 (완료)

- DB 설계: `treia_education` 모듈화 완비.
- 데이터 개선: 고유 이미지 알고리즘 및 중복 방지 로직 적용하여 "깨진 이미지 문제" 등 원천 차단.

### Phase 2: EA 실효성 증대 및 템플릿화 (완성도 90%)

- UI/UX 개편: 복잡한 Abstract Node 구조를 삭제, 트레이더가 선호하는 Ticker List 기반 Condition으로 재설계.
- 템플릿: Gold Master Scalper 등 프리셋 로드 가능하게 설계하여 초보자 진입장벽 낮춤.
- NEXT STEP: 사용자가 작성한 EA 로직을 MQL5 코드로 변환해주는 파이프라인 개발 준비.

### Phase 3: 실적 게시판(Performance Track) 구현 (예정)

- DB 설계: `treia_trades` 컬렉션 개발 (데이터 기반 매매 증빙 및 코멘트).
- 기능: 라이브 매매 데이터를 기반으로 서버에서 API로 받아와 히스토리 자동 노출.

## 3. 마일스톤

- [x] (완료) 구글/이메일 로그인 안정화 및 Session 처리.
- [x] (완료) 교육 콘텐츠 시딩 및 SVG/Thumbnail 중복 및 파손 버그 픽스.
- [x] (완료) EA Builder UX 개선 (직관성 증대, 실효적 기능으로 변경).
- [x] (완료) EA Builder Position Sizing Lot 숫자 계산 버그 픽스 및 전체 빌드 테스트 통과.
- [ ] (진행중) 실적 히스토리 페이지(/track) 및 라이브 매매 데이터 연결 방식 구축.
- [ ] (예정) EA Code Generator (MQL5) 구현 및 배포.
