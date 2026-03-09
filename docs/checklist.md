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

## 🔄 Current Work in Progress

- [ ] 홈 화면 대시보드 내 특정 위젯 추가 또는 레이아웃 고도화
- [ ] 퍼포먼스 리뷰 메뉴(track) UI 및 데이터 설계 방향성 논의 (CSV 연동 vs 실시간)
- [ ] 임시 개방한 Firestore 보안 규칙 최적화 및 복원 로직 검토

## 📋 Next Steps

1. 홈 상단 GNB 메뉴 구성안 확정 및 수정 반영 (개념에 맞춰 '인사이트', '시그널', 'EA랩' 등 메뉴화)
2. 퍼포먼스 리뷰 기능 개발 (혹은 텔레그램 알림을 통한 관점 공유 뷰어 개선)
3. 전체적인 Dark & Gold(Amber) 테마 밸런싱 점검 및 마이크로 애니메이션 강화
