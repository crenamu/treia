# 핀테이블(FinTable) 체크리스트 (Checklist)

_최종 업데이트: 2026-03-13 (금) 16:00 KST_

---

## 🏗️ 1. 프로젝트 기반 수립 (FinTable 전환)

- [x] Tailwind CSS 테마 설정 (옅은 베이지 `#FBF9F6` 베이스)
- [x] GNB(네비게이션) 구조 설계 (Stitch 서브메뉴 스타일 반영)
- [x] 폴더 구조 재편 (`app/treia` 이동 등)
- [x] 환경 변수(`.env.local`) 금감원/공공데이터 API 키 세팅

---

## 💰 2. 금융상품 (예적금) MVP 개발

- [x] `/api/deposits` 금감원 데이터 연동 API Route 구현
- [x] 데이터 정규화 로직 (baseList + optionList 조인)
- [x] 메인 대시보드 요약 카드 UI (`bestOption` 기반)
- [x] 예금 리스트 카드 UI 및 필터 시스템 (`6/12/24/36개월`)
- [x] 상품 정렬 기능 (최고금리/기본금리 순)
- [x] 상품 상세 페이지 (`/deposits/[id]`)
- [x] `/api/savings` 적금 API 연동
- [x] 적금 리스트 및 상세 페이지 구현 (`/savings`, `/savings/[id]`)
- [x] 금융 계산기 구현 (`/calculator`)

---

## 📈 3. Treia 통합 및 이식

- [x] 기존 `/` 홈 내역을 `/treia`로 마이그레이션
- [x] Treia 전용 레이아웃(다크 테마) 적용
- [x] GNB 메뉴에 Treia 연결
- [x] 나의 저장 목록 UI 구현 (`/saved`)

---

## 🏠 4. 임대주택 서비스 (Phase 3 예정)

- [x] 공공데이터포털 LH/SH API 키 설정 완료
- [x] `/api/housing` API 연동 기초 설계
- [x] 임대주택 공고 리스트 UI 구현 (`/housing`) 및 LH API 연동

---

## 🚀 5. 배포 및 안정화

- [ ] Vercel 환경 변수 등록
- [ ] API 서버사이드 캐싱 전략(`revalidate`) 적용 확인
- [x] 모바일 반응형 UX 최종 점검 (Navbar, Sticky CTA 적용)

---

## 🏗️ 6. 고도화 및 개인화 (Firebase & Benchmarking)

- [x] Firebase 초기화 및 `fintable_` 프리픽스 컬렉션 설계
- [x] 관심 상품 '찜하기' 기능 (Firebase Firestore 연동)
- [x] 상품 '공유하기' 기능 (Web Share API 적용)
- [x] 금융 섹션: 토스풍 'Benefit Highlights' 카드 도입
- [x] 금융 섹션: 뱅크샐러드풍 '우대금리 시뮬레이션' 토글 기능
- [x] 주거 섹션: 내집다오풍 '청약 자격 자가 진단' 모듈 (점수제 도입)
- [x] 금융 섹션: ISA/ETF 전용 큐레이션 및 정보 페이지 구현
- [x] Navbar: 'Stitch' 스타일 서브메뉴 및 모바일 퀵 탭 구현
- [x] 주거 섹션: 지도 모드(Map View) 오버레이 및 알림 신청 UI
- [x] 금융 섹션: 상품 비교(Comparison) 드로어 UI 구현

---

## 🚧 현재 주요 이슈

| 이슈 | 내용 | 예정 |
|------|------|------|
| 데이터 실시간성 | 금감원 데이터 월 1회 공시 → 안내 문구 필요 | MVP 반영 |
| API 속도 | 공공데이터 API 응답 지연 가능성 → 캐시 적극 활용 | MVP 반영 |
| 도메인 전환 | fintable.kr 도메인 구매 및 연결 | 정식 런칭 시 |
| Firebase 격리 | Treia 컬렉션과 중복 방지 (Prefix 필수) | 고도화 필수 |
