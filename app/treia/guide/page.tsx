import { Key, LineChart, MoveDown, Search, Smartphone } from "lucide-react";

export default function GuidePage() {
	return (
		<div className="min-h-screen bg-[var(--treia-bg)] text-[var(--treia-text)] font-sans">
			{/* Header */}
			<header className="py-20 text-center px-6 relative border-b border-[var(--treia-section-border)] overflow-hidden">
				<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#c8a84b]/10 blur-[120px] rounded-full pointer-events-none"></div>
				<div className="relative z-10 max-w-3xl mx-auto">
					<p className="text-[#c8a84b] font-mono text-sm tracking-[4px] uppercase mb-4">
						Treia Gold Algorithm Engine
					</p>
					<h1 className="text-3xl md:text-5xl font-light tracking-tight text-[var(--treia-text)] mb-6">
						실시간 엔진 감시를 위한 <br />{" "}
						<strong className="font-medium">3분 모바일 접속 가이드</strong>
					</h1>
					<p className="text-[16px] md:text-[19px] text-[var(--treia-sub)] leading-[1.8] font-light">
						전 세계 1위 트레이딩 플랫폼인 MT5(MetaTrader 5) 앱을 통해
						<br className="hidden md:block" />
						어떠한 조작도 불가능한 트레이아 엔진의 실시간 구동 내역을 100%
						투명하게 확인하십시오.
					</p>
				</div>
			</header>

			{/* Steps */}
			<main className="max-w-4xl mx-auto py-24 px-6 flex flex-col gap-24">
				{/* Step 1 */}
				<section className="relative">
					<div className="flex flex-col md:flex-row gap-12 items-center">
						{/* 텍스트 영역 */}
						<div className="flex-1">
							<div className="flex items-center gap-4 mb-6">
								<div className="w-12 h-12 rounded-xl bg-[var(--treia-card)] border border-[var(--treia-card-border)] flex items-center justify-center text-[#c8a84b] font-mono text-xl shadow-lg">
									1
								</div>
								<h2 className="text-2xl md:text-3xl font-medium text-[var(--treia-text)]">
									앱 다운로드
								</h2>
							</div>
							<p className="text-[17px] text-[var(--treia-sub)] leading-[1.9] font-light mb-6 break-keep">
								스마트폰의 앱 스토어(또는 플레이 스토어)에서{" "}
								<strong className="text-[var(--treia-text)]">`MetaTrader 5`</strong>를
								검색하여 설치해 주십시오.
								<br />전 세계 트레이더들이 사용하는 글로벌 인증 공식
								애플리케이션입니다.
							</p>
							<div className="flex gap-4">
								<span className="px-4 py-2 bg-[var(--treia-card)] text-[var(--treia-sub)] rounded-lg text-sm border border-[var(--treia-card-border)] flex items-center gap-2">
									<Smartphone size={16} /> iOS (Apple)
								</span>
								<span className="px-4 py-2 bg-[var(--treia-card)] text-[var(--treia-sub)] rounded-lg text-sm border border-[var(--treia-card-border)] flex items-center gap-2">
									<Smartphone size={16} /> Android (Google)
								</span>
							</div>
						</div>

						{/* 이미지 영역 (나중에 대표님이 캡처본 넣을 곳) */}
						<div className="flex-1 w-full relative">
							<div className="aspect-[9/16] max-w-[300px] mx-auto bg-[var(--treia-card)] border border-[var(--treia-card-border)] rounded-3xl flex flex-col items-center justify-center text-[var(--treia-sub)] shadow-2xl relative overflow-hidden">
								<Smartphone size={40} className="mb-4 opacity-30" />
								<span className="text-sm font-light">
									[대표님 캡처 이미지 삽입 영역]
								</span>
								<span className="text-xs mt-2 text-[#444] text-center px-4">
									앱 스토어에서 MetaTrader 5 검색 화면
								</span>
								{/* 실사용 시 여기에 <Image src="/images/step1.png" fill className="object-cover" /> 과 같이 넣으시면 됩니다. */}
							</div>
						</div>
					</div>
				</section>

				{/* 화살표 구분선 */}
				<div className="flex justify-center text-[var(--treia-section-border)]">
					<MoveDown size={40} strokeWidth={1} />
				</div>

				{/* Step 2 */}
				<section className="relative">
					<div className="flex flex-col md:flex-row-reverse gap-12 items-center">
						{/* 텍스트 영역 */}
						<div className="flex-1">
							<div className="flex items-center gap-4 mb-6">
								<div className="w-12 h-12 rounded-xl bg-[var(--treia-card)] border border-[var(--treia-card-border)] flex items-center justify-center text-[#c8a84b] font-mono text-xl shadow-lg">
									2
								</div>
								<h2 className="text-2xl md:text-3xl font-medium text-[var(--treia-text)]">
									서버 검색
								</h2>
							</div>
							<p className="text-[17px] text-[var(--treia-sub)] leading-[1.9] font-light break-keep">
								앱 실행 후{" "}
								<strong className="text-[var(--treia-text)]">[설정] - [새 계좌]</strong> 추가
								버튼을 누른 뒤, 상단의 검색창에{" "}
								<strong className="text-[var(--treia-text)]">&apos;Infinox&apos;</strong>를
								타이핑해 주십시오.
								<br />
								<br />
								목록에 나타나는{" "}
								<strong className="text-[#c8a84b] font-medium">
									&quot;InfinoxLimited-MT5Demo&quot;
								</strong>{" "}
								서버를 한 번 터치하시면 됩니다.
							</p>
						</div>

						{/* 이미지 영역 */}
						<div className="flex-1 w-full relative">
							<div className="aspect-[9/16] max-w-[300px] mx-auto bg-[var(--treia-card)] border border-[var(--treia-card-border)] rounded-3xl flex flex-col items-center justify-center text-[var(--treia-sub)] shadow-2xl relative overflow-hidden">
								<Search size={40} className="mb-4 opacity-30" />
								<span className="text-sm font-light">
									[대표님 캡처 이미지 삽입 영역]
								</span>
								<span className="text-xs mt-2 text-[#444] text-center px-4">
									새 계좌 화면에서 Infinox 검색 화면
								</span>
							</div>
						</div>
					</div>
				</section>

				{/* 화살표 구분선 */}
				<div className="flex justify-center text-[var(--treia-section-border)]">
					<MoveDown size={40} strokeWidth={1} />
				</div>

				{/* Step 3 */}
				<section className="relative">
					<div className="flex flex-col md:flex-row gap-12 items-center">
						{/* 텍스트 영역 */}
						<div className="flex-1">
							<div className="flex items-center gap-4 mb-6">
								<div className="w-12 h-12 rounded-xl bg-[var(--treia-card)] border border-[var(--treia-card-border)] flex items-center justify-center text-[#c8a84b] font-mono text-xl shadow-lg">
									3
								</div>
								<h2 className="text-2xl md:text-3xl font-medium text-[var(--treia-text)]">
									접속 정보 입력
								</h2>
							</div>
							<p className="text-[17px] text-[var(--treia-sub)] leading-[1.9] font-light mb-6 break-keep">
								미리 이메일로 받아두신{" "}
								<strong className="text-[var(--treia-text)]">[로그인 ID]</strong>와{" "}
								<strong className="text-[#c8a84b]">[관전자 비밀번호]</strong>를{" "}
								<strong className="text-[var(--treia-text)] underline underline-offset-4 decoration-[var(--treia-card-border)]">
									대소문자 구분
								</strong>
								하여 정확히 입력하십시오.
								<br />
								<br />
								하단의 &apos;로그인&apos; 버튼을 누르는 순간, 실시간 엔진 구동
								내역을 100% 투명하게 볼 수 있는 통제실로 입장하게 됩니다.
							</p>
							{/* Info Box */}
							<div className="bg-[#10B981]/5 border border-[#10B981]/20 rounded-xl p-5 flex items-start gap-4">
								<Key className="text-[#10B981] w-6 h-6 flex-shrink-0 mt-1" />
								<p className="text-[14px] text-[#888] font-light leading-relaxed">
									<strong className="text-[#10B981] font-medium">참고:</strong>{" "}
									관전자 비밀번호(Investor Password)로 로그인하면, 매매나 출금
									같은 조작 권한은 완벽히 차단되며 오직{" "}
									<strong className="text-[var(--treia-text)]">
										잔류 포지션 및 거래 내역의 &apos;조회&apos;만 가능
									</strong>
									합니다.
								</p>
							</div>
						</div>

						{/* 이미지 영역 */}
						<div className="flex-1 w-full relative">
							<div className="aspect-[9/16] max-w-[300px] mx-auto bg-[#0a0a0a] border border-[#222] rounded-3xl flex flex-col items-center justify-center text-[#555] shadow-2xl relative overflow-hidden">
								<Key size={40} className="mb-4 opacity-50" />
								<span className="text-sm font-light">
									[대표님 캡처 이미지 삽입 영역]
								</span>
								<span className="text-xs mt-2 text-[#444] text-center px-4">
									로그인 ID 및 비밀번호 입력 화면
								</span>
							</div>
						</div>
					</div>
				</section>

				{/* Tip Section */}
				<section className="mt-12 pt-16 border-t border-[var(--treia-section-border)]">
					<div className="bg-[var(--treia-card)] border border-[var(--treia-card-border)] rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto shadow-xl">
						<LineChart
							className="w-12 h-12 text-[#c8a84b] mx-auto mb-6 opacity-80"
							strokeWidth={1.5}
						/>
						<h3 className="text-xl md:text-2xl font-medium text-[var(--treia-text)] mb-4">
							👀 어떻게 보면 되나요?
						</h3>
						<p className="text-[16px] text-[var(--treia-sub)] leading-[1.8] font-light break-keep">
							하단 메뉴에 위치한{" "}
							<strong className="text-[var(--treia-text)] border-b border-[var(--treia-card-border)] pb-0.5">
								[거래]
							</strong>{" "}
							탭에서는 현재 진입 중인 실시간 포지션과 평가 손익을,
							<br className="hidden md:block" />
							<strong className="text-[var(--treia-text)] border-b border-[var(--treia-card-border)] pb-0.5">
								[이력]
							</strong>{" "}
							탭에서는 과거의 모든 진입/청산의 손익 결과들을 확인하실 수
							있습니다.
							<br />
							<br />
							<span className="text-[#c8a84b] font-medium">
								알고리즘이 어떻게 철저하게 계좌를 방어하며 복리를 쌓아 올리는지
								직접 감상하십시오.
							</span>
						</p>
					</div>
				</section>
			</main>

			{/* Footer */}
			<footer className="py-12 border-t border-[var(--treia-section-border)] text-center">
				<p className="text-[var(--treia-sub)] text-[12px] uppercase tracking-widest">
					&copy; Treia Algorithm Platform.
				</p>
			</footer>
		</div>
	);
}
