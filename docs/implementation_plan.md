# 트레이아(Treia) 실행 계획서 (Implementation Plan) - 2026.03.06 버전

## 1. 현재 상황 분석 (Strategic Pivot)

- **배경**: CFD/골드 트레이딩 인사이트 제공을 위한 MVP 기획 문서(3/6) 확정.
- **핵심 목표**: **"투명한 매매 데이터 공개와 신뢰도 높은 교육 콘텐츠"**의 결합.
- **현재**: 인증 시스템 및 멀티 앱 DB 격리 완료. 총 50종의 실전 교육 콘텐츠 Data Seeding 완료. Vercel 배포 시 발생한 런타임 크래시 픽스.

## 2. 향후 릴리즈 계획 (Phase: Education & Performance)

### Phase 1: 교육 콘텐츠(Education) 마스터 클래스 구축 (완료)

- **DB 설계**: `treia_education` 컬렉션 구조화 및 50개 Markdown 콘텐츠 시딩 완료.
- **Vercel 배포 안정화**: 404 및 날짜 타입 오류 해결.
- **NEXT STEP**: 메인 페이지 하단에 "최신 트레이딩 인사이트" 요약(최신 3개) 노출 컴포넌트 추가 필요.

### Phase 2: 실적 게시판(Performance Track) 구현 (~3/15)

- **DB 설계**: `treia_trades` 컬렉션 개발 (데이터 기반 매매 증빙 및 코멘트).
- **기능**: 실제 매매 데이터를 기반으로 한 실적 자동 노출 시스템.

### Phase 3: MQL5 시그널 연고 및 브랜딩 (~4/3)

- **CTA**: 페이지 곳곳에 "MQL5 시그널 구독하기" 버튼 전략적 배치. (Education Side Banner에 1차 적용 완료)
- **유튜브 연동**: 데이터 기반 분석 영상과 사이트 간의 유기적 흐름 완성.

## 3. 마일스톤

- [x] 구글/이메일 로그인 안정화 (2026.03.05)
- [x] Firestore `treia_users` / `treia` Instance 격리 완료 (2026.03.05)
- [x] 객관적 교육 콘텐츠 시딩(Seeding) 및 Education 페이지 구현 (2026.03.06)
- [x] Vercel 배포 간 안정성(Runtime Type Safety) 확보 (2026.03.06)
- [ ] 실적 히스토리 페이지(/track) 구축 (예정)
- [ ] MVP 릴리즈 및 서비스 홍보 채널 준비 (3월 말)
