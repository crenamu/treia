# Checklist: Project Status and Next Steps

## ✅ Completed Tasks

- [x] Firestore named DB (`treia`) 이슈 해결 및 1차 교육 콘텐츠 시딩 완료
- [x] Vercel 배포 시 `createdAt` Timestamp 관련 Runtime TypeError 방어 로직 추가 완료
- [x] 캘린더 컴포넌트 'tomorrow' 빈 화면 문제 원인 분석 완료 (실제 지표 부재 확인)
- [x] 캘린더 API `route.ts` Gemini 번역 실패 예외처리(Try/Catch) 적용 완료 (Fallback 영문 표시)
- [x] 마크다운 콘텐츠(캔들, 피보나치, 매물대, 이평선) 내 실제 설명용 고품질 Unsplash 예시 이미지 삽입 완료
- [x] 인사이트 썸네일 고도화 - 35종의 고품질 랜덤 해시 매핑 스크립트로 `seed_from_docs.mjs` 수정 후 DB 2차 시딩 (50개) 완벽 적용
- [x] 인사이트 메인화면(`app/education/page.tsx`) UI 전면 개편 - 단조로운 Grid에서 넷플릭스 스타일의 카테고리별 가로 스크롤(스와이프 캐러셀) 뷰로 UI/UX 프리미엄화 완료
- [x] 맥락 노트 내 '자동매매(EA)가이드 + 카피트레이딩' 비즈니스 컨셉 및 파이프라인 분석 업데이트 완료

- [x] 홈 화면 대시보드 스크롤 적용 및 교육 페이지 내 좌우 스크롤(Chevron버튼) 캐러셀 UI/UX 적용 완료
- [x] 주요 캔들 패턴(도지, 망치형, 장악형, 샛별형) 교육 자료에 동적 생성된 SVG 캔들 이미지 파일 적용 및 DB 시딩 완료
- [x] 'EA 제작 도구 (EA Builder)' 템플릿 페이지(`app/ea/builder/page.tsx`) 초기 프리미엄 노코드 UI 개발 완료
- [x] ESLint any 타입 에러 등 코드베이스 린트 워닝 개선 완료

## 🔄 Current Work in Progress

- [ ] 헤더(GNB) 카테고리 '인사이트', '시그널', 'EA랩' 등 사용자 비전(EA/카피트레이딩)에 맞춰 전면 재구성
- [ ] 퍼포먼스 리뷰 메뉴(track) UI 및 데이터 설계 방향성 논의 (CSV 연동 vs 실시간)
- [ ] 임시 개방한 Firestore 보안 규칙 최적화 및 복원 로직 검토

## 📋 Next Steps

1. 홈 상단 GNB 메뉴 구성안 확정 및 `app/layout.tsx` Header 수정 반영
2. 퍼포먼스 리뷰 기능 개발 (혹은 텔레그램 알림을 통한 관점 공유 뷰어 개선)
3. EA Builder 내 AI 연동 기능 고도화 (사용자 선택 지표를 MQL5 코드로 변환해주는 AI 프롬프트 생성 로직 연동)
