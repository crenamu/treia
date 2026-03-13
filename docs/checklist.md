# 핀테이블(FinTable) 체크리스트 (Checklist)

_최종 업데이트: 2026-03-13 (금) 14:00 KST_

---

## 🏗️ 1. 프로젝트 기반 수립 (FinTable 전환)

- [ ] Tailwind CSS v4 테마 설정 (옅은 베이지 `#FBF9F6` 베이스)
- [ ] GNB(네비게이션) 구조 설계 (Treia 링크 포함)
- [ ] 폴더 구조 재편 (`app/treia` 이동 등)
- [ ] 환경 변수(`.env.local`) 금감원/공공데이터 API 키 세팅

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
- [x] 임대주택 공고 리스트 UI 구현 (`/housing`)

---

## 🚀 5. 배포 및 안정화

- [ ] Vercel 환경 변수 등록
- [ ] API 서버사이드 캐싱 전략(`revalidate`) 적용 확인
- [ ] 모바일 반응형 UX 최종 점검

---

## 🚧 현재 주요 이슈

| 이슈 | 내용 | 예정 |
|------|------|------|
| 데이터 실시간성 | 금감원 데이터 월 1회 공시 → 안내 문구 필요 | MVP 반영 |
| API 속도 | 공공데이터 API 응답 지연 가능성 → 캐시 적극 활용 | MVP 반영 |
| 도메인 전환 | fintable.kr 도메인 구매 및 연결 | 정식 런칭 시 |
