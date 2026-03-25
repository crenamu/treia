"use client";
import {
	ArrowUpRight, ArrowLeft, Download, ShieldCheck,
	TrendingUp, BarChart3, Clock, Zap, Target,
	Info, CheckCircle2, AlertCircle, ChevronRight,
	PlayCircle, Globe, Layers, Lock, Menu, X
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, AnimatePresence, animate } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import Script from 'next/script';

export default function TreiaFunnelPage() {
	const [isNavOpen, setIsNavOpen] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		contact: "",
		reason: "",
		inquiry: "사전 예약: 개인용 자동매매 소프트웨어 라이선스",
	});
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");

	useEffect(() => {
		document.documentElement.style.scrollBehavior = "smooth";

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("opacity-100", "translate-y-0");
						entry.target.classList.remove("opacity-0", "translate-y-12");
					}
				});
			},
			{ threshold: 0.05 },
		);

		document.querySelectorAll(".reveal").forEach((el) => {
			observer.observe(el);
		});

		return () => observer.disconnect();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.name || !formData.contact) return;

		setIsLoading(true);
		setErrorMsg("");

		try {
			const res = await fetch("/api/lead", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			const data = await res.json();
			if (data.success) {
				setIsSubmitted(true);
			} else {
				setErrorMsg(data.message || "접수에 실패했습니다. 다시 시도해주세요.");
			}
		} catch (err) {
			console.error(err);
			setErrorMsg("서버 오류가 발생했습니다. 잠시 후 시도해주세요.");
		} finally {
			setIsLoading(false);
		}
	};

	const chartData = [
		0.97, 1.57, 33.46, 33.77, 66.85, 67.41, 81.86, 113.39, 115.27, 116.26,
		116.86, 130.48, 144.1, 159.12, 174.05, 187.36, 151.14, 115.57, 87.55, 59.53,
		36.71, 19.76, 20.32, 20.92, 11.76, 5.03, 3.08, 15.13, 15.71, 16.31, 22.47,
		23.09, 23.69, 24.29, 24.98, 30.72, 36.75, 47.77, 58.01, 57.98, 57.49, 55.2,
		53.28, 56.1, 20.14, -15.92, -49.27, -82.7, -65.65, -59.97, -66.87, -65.91,
		-64.95, -64.35, -63.75, -62.89, -62.29, -56.56, -50.12, -43.68, -43.08,
		-42.48, -41.88, -41.28, -40.69, -40.09, -39.49, -38.89, -38.29, -37.69,
		-30.53, -23.37, -16.21, -7.89, 3.89, 15.67, 27.45, 39.23, 54.84, 70.45,
		86.06, 102.86, 121.72, 142.45, 163.18, 170.14, 177.14, 186.14, 189.88,
		191.55, 193.29, 182.99, 172.76, 165.06, 157.38, 152.65, 149.87, 148.55,
		147.29, 147.35, 145.85, 144.64, 147.37, 151.82, 157.52, 169.41, 181.21,
		208.3, 235.39, 285.71, 337.05, 360.62, 384.19, 429.67, 475.15, 497.38,
		519.61, 562.77, 605.93, 626.64, 647.35, 648.73, 658.92, 669.36, 669.97,
		704.29, 767.28, 776.59, 792.86, 802.17, 818.44, 827.75, 837.06, 853.33,
		869.6, 879.19, 888.78, 897.96, 907.14, 917.89, 928.64, 939.37, 950.1,
		959.14, 968.18, 977.24, 986.3,
	];

	// Create SVG path string dynamically
	const width = 800;
	const height = 200;
	const minVal = -100;
	const maxVal = 1000;
	const range = maxVal - minVal;
	const stepX = width / (chartData.length - 1);

	const generatePath = (data: number[]) => {
		return data
			.map((val, i) => {
				const x = i * stepX;
				const y = height - ((val - minVal) / range) * height;
				return `${i === 0 ? "M" : "L"}${x},${y}`;
			})
			.join(" ");
	};
	const dPath = generatePath(chartData);
	const dFill = `${dPath} L${width},${height} L0,${height} Z`;

	return (
		<div className="w-full bg-[#050505] text-[#f2f2f2] font-sans break-keep overflow-x-hidden selection:bg-[#c8a84b] selection:text-[#050505]">
			{/* Sticky Header */}
			<header className="fixed top-0 left-0 w-full z-[100] bg-[#050505]/95 border-b border-white/5">
				<div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
					<Link href="#hero" className="flex items-center">
						<div className="relative h-8 md:h-10 w-32 md:w-40">
							<Image
								src="/treia_white_logo.png"
								alt="Treia Logo"
								fill
								className="object-contain object-left group-hover:scale-105 transition-transform duration-300"
								priority
							/>
						</div>
					</Link>

					{/* Desktop Nav */}
					<nav className="hidden md:flex items-center gap-10 text-[13px] font-mono tracking-widest uppercase text-[#7a7f8e]">
						<Link
							href="#philosophy"
							className="hover:text-[#c8a84b] transition-colors"
						>
							Philosophy
						</Link>
						<Link
							href="#origin"
							className="hover:text-[#c8a84b] transition-colors"
						>
							Origin
						</Link>
						<Link
							href="#benefits"
							className="hover:text-[#c8a84b] transition-colors"
						>
							Benefits
						</Link>
						<Link
							href="#why-treia"
							className="hover:text-[#c8a84b] transition-colors"
						>
							Why Treia
						</Link>
						<Link
							href="#proof"
							className="hover:text-[#c8a84b] transition-colors"
						>
							Proof
						</Link>
						<Link
							href="#faq"
							className="hover:text-[#c8a84b] transition-colors"
						>
							FAQ
						</Link>
						<Link
							href="#apply"
							className="bg-[#c8a84b] text-[#050505] px-5 py-2.5 rounded-full font-bold hover:bg-[#d4b55c] transition-all hover:scale-105"
						>
							Apply
						</Link>
					</nav>

					{/* Mobile Menu Toggle */}
					<button
						type="button"
						className="md:hidden text-white"
						onClick={() => setIsNavOpen(!isNavOpen)}
						aria-label="Toggle Menu"
					>
						{isNavOpen ? <X size={28} /> : <Menu size={28} />}
					</button>
				</div>

				{/* Mobile Nav */}
				<div
					className={`md:hidden absolute top-20 left-0 w-full bg-[#0a0a0d] border-b border-white/5 transition-all duration-300 overflow-hidden ${isNavOpen ? "max-h-[500px] border-b border-white/10" : "max-h-0"}`}
				>
					<div className="px-6 py-10 flex flex-col gap-8 text-center text-sm font-mono tracking-widest uppercase text-[#7a7f8e]">
						<Link
							href="#philosophy"
							onClick={() => setIsNavOpen(false)}
							className="hover:text-[#c8a84b]"
						>
							Philosophy
						</Link>
						<Link
							href="#origin"
							onClick={() => setIsNavOpen(false)}
							className="hover:text-[#c8a84b]"
						>
							Origin
						</Link>
						<Link
							href="#benefits"
							onClick={() => setIsNavOpen(false)}
							className="hover:text-[#c8a84b]"
						>
							Benefits
						</Link>
						<Link
							href="#why-treia"
							onClick={() => setIsNavOpen(false)}
							className="hover:text-[#c8a84b]"
						>
							Why Treia
						</Link>
						<Link
							href="#proof"
							onClick={() => setIsNavOpen(false)}
							className="hover:text-[#c8a84b]"
						>
							Proof
						</Link>
						<Link
							href="#faq"
							onClick={() => setIsNavOpen(false)}
							className="hover:text-[#c8a84b]"
						>
							FAQ
						</Link>
						<Link
							href="#apply"
							onClick={() => setIsNavOpen(false)}
							className="text-[#c8a84b] font-bold"
						>
							Apply Now
						</Link>
					</div>
				</div>
			</header>

			<section
				id="hero"
				className="relative min-h-[100svh] flex flex-col justify-start items-center text-center px-6 pt-32 md:pt-48 scroll-mt-20"
			>
				<div
					className="absolute inset-0 pointer-events-none opacity-[0.01]"
					style={{
						backgroundImage:
							"linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
						backgroundSize: "60px 60px",
					}}
				></div>
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#c8a84b]/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

				<div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center reveal opacity-0 translate-y-12 transition-all duration-[1500ms] mb-20 md:mb-32">
					<div className="relative w-48 h-20 md:w-80 md:h-40 mb-6 reveal opacity-0 scale-95 transition-all duration-1000 flex items-center justify-center">
						<Image
							src="/treia_white_logo.png"
							alt="Treia Gold Logo"
							fill
							className="object-contain"
							priority
						/>
					</div>
					<div className="font-mono text-[12px] md:text-[15px] text-[#c8a84b] tracking-[6px] uppercase mb-10">
						Treia Gold Algorithm Engine
					</div>
					<div className="text-[#c8a84b] font-medium tracking-[3px] mb-10 text-sm md:text-lg border border-[#c8a84b]/20 px-6 py-2 rounded-full bg-[#c8a84b]/5 uppercase font-mono">
						Algorithm Engine v3.0
					</div>
					<h1 className="font-outfit text-4xl md:text-6xl lg:text-[76px] font-light leading-[1.3] tracking-tighter text-white mb-10">
						투자는 당신의 일상을 <br className="hidden md:block" /> 지키기 위한
						수단이어야 합니다.
					</h1>
					<p className="text-[17px] md:text-[24px] text-[#7a7f8e] max-w-3xl leading-[1.8] font-light">
						모니터 앞에서 보내는 긴장된 시간들, 이제는 본업과 가족에게
						돌려주십시오. <br className="hidden lg:block" />내 손가락의
						뇌동매매를 잠그고, 시스템의 견고한 원칙만 남깁니다.{" "}
						<br className="hidden lg:block" />
						감정의 소모 없이 24시간 정교하게 작동하는 생존형 자산 관리 알고리즘.
					</p>
				</div>

				<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 reveal opacity-0 translate-y-4 transition-all duration-1000 delay-500">
					<span className="font-mono text-[9px] tracking-[4px] uppercase text-[#333]">
						Scroll
					</span>
					<div className="w-px h-10 bg-[#1a1a1a] overflow-hidden relative">
						<div className="absolute inset-0 bg-[#c8a84b]/20 animate-[pulse_2s_infinite]"></div>
					</div>
				</div>
			</section>

			{/* Screen 2: The Philosophy */}
			<section
				id="philosophy"
				className="relative min-h-[100svh] flex flex-col justify-center items-center text-center px-6 border-t border-[#111]"
			>
				<div className="absolute bottom-0 w-full h-[50vh] bg-gradient-to-t from-[#c8a84b]/5 to-transparent z-0"></div>

				<div className="relative z-10 max-w-4xl mx-auto reveal opacity-0 translate-y-12 transition-all duration-1000">
					<h2 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-white mb-10 leading-[1.4]">
						&quot;시장을 예측하려 하지 않습니다. <br />{" "}
						<span className="bg-[#c8a84b] text-[#0a0a0a] px-3 py-1 font-bold inline-block mt-2">
							철저하게 대응
						</span>
						할 뿐입니다.&quot;
					</h2>
					<p className="text-[17px] md:text-[22px] text-[#7a7f8e] max-w-3xl mx-auto leading-[1.9] font-light">
						위대한 투자자들도 시장의 거대한 파도 앞에서는 겸손합니다.{" "}
						<br className="hidden md:block" />
						Treia는 시장을 이기려는 오만을 버렸습니다. <br />
						<br />
						대신, 어떤 변동성 속에서도 미리 설정된 방어선을 지키고 살아남는{" "}
						<br className="hidden md:block" />
						<strong className="text-white font-medium">
							&apos;생존의 원칙&apos;
						</strong>
						을 기술로 구현했습니다. <br />
						예측할 수 없는 내일도, 시스템 안에서는 통제 가능한 데이터가 됩니다.
					</p>
				</div>
			</section>

			{/* Screen 2.5: THE ORIGIN */}
			<section
				id="origin"
				className="relative min-h-[100svh] flex flex-col justify-center items-center px-6 py-24 border-t border-[#111] bg-[#050505]"
			>
				<div className="max-w-4xl mx-auto reveal opacity-0 translate-y-12 transition-all duration-1000">
					<div className="text-center mb-16">
						<span className="text-[#c8a84b] font-mono text-sm tracking-[4px] uppercase block mb-6">
							THE ORIGIN
						</span>
						<h2 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-white mb-10 leading-[1.4]">
							12년의 수업료가 <br className="md:hidden" />{" "}
							<span className="text-[#c8a84b]">이 엔진을 만들었습니다.</span>
						</h2>
					</div>

					<div className="bg-[#0a0b0e] border border-[#1a1a1a] rounded-3xl p-8 md:p-12 mb-16 shadow-2xl relative overflow-hidden text-left">
						<div className="absolute top-0 right-0 w-64 h-64 bg-[#c8a84b]/5 blur-[80px] rounded-full pointer-events-none"></div>
						<p className="text-[17px] md:text-[21px] text-[#a1a1aa] leading-[1.9] font-light break-keep">
							시장에서 이기는 원칙을 만드는 것도 어렵지만, 더 어려운 건 그
							원칙을 감정 없이 매번 그대로 지켜내는 것입니다. <br />
							<br />
							제가 속한 커뮤니티에는 2,000명의 실계좌 트레이더가 있습니다. 같은
							교육을 받고, 같은 방식으로 매매하지만 결과는 극명합니다.{" "}
							<strong className="text-white font-medium">
								6억 손실 후 폐관수련을 거쳐 매일 1억 이상을 버는 천재
							</strong>
							도 있고,{" "}
							<strong className="text-white font-medium">
								100달러를 1년 6개월 만에 1,000만 달러로 만든 전설적인 동료
							</strong>
							도 있습니다. <br />
							<br />
							하지만 그들은 3% 미만의 극소수입니다. 12년간 그 현실을 보며 깨달은
							것은, 아무리 훌륭한 전략도 인간의 심리 앞에서는 무너진다는
							사실입니다.{" "}
							<strong className="text-[#c8a84b] font-semibold">
								파레토 법칙보다 훨씬 희박한 이 시장의 승률을 뚫고 원칙을 지키게
								만드는 건 사람이 아니라 시스템이어야 합니다.
							</strong>{" "}
							이것이 Treia 엔진 개발을 시작한 단 하나의 이유입니다.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative text-left">
						<div className="absolute top-1/2 left-0 right-0 h-px bg-[#1a1a1a] hidden md:block -translate-y-1/2 z-0"></div>

						<div className="bg-[#0f0f12] border border-[#c8a84b]/30 p-8 rounded-2xl relative z-10 shadow-xl group hover:border-[#c8a84b] transition-colors">
							<div className="absolute top-0 right-8 -translate-y-1/2 bg-[#c8a84b] text-[#050505] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
								Current
							</div>
							<div className="text-[#c8a84b] font-mono text-xl mb-4">1단계</div>
							<h4 className="text-white text-lg font-medium mb-4">
								모의 프론트테스트
							</h4>
							<p className="text-[#7a7f8e] text-sm leading-relaxed font-light">
								실제 시장 데이터로 EA를 구동하며 매일 최적화합니다. 어제의
								데이터가 오늘 아침 업데이트로 이어집니다.
							</p>
						</div>

						<div className="bg-[#0a0a0d] border border-[#1a1a1a] p-8 rounded-2xl relative z-10 shadow-lg">
							<div className="text-[#444] font-mono text-xl mb-4">2단계</div>
							<h4 className="text-white/60 text-lg font-medium mb-4">
								실계좌 테스트
							</h4>
							<p className="text-[#444] text-sm leading-relaxed font-light">
								모의 테스트가 안정화되면 실제 자금으로 전환합니다. 수익률과
								MDD를 실계좌 기준으로 다시 검증합니다.
							</p>
						</div>

						<div className="bg-[#0a0a0d] border border-[#1a1a1a] p-8 rounded-2xl relative z-10 shadow-lg">
							<div className="text-[#444] font-mono text-xl mb-4">3단계</div>
							<h4 className="text-white/60 text-lg font-medium mb-4">
								관전자 초대
							</h4>
							<p className="text-[#444] text-sm leading-relaxed font-light">
								실계좌 트랙레코드가 쌓이면 MT5 관전자 계정을 선별 초대합니다.
								숫자를 직접 보고 판단하세요.
							</p>
						</div>
					</div>

				</div>
			</section>

			{/* Screen 3: The Canvas */}
			<section className="relative min-h-[100svh] flex flex-col justify-center items-center text-center px-6 border-t border-[#111] overflow-hidden">
				<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#c8a84b]/10 blur-[150px] mix-blend-screen pointer-events-none"></div>

				<div className="relative z-10 max-w-4xl mx-auto reveal opacity-0 translate-y-12 transition-all duration-1000">
					<div className="flex justify-center mb-8">
						<div className="w-24 h-24 border border-[#c8a84b]/30 rounded-full flex items-center justify-center text-[#c8a84b] shadow-[0_0_50px_rgba(200,168,75,0.15)] relative">
							<div className="absolute inset-2 border border-[#c8a84b]/10 rounded-full animate-[spin_10s_linear_infinite]"></div>
							<Globe size={40} strokeWidth={1} />
						</div>
					</div>
					<h2 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-white mb-10 leading-[1.4]">
						알고리즘이 가장 완벽하게 작동하는 무대, <br /> 순수한 실물 자산{" "}
						<span className="text-[#c8a84b] font-normal">
							&apos;금(Gold)&apos;
						</span>
					</h2>
					<p className="text-[17px] md:text-[22px] text-[#7a7f8e] max-w-3xl mx-auto leading-[1.9] font-light">
						개별 기업의 훌륭한 비전과 내재 가치를 평가하는 주식 시장과 달리,{" "}
						<br className="hidden md:block" />전 세계 자금이 모이는 금(XAUUSD)
						시장은 외부 노이즈에 강하고 일정한 거시적 파동을 그립니다.
						<br />
						<br />
						여기에 상승과 하락 모든 방향에서 유연하게 대응할 수 있는
						CFD(차액결제거래) 환경을 결합하여,{" "}
						<br className="hidden md:block" />
						<strong className="text-white font-medium">
							시장의 흐름에 가장 순응하는 투자 모델
						</strong>
						을 완성했습니다.
					</p>
				</div>
			</section>

			{/* Screen 4: The Mechanism */}
			<section className="relative min-h-[100svh] flex flex-col justify-center items-center px-6 py-32 border-t border-[#111]">
				<div className="relative z-10 text-center mb-24 reveal opacity-0 translate-y-12 transition-all duration-1000">
					<h2 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-white leading-[1.4]">
						리스크를 통제하는 <br className="md:hidden" />{" "}
						<span className="text-[#c8a84b]">3가지 견고한 안전장치</span>
					</h2>
				</div>

				<div className="relative w-full max-w-3xl mx-auto flex flex-col gap-16 md:gap-24 z-10">
					<div className="absolute left-[39px] md:left-[59px] top-10 bottom-10 w-px bg-[#1a1a1a]"></div>

					{[
						{
							icon: <Layers size={32} strokeWidth={1.5} className="md:w-12 md:h-12" />,
							title: "합리적인 자산 배분",
							text: "극단적인 배수 진입(마틴게일)을 전면 차단하고, 계좌가 감당할 수 있는 철저한 예산 안에서만 움직입니다.",
							delay: 0
						},
						{
							icon: <Lock size={32} strokeWidth={1.5} className="md:w-12 md:h-12" />,
							title: "흔들림 없는 방어선",
							text: "진입과 동시에 리스크의 한계를 명확히 설정하여, 단 한 번의 방향성 오류가 치명상으로 이어지는 것을 방지합니다.",
							delay: 0.2
						},
						{
							icon: <Target size={32} strokeWidth={1.5} className="md:w-12 md:h-12" />,
							title: "탄력적인 수익 추적",
							text: "강력한 추세가 형성되면 익절 구간을 유연하게 확장(Trailing)하여, 시장이 허락하는 기회를 온전히 담아냅니다.",
							delay: 0.4
						}
					].map((item, idx) => (
						<motion.div 
							key={idx}
							initial={{ opacity: 0, x: -30 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8, delay: item.delay }}
							viewport={{ once: true }}
							className="flex gap-8 md:gap-12 items-start relative"
						>
							<div className="relative z-10 flex-shrink-0 w-20 h-20 md:w-32 md:h-32 rounded-full bg-[#0a0a0a] border border-[#c8a84b]/30 flex items-center justify-center text-[#c8a84b] shadow-[0_0_30px_rgba(200,168,75,0.1)] group hover:border-[#c8a84b] transition-colors">
								{item.icon}
							</div>
							<div className="pt-2 md:pt-6">
								<h3 className="text-2xl md:text-4xl font-normal text-white mb-4 group-hover:text-[#c8a84b] transition-colors">
									{item.title}
								</h3>
								<p className="text-[17px] md:text-[21px] text-[#7a7f8e] leading-[1.8] font-light break-keep">
									{item.text}
								</p>
							</div>
						</motion.div>
					))}
				</div>
			</section>

			{/* Screen 5: Benefit 1 - Time Freedom */}
			<section
				id="benefits"
				className="relative min-h-[100svh] flex flex-col justify-center items-center text-center px-6 border-t border-[#111] bg-[#030303]"
			>
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/5 blur-[120px] rounded-full pointer-events-none"></div>

				<div className="relative z-10 max-w-4xl mx-auto reveal opacity-0 translate-y-12 transition-all duration-1000">
					<div className="mb-8 flex justify-center">
						<div className="w-20 h-20 rounded-2xl bg-[#0a0b0e] border border-[#1e2028] flex items-center justify-center shadow-2xl">
							<Clock className="w-10 h-10 text-blue-400" strokeWidth={1.5} />
						</div>
					</div>
					<span className="text-blue-400 font-mono text-sm tracking-[4px] uppercase block mb-6">
						Benefit 1. 시간의 자유
					</span>
					<h2 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-white mb-10 leading-[1.4]">
						당신의{" "}
						<span className="bg-[#c8a84b] text-[#0a0a0a] px-3 py-1 font-bold inline-block mb-1">
							낮과 밤
						</span>
						을 돌려드립니다.
					</h2>
					<p className="text-[17px] md:text-[22px] text-[#7a7f8e] max-w-3xl mx-auto leading-[1.9] font-light">
						회의 중에 주식 창을 몰래 보며 땀 흘릴 필요가 없습니다.{" "}
						<br className="hidden md:block" />
						트레이아 알고리즘 엔진은 당신이 본업에 집중하고, 가족과 저녁을 먹고,{" "}
						<br className="hidden md:block" />
						깊은 잠에 빠진 순간에도{" "}
						<strong className="text-white font-medium">
							24시간 당신의 계좌를 모니터링
						</strong>
						합니다.
						<br />
						<br />
						당신은 아침에 일어나 밤새 엔진이 지켜낸 결과만 확인하십시오.
					</p>
				</div>
			</section>

			{/* Screen 6: Benefit 2 - Psychological Peace */}
			<section className="relative min-h-[100svh] flex flex-col justify-center items-center text-center px-6 border-t border-[#111] bg-[#050505] overflow-hidden">
				{/* Abstract Whipsaw Chart Background */}
				<div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
					<svg
						viewBox="0 0 1000 400"
						className="w-[150%] h-auto stroke-[#ef4444]"
						preserveAspectRatio="none"
						fill="none"
						strokeWidth="1"
					>
						<title>Whipsaw Background Chart</title>
						<path
							d="M0,200 L100,190 L120,250 L140,150 L160,280 L180,100 L200,350 L220,50 L240,300 L260,150 L280,250 L300,190 L1000,190"
							strokeDasharray="5,5"
						/>
					</svg>
				</div>

				<div className="relative z-10 max-w-4xl mx-auto reveal opacity-0 translate-y-12 transition-all duration-1000">
					<div className="mb-8 flex justify-center">
						<div className="w-20 h-20 rounded-2xl bg-[#0a0b0e] border border-[#1e2028] flex items-center justify-center shadow-2xl relative">
							<ShieldCheck
								className="w-10 h-10 text-[#10B981]"
								strokeWidth={1.5}
							/>
						</div>
					</div>
					<span className="text-[#10B981] font-mono text-sm tracking-[4px] uppercase block mb-6">
						Benefit 2. 심리적 평온
					</span>
					<h2 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-white mb-10 leading-[1.4]">
						FOMC 금리 발표의 밤, <br />{" "}
						<span className="bg-[#c8a84b] text-[#0a0a0a] px-3 py-1 font-bold inline-block mt-2">
							숙면을 취하십시오.
						</span>
					</h2>
					<p className="text-[17px] md:text-[22px] text-[#7a7f8e] max-w-3xl mx-auto leading-[1.9] font-light">
						어제 새벽 미장 금리 발표로 시장이 요동칠 때,{" "}
						<br className="hidden md:block" />
						수동 매매자들은 공포에 질려 뜬눈으로 밤을 새웠습니다. <br />
						<br />
						하지만 트레이아 유저들은 평온하게 숙면을 취했습니다.{" "}
						<br className="hidden md:block" />
						<strong className="text-white font-medium">
							감정이 없는 엔진이 칼같이 위험을 차단하고, 수익 구간만 온전히
							취했기 때문입니다.
						</strong>
					</p>
				</div>
			</section>

			{/* Screen 7: Benefit 3 - Account Survival */}
			<section className="relative min-h-[100svh] flex justify-center items-center px-6 py-20 border-t border-[#111] bg-[#030303]">
				<div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
					<div className="reveal opacity-0 translate-y-12 transition-all duration-1000 text-center lg:text-left">
						<span className="text-[#c8a84b] font-mono text-sm tracking-[4px] uppercase block mb-6">
							Benefit 3. 계좌의 생존
						</span>
						<h2 className="text-3xl md:text-5xl lg:text-5xl xl:text-6xl font-light tracking-tight text-white mb-8 leading-[1.4]">
							<span className="bg-[#c8a84b] text-[#0a0a0a] px-3 py-1 font-bold inline-block mb-2">
								잃지 않는 자만이
							</span>
							<br />
							결국 복리를 누립니다.
						</h2>
						<p className="text-[17px] md:text-[21px] text-[#7a7f8e] leading-[1.8] font-light max-w-xl mx-auto lg:mx-0">
							수익 극대화보다 중요한 것은{" "}
							<strong>&apos;계좌의 생존&apos;</strong>입니다. <br />
							-50% 손실을 입으면 원금을 복구하기 위해 +100%의 수익을 내야
							합니다. <br />
							<br />
							트레이아 엔진의 최우선 목표는 화려한 대박이 아닙니다.{" "}
							<br className="hidden lg:block" />
							<strong className="text-white font-medium">
								철저한 기계적 손절로 치명상을 막고, 잃지 않는 매매를 누적시켜
								거대한 복리의 마법을 완성하는 것
							</strong>
							입니다.
						</p>
					</div>

					<div className="reveal opacity-0 translate-y-12 transition-all duration-1000 delay-200 w-full">
						<div className="bg-[#0a0b0e] border border-[#1e2028] rounded-[32px] p-10 md:p-14 shadow-2xl relative overflow-visible">
							<div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#ef4444]/5 blur-[80px] rounded-full pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>

							<h3 className="text-[#a1a1aa] font-mono text-sm tracking-widest uppercase mb-16 text-center lg:text-left relative z-10">
								THE TRAP OF DRAWDOWN
							</h3>

							<div className="flex flex-col gap-12 relative z-10">
								<div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
									<div className="text-5xl font-light text-[#ef4444] w-32 shrink-0">
										-50%
									</div>
									<div className="flex-1 w-full">
										<motion.div 
											initial={{ width: 0 }}
											whileInView={{ width: "50%" }}
											transition={{ duration: 1, ease: "easeOut" }}
											viewport={{ once: true }}
											className="h-4 bg-[#ef4444] rounded-full relative shadow-[0_0_15px_rgba(239,68,68,0.3)]"
										>
											<span className="absolute top-8 left-0 text-[13px] text-[#7a7f8e] md:whitespace-nowrap font-medium tracking-wide">
												계좌 반토막
											</span>
										</motion.div>
									</div>
								</div>

								<div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 mt-4 md:mt-0">
									<div className="text-5xl font-light text-[#10B981] w-32 shrink-0">
										+100%
									</div>
									<div className="flex-1 w-full">
										<motion.div 
											initial={{ width: 0 }}
											whileInView={{ width: "100%" }}
											transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
											viewport={{ once: true }}
											className="h-4 bg-[#10B981] rounded-full relative shadow-[0_0_15px_rgba(16,185,129,0.3)]"
										>
											<span className="absolute top-8 right-0 md:right-auto md:left-full md:-ml-[120px] text-[13px] text-white font-bold md:whitespace-nowrap tracking-wide drop-shadow-md">
												원금 복구에 필요한 수익률
											</span>
										</motion.div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Screen 7.5: WHY TREIA (Comparison Table) */}
			<section
				id="why-treia"
				className="relative py-24 md:py-32 px-6 border-t border-[#111] bg-[#050505]"
			>
				<div className="max-w-5xl mx-auto reveal opacity-0 translate-y-12 transition-all duration-1000">
					<div className="text-center mb-16">
						<span className="text-[#c8a84b] font-mono text-sm tracking-[4px] uppercase block mb-6">
							WHY TREIA
						</span>
						<h2 className="text-3xl md:text-5xl font-light tracking-tight text-white mb-8 leading-[1.4]">
							같은 자동매매,{" "}
							<span className="text-[#c8a84b]">다른 게임입니다.</span>
						</h2>
						<p className="text-[#7a7f8e] text-[17px] md:text-[20px] max-w-2xl mx-auto font-light leading-relaxed">
							국내에도 검증된 자동매매 시스템이 있습니다. 하지만 대부분 국내
							주식 시장을 대상으로 합니다. Treia는 다른 무대에서 다른 방식으로
							작동합니다.
						</p>
					</div>

					<div className="overflow-x-auto mb-12">
						<table className="w-full text-left min-w-[600px] border-collapse">
							<thead>
								<tr className="border-b border-[#222]">
									<th className="py-6 px-4 text-[#444] font-mono text-xs uppercase tracking-widest">
										분류
									</th>
									<th className="py-6 px-4 text-[#7a7f8e] font-normal text-sm">
										일반 자동매매
									</th>
									<th className="py-6 px-4 text-[#c8a84b] font-bold text-lg">
										Treia Gold Engine
									</th>
								</tr>
							</thead>
							<tbody className="text-[15px] md:text-[16px]">
								{[
									{
										label: "투자 종목",
										common: "국내 주식",
										treia: "XAUUSD (금 CFD)",
									},
									{
										label: "운용 시간",
										common: "장중 6.5시간",
										treia: "24시간",
									},
									{
										label: "매매 방향",
										common: "매수 전용",
										treia: "상승·하락 모두",
									},
									{
										label: "목표 수익",
										common: "연 20~40%",
										treia: "월 10%+ (수동 백테스트 및 데모 결과 기준)",
									},
									{
										label: "검증 방식",
										common: "수익 인증샷",
										treia: "MT5 관전자 계정 (조작 불가)",
									},
									{
										label: "최소 시드",
										common: "수천만 원",
										treia: "$5,000 이상",
									},
								].map((row) => (
									<tr
										key={row.label}
										className="border-b border-[#111] hover:bg-white/[0.02] transition-colors"
									>
										<td className="py-6 px-4 text-[#7a7f8e] font-light">
											{row.label}
										</td>
										<td className="py-6 px-4 text-[#555] font-light">
											{row.common}
										</td>
										<td className="py-6 px-4 text-white font-medium">
											{row.treia}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<div className="mt-12 bg-[#0a0b0e] border border-[#1a1a1a] p-8 rounded-2xl text-center">
						<p className="text-[15px] md:text-[17px] text-[#7a7f8e] leading-[1.8] font-light break-keep">
							<strong className="text-white font-medium">💡 보조 설명:</strong>{" "}
							금(XAUUSD) 시장은 전 세계 자금이 24시간 움직이는 순수한 매크로
							시장입니다. 개별 기업 이슈나 작전 세력의 영향을 받지 않습니다.
							상승장에도, 하락장에도 방향만 맞으면 수익이 납니다. 알고리즘이
							가장 잘 작동하는 무대입니다.
						</p>
					</div>
				</div>
			</section>

			{/* Screen 8: The Proof (Dashboard) */}
			<section
				id="proof"
				className="relative min-h-[100svh] flex flex-col justify-center items-center px-6 py-20 border-t border-[#111]"
			>
				<div className="max-w-6xl w-full mx-auto relative z-10 flex flex-col items-center flex-1">
					<div className="text-center mb-16 reveal opacity-0 translate-y-12 transition-all duration-1000">
						<h2 className="text-3xl md:text-5xl lg:text-6xl font-light text-white mb-8 leading-[1.4] tracking-tight">
							실제 데이터로 증명된 <br className="md:hidden" />{" "}
							<span className="font-normal text-[#c8a84b]">
								시스템의 방어력.
							</span>
						</h2>
						<p className="text-[17px] md:text-[22px] text-[#7a7f8e] leading-[1.8] font-light max-w-4xl mx-auto">
							방향이 어긋났을 때는{" "}
							<strong className="text-white">
								설정된 최소한의 방어선(-3.6%)에서 안전하게 끊어내고
							</strong>
							, 기회를 포착했을 때는{" "}
							<strong className="text-white">
								그 수 배에 달하는 수익(+6.3%)을 온전히 추적해 낸
							</strong>{" "}
							투명한 실제 기록입니다.
						</p>
					</div>

					<div className="w-full bg-[#0d0e12] border border-[#22242e] rounded-[32px] p-8 md:p-12 lg:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-12 lg:gap-16 reveal opacity-0 translate-y-12 transition-all duration-1000 delay-200">
						<div className="flex flex-col md:flex-row justify-between items-center text-sm font-mono tracking-widest text-[#7a7f8e] uppercase border-b border-[#22242e] pb-6 gap-4">
							<div className="text-left">
								<div className="text-[#c8a84b] mb-1">
									Data Source: MT5 데모 운용 서버 (실 구동 테스트)
								</div>
								<div className="text-[12px] text-[#a1a1aa] normal-case tracking-normal mt-2">
									백테스트가 아닌 실제 시장에서 구동한 모의 프론트테스트
									결과입니다. <br className="md:hidden" /> 브로커: 한텍 / 기간:
									1개월 / 종목: XAUUSD / 세팅: 멀티타임프레임
								</div>
							</div>
							<div>기간: 1개월 (총 147회 매매)</div>
							<div>초기 자본: $5,000.00</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-[#22242e]">
							<div className="flex flex-col items-center pt-6 md:pt-0">
								<div className="text-[#a1a1aa] font-mono text-[12px] uppercase tracking-[2px] mb-4">
									라이브 포워드 테스트
								</div>
								<div className="text-5xl md:text-6xl font-light text-white">
									<Counter value={147} />
									<span className="text-2xl text-[#c8a84b] ml-1">회</span>
								</div>
							</div>
							<div className="flex flex-col items-center pt-6 md:pt-0">
								<div className="text-[#a1a1aa] font-mono text-[12px] uppercase tracking-[2px] mb-4">
									알고리즘 승률
								</div>
								<div className="text-5xl md:text-6xl font-light text-white">
									<Counter value={80.95} decimals={2} />
									<span className="text-2xl text-[#c8a84b] font-outfit ml-1">
										%
									</span>
								</div>
							</div>
							<div className="flex flex-col items-center pt-6 md:pt-0">
								<div className="text-[#a1a1aa] font-mono text-[12px] uppercase tracking-[2px] mb-4">
									수익 창출 지표 (Profit Factor)
								</div>
								<div className="text-5xl md:text-6xl font-light text-white font-outfit">
									<Counter value={3.58} decimals={2} />
								</div>
							</div>
							<div className="flex flex-col items-center pt-6 md:pt-0 pl-0 md:pl-4">
								<div className="text-[#a1a1aa] font-mono text-[12px] uppercase tracking-[2px] mb-4">
									최대 낙폭 (MAX DD)
								</div>
								<div className="text-5xl md:text-6xl font-light text-[#ef4444]">
									<Counter value={14.72} decimals={2} />
									<span className="text-2xl text-[#ef4444] font-outfit ml-1">%</span>
								</div>
							</div>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
							<div className="lg:col-span-3 bg-[#13151b] border border-[#23252d] rounded-2xl p-6 md:p-8 flex flex-col relative overflow-hidden group">
								<div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#3b82f6]/5 blur-[80px] rounded-full pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
								<div className="flex justify-between items-start mb-6 relative z-10">
									<div className="text-left text-sm font-mono text-[#a1a1aa] tracking-widest uppercase">
										실제 운용 계좌 성장 곡선 ($5,000 기준)
									</div>
									<div className="text-right">
										<span className="block text-[#3b82f6] font-outfit text-2xl md:text-3xl font-light">
											+$4,931.50
										</span>
										<span className="text-[#7a7f8e] text-xs uppercase tracking-widest">
											Net Profit Flow
										</span>
									</div>
								</div>
								<div className="flex-1 w-full min-h-[160px] relative flex md:items-end mt-4">
									<svg
										viewBox={`0 0 ${width} ${height}`}
										className="w-full h-full drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]"
										preserveAspectRatio="none"
									>
										<title>Account Growth Chart</title>
										<motion.path
											d={dFill}
											fill="url(#gradient-blue-real)"
											opacity="0.3"
											initial={{ opacity: 0 }}
											whileInView={{ opacity: 0.3 }}
											transition={{ duration: 1.5 }}
										/>
										<motion.path
											d={dPath}
											fill="none"
											stroke="#3b82f6"
											strokeWidth="2.5"
											strokeLinejoin="round"
											strokeLinecap="round"
											initial={{ pathLength: 0 }}
											whileInView={{ pathLength: 1 }}
											transition={{ duration: 2, ease: "easeInOut" }}
										/>
										<circle
											cx={width}
											cy={
												height -
												((chartData[chartData.length - 1] - minVal) / range) *
													height
											}
											r="5"
											fill="#60a5fa"
											className="animate-pulse"
										/>
										<defs>
											<linearGradient
												id="gradient-blue-real"
												x1="0"
												y1="0"
												x2="0"
												y2="1"
											>
												<stop
													offset="0%"
													stopColor="#3b82f6"
													stopOpacity="0.6"
												/>
												<stop
													offset="100%"
													stopColor="#3b82f6"
													stopOpacity="0"
												/>
											</linearGradient>
										</defs>
									</svg>
									<div className="absolute inset-0 border-b border-l border-[#2a2d36] pointer-events-none"></div>
									<div className="absolute bottom-[20%] left-[25%] hidden md:flex flex-col items-center">
										<div className="w-px h-8 bg-dashed bg-[#ef4444]/50 border-l border-dashed border-[#ef4444]"></div>
										<span className="text-[10px] text-[#ef4444] font-mono mt-1 whitespace-nowrap">
											방어선 (Max DD: -$82.70)
										</span>
									</div>
								</div>
							</div>

							<div className="lg:col-span-2 bg-[#13151b] border border-[#23252d] rounded-2xl p-6 md:p-8 flex flex-col justify-center relative overflow-hidden">
								<div className="absolute top-1/2 left-1/2 w-[200px] h-[200px] bg-[#10B981]/5 blur-[60px] rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2"></div>
								<div className="text-center mb-6 relative z-10">
									<span className="text-sm font-mono text-[#a1a1aa] tracking-widest uppercase">
										Profit Ratio
									</span>
								</div>

								<div className="flex gap-4 items-center justify-between w-full h-full relative z-10">
									<div className="flex flex-col items-center shrink-0">
										<span className="text-[#10B981] font-outfit text-xl md:text-2xl font-light mb-1">
											+$<Counter value={1370} />
										</span>
										<span className="text-[#a1a1aa] text-[10px] uppercase tracking-widest">
											Gross Profit
										</span>
									</div>

									<div className="relative w-28 h-28 md:w-36 md:h-36 flex-shrink-0 mx-auto">
										<svg
											viewBox="0 0 36 36"
											className="w-full h-full drop-shadow-2xl"
										>
											<title>Profit Ratio Chart</title>
											<motion.path
												strokeDasharray="100, 100"
												d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
												fill="none"
												stroke="#ef4444"
												strokeWidth="3"
												className="opacity-80"
												initial={{ pathLength: 0 }}
												whileInView={{ pathLength: 1 }}
												transition={{ duration: 1 }}
											/>
											<motion.path
												strokeDasharray="78.1, 100"
												d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
												fill="none"
												stroke="#10B981"
												strokeWidth="3"
												initial={{ pathLength: 0 }}
												whileInView={{ pathLength: 0.781 }}
												transition={{ duration: 1.5, ease: "easeOut" }}
											/>
										</svg>
										<div className="absolute inset-0 flex items-center justify-center flex-col">
											<span className="text-[#f2f2f2] text-xl md:text-2xl font-light font-outfit">
												+$<Counter value={986} />
											</span>
											<span className="text-[10px] text-[#7a7f8e] uppercase tracking-widest mt-1">
												Net Flow
											</span>
										</div>
									</div>

									<div className="flex flex-col items-center shrink-0">
										<span className="text-[#ef4444] font-outfit text-xl md:text-2xl font-light mb-1">
											-$<Counter value={384} />
										</span>
										<span className="text-[#a1a1aa] text-[10px] uppercase tracking-widest">
											Gross Loss
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* Enhanced: Dashboard-style Data Deep Dive Container */}
						<div className="mt-32 pt-20 border-t border-[#22242e] w-full">
							<div className="text-center mb-24">
								<span className="text-[#c8a84b] font-mono text-xs tracking-[5px] uppercase block mb-4">
									Data Deep Dive
								</span>
								<h3 className="text-3xl md:text-5xl font-light text-white mb-8">
									데이터가 말하는 <span className="text-[#c8a84b]">시스템의 본질</span>
								</h3>
								<p className="text-[#7a7f8e] text-base md:text-lg font-light max-w-3xl mx-auto mb-12">
									표면적인 수익률 곡선 뒤에 숨겨진 트레이아만의 정교한 알고리즘 설계도를 
									통합 대시보드를 통해 실시간으로 분석합니다.
								</p>
							</div>

							{/* Main Infographic Dashboard */}
							<MainBacktestInfographic />

							<div className="flex flex-col items-center mt-32">
								<p className="text-[#7a7f8e] text-xs font-mono uppercase tracking-[5px]">
									Statistical Edge Verification
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Screen 8.5: What is MT5 Investor Password? */}
			<section className="relative flex flex-col justify-center items-center px-6 py-24 md:py-32 border-t border-[#111] bg-[#050505]">
				<div className="max-w-4xl w-full mx-auto reveal opacity-0 translate-y-12 transition-all duration-1000">
					<div className="bg-[#0a0b0e] border border-[#22242e] rounded-3xl p-8 md:p-12 relative overflow-hidden text-center md:text-left shadow-2xl">
						<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c8a84b] to-transparent"></div>

						<h3 className="text-2xl md:text-3xl lg:text-4xl font-light text-white mb-6 leading-[1.4]">
							왜{" "}
							<span className="bg-[#c8a84b] text-[#0a0a0a] px-3 py-1 font-bold inline-block rounded-sm mb-2 md:mb-0">
								MT5 관전자 계정
							</span>{" "}
							인가요?
						</h3>

						<div className="text-[16px] md:text-[19px] text-[#a1a1aa] leading-[1.8] font-light break-keep">
							<p>
								단순한 엑셀 기반의 백테스트 결과나 부분적으로 캡처된 수익
								인증샷은 누구나 쉽게 가장할 수 있습니다.
								<br />
								<br />
								하지만 글로벌 표준 금융 트레이딩 플랫폼인 MT5(MetaTrader 5)의{" "}
								<strong className="text-white font-medium">
									&apos;관전자 계정(Investor Password)&apos;
								</strong>
								은 조작이 원천적으로 불가능합니다. 오직 거래 서버 시스템에
								실시간으로 기록되는{" "}
								<strong className="text-white font-medium">
									실시간 체결 내역, 현재 보유 중인 포지션 비율, 그리고 정확한
									계좌 잔고
								</strong>
								만을 제3자가 100% 투명하게 &apos;조회만&apos; 할 수 있도록
								권한을 열어주는 시스템입니다.
								<br />
								<br />
								이를 통해 당신은 엔진이 약속한 방어선이 진짜로 지켜지고 있는지,
								가감 없는 생생한 민낯을 직접 검증할 수 있습니다.
							</p>
						</div>
					</div>

					{/* New: MT5 Trading Session Video */}
					<div className="max-w-4xl w-full mx-auto mt-16 reveal opacity-0 translate-y-12 transition-all duration-1000 delay-300">
						<div className="text-center mb-8">
							<span className="text-[#c8a84b] font-mono text-[10px] tracking-[4px] uppercase block mb-3">
								Live Execution
							</span>
							<h4 className="text-xl md:text-2xl font-light text-white mb-6">
								실제 MT5 매매 구동 세션 확인
							</h4>
						</div>
						<div className="relative aspect-video w-full bg-[#0a0b0e] border border-[#22242e] rounded-3xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] group">
							<video 
								className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
								autoPlay 
								muted 
								loop 
								playsInline 
								controls
							>
								<source src="/trading_demo.mp4" type="video/mp4" />
								브라우저가 비디오 재생을 지원하지 않습니다.
							</video>
							
							<div className="absolute top-6 left-6 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
								<div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
								<span className="text-[10px] font-mono tracking-widest uppercase text-white/80">
									Actual Trading Logic v3.0
								</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Screen 8.7: FAQ */}
			<section
				id="faq"
				className="relative py-24 md:py-32 px-6 border-t border-[#111] bg-[#030303]"
			>
				<div className="max-w-4xl mx-auto reveal opacity-0 translate-y-12 transition-all duration-1000">
					<div className="text-center mb-16 text-left">
						<span className="text-[#c8a84b] font-mono text-sm tracking-[4px] uppercase block mb-4">
							FAQ
						</span>
						<h2 className="text-3xl md:text-5xl font-light tracking-tight text-white">
							자주 묻는 질문
						</h2>
					</div>

					<div className="space-y-6 text-left">
						<div className="bg-[#0a0b0e] p-8 md:p-10 rounded-2xl border border-[#1a1a1a] hover:border-[#c8a84b]/30 transition-colors">
							<h3 className="text-[18px] md:text-[21px] font-medium text-white mb-5 flex items-start gap-4 leading-[1.5]">
								<span className="text-[#c8a84b] font-outfit text-2xl mt-0.5">
									Q.
								</span>
								<span>
									왜 인원을 무제한으로 받지 않고 선별적으로 제한하시나요?
								</span>
							</h3>
							<div className="md:pl-10 text-[16px] md:text-[17px] text-[#a1a1aa] leading-[1.9] font-light space-y-4 break-keep">
								<p>
									<strong className="text-white font-medium block mb-2">
										A. 엔진의 퍼포먼스(Edge) 보호와 슬리피지 방어를 위한
										필수적인 조치입니다.
									</strong>
									1,000명 이상의 유저가 동일한 가격대에 거대 주문을 동시에
									넣으면 호가창 밀림(Slippage)이 발생하여 본래의 수익률이 저하될
									수 있습니다. 또한 전략 노출과 브로커 리스크를 관리하기 위해,
									Treia는 상시 개방이 아닌 철저한 선별 초대 방식으로만 운영하며
									엔진의 희소성을 유지합니다.
								</p>
							</div>
						</div>

						<div className="bg-[#0a0b0e] p-8 md:p-10 rounded-2xl border border-[#1a1a1a] hover:border-[#c8a84b]/30 transition-colors">
							<h3 className="text-[18px] md:text-[21px] font-medium text-white mb-5 flex items-start gap-4 leading-[1.5]">
								<span className="text-[#c8a84b] font-outfit text-2xl mt-0.5">
									Q.
								</span>
								<span>매월 구독료를 내면 계속 사용할 수 있나요?</span>
							</h3>
							<div className="md:pl-10 text-[16px] md:text-[17px] text-[#a1a1aa] leading-[1.9] font-light space-y-4 break-keep">
								<p>
									<strong className="text-white font-medium block mb-2">
										A. 현재는 로드맵 1단계인 모의 프론트테스트 단계입니다.
									</strong>
									향후 실계좌 검증이 완료되면, 신청자 중 선별된 분들께 한해 MT5
									관전자 계정을 개방합니다. 이후 고액 자산가들을 위한 티어별
									라이선스 체계로 정식 런칭할 예정입니다.
								</p>
							</div>
						</div>

						<div className="bg-[#0a0b0e] p-8 md:p-10 rounded-2xl border border-[#1a1a1a] hover:border-[#c8a84b]/30 transition-colors">
							<h3 className="text-[18px] md:text-[21px] font-medium text-white mb-5 flex items-start gap-4 leading-[1.5]">
								<span className="text-[#c8a84b] font-outfit text-2xl mt-0.5">
									Q.
								</span>
								<span>프로그램은 어떻게 설치하며, 24시간 켜두어야 하나요?</span>
							</h3>
							<div className="md:pl-10 text-[16px] md:text-[17px] text-[#a1a1aa] leading-[1.9] font-light space-y-4 break-keep">
								<p>
									<strong className="text-white font-medium block mb-2">
										A. 고객님의 PC 또는 클라우드(VPS) 서버를 통해 구동하실 수
										있도록 상세한 가이드를 제공합니다.
									</strong>
									본 프로그램은 개인 PC나 인터넷 환경에서 직접 설치하여 운영하실
									수 있습니다. 단, 알고리즘의 완벽한 방어력을 위해 24시간 중단
									없이 구동되어야 합니다. PC를 계속 켜두기 어려운 환경이거나
									세팅이 생소하신 경우, 원격 지원을 제공하여 쾌적한
									클라우드(VPS) 가상 서버 환경을 안전하게 갖추실 수 있도록 초기
									정착을 도와드립니다.
								</p>
							</div>
						</div>

						<div className="bg-[#0a0b0e] p-8 md:p-10 rounded-2xl border border-[#1a1a1a] hover:border-[#c8a84b]/30 transition-colors">
							<h3 className="text-[18px] md:text-[21px] font-medium text-white mb-5 flex items-start gap-4 leading-[1.5]">
								<span className="text-[#c8a84b] font-outfit text-2xl mt-0.5">
									Q.
								</span>
								<span>
									투자금은 얼마가 필요하며, 수동 매매를 섞어도 되나요?
								</span>
							</h3>
							<div className="md:pl-10 text-[16px] md:text-[17px] text-[#a1a1aa] leading-[1.9] font-light space-y-4 break-keep">
								<p>
									<strong className="text-white font-medium block mb-2">
										A. 안정적인 방어력을 위한 최소 권장 자금은 $5,000 이상이며, 시스템의 밸런스를 위해 수동 개입은 권장하지 않습니다.
									</strong>
									알고리즘에 대한 신뢰가 충분히 쌓였을 때 자본을 늘려가시는 것을 권장하며, 투자의 판단은 시스템에 온전히 맡기시길 당부드립니다.
								</p>
							</div>
						</div>

						<div className="bg-[#0a0b0e] p-8 md:p-10 rounded-2xl border border-[#1a1a1a] hover:border-[#c8a84b]/30 transition-colors">
							<h3 className="text-[18px] md:text-[21px] font-medium text-white mb-5 flex items-start gap-4 leading-[1.5]">
								<span className="text-[#c8a84b] font-outfit text-2xl mt-0.5">
									Q.
								</span>
								<span>
									해외 증권사 이용과 투자금 송금은 합법적이고 안전한가요?
								</span>
							</h3>
							<div className="md:pl-10 text-[16px] md:text-[17px] text-[#a1a1aa] leading-[1.9] font-light space-y-4 break-keep">
								<p>
									<strong className="text-white font-medium block mb-2">
										A. 네, 글로벌 금융당국의 규제와 대한민국 트래블룰을 준수하는
										100% 합법적인 거래입니다.
									</strong>
									FCA 등 최상위 규제를 받는 정식 증권사에 본인 명의 계좌를
									개설합니다. 투자금 송금 시 수수료가 저렴한 디지털 자산
									네트워크(USDT 등)를 활용하며, 이는 공식 가상자산 거래소를 거쳐
									투명하게 전송됩니다. 수익금은 매년 5월 국세청에 파생상품
									양도소득세(11%)로 당당하게 신고하실 수 있습니다.
								</p>
							</div>
						</div>

						<div className="bg-[#0a0b0e] p-8 md:p-10 rounded-2xl border border-[#1a1a1a] hover:border-[#c8a84b]/30 transition-colors">
							<h3 className="text-[18px] md:text-[21px] font-medium text-white mb-5 flex items-start gap-4 leading-[1.5]">
								<span className="text-[#c8a84b] font-outfit text-2xl mt-0.5">
									Q.
								</span>
								<span>
									훌륭한 시스템이라면 혼자 사용하시지, 왜 라이선스를
									대여하시나요?
								</span>
							</h3>
							<div className="md:pl-10 text-[16px] md:text-[17px] text-[#a1a1aa] leading-[1.9] font-light space-y-4 break-keep">
								<p>
									<strong className="text-white font-medium block mb-2">
										A. 안정적인 트레이딩 자본(Seed) 확보와 시스템 고도화를 위한
										합리적인 선택입니다.
									</strong>
									Treia 엔진은 시드 규모에 비례하여 수익이 창출됩니다. 라이선스
									수익은 개인 시드를 확대하고 엔진을 더 정교하게 업데이트하는
									R&D 자금으로 재투자됩니다. 고객님은 시행착오 없이 완성된
									시스템을 얻고, 저는 시스템을 스케일업할 동력을 얻는 건강한
									파트너십입니다.
								</p>
							</div>
						</div>

						<div className="bg-[#0a0b0e] p-8 md:p-10 rounded-2xl border border-[#1a1a1a] hover:border-[#c8a84b]/30 transition-colors">
							<h3 className="text-[18px] md:text-[21px] font-medium text-white mb-5 flex items-start gap-4 leading-[1.5]">
								<span className="text-[#c8a84b] font-outfit text-2xl mt-0.5">
									Q.
								</span>
								<span>
									관전 후, 나중에 제 계좌에 이 시스템을 도입하려면 어떻게 해야
									하나요?
								</span>
							</h3>
							<div className="md:pl-10 text-[16px] md:text-[17px] text-[#a1a1aa] leading-[1.9] font-light space-y-4 break-keep">
								<p>
									<strong className="text-white font-medium block mb-2">
										A. 사전 체험을 신청하신 분들께 가장 먼저 정식 도입 절차를
										안내해 드립니다.
									</strong>
									지금 [MT5 관전자 계정]을 신청하셔서 생생하게 공유되는 퍼포먼스를 직접
									경험해 보십시오. 가치를 확신하신 분들께 한하여 정식 런칭
									시점에 개인 계좌 연동 방법과 라이선스 도입 절차를 개별적으로
									상세히 안내해 드릴 예정입니다.
								</p>
							</div>
						</div>

						<div className="bg-[#0a0b0e] p-8 md:p-10 rounded-2xl border border-[#1a1a1a] hover:border-[#c8a84b]/30 transition-colors">
							<h3 className="text-[18px] md:text-[21px] font-medium text-white mb-5 flex items-start gap-4 leading-[1.5]">
								<span className="text-[#c8a84b] font-outfit text-2xl mt-0.5">
									Q.
								</span>
								<span>
									서버 세팅이나 프로그램 설치를 해본 적이 없는데, 초보자도
									이용할 수 있나요?
								</span>
							</h3>
							<div className="md:pl-10 text-[16px] md:text-[17px] text-[#a1a1aa] leading-[1.9] font-light space-y-4 break-keep">
								<p>
									<strong className="text-white font-medium block mb-2">
										A. 네, IT 지식과 상관없이 누구나 독립적으로 운용하실 수
										있도록 &apos;초간단 시각화 매뉴얼&apos;을 제공합니다.
									</strong>
									정식 라이선스를 도입하시는 분들께는 클릭 몇 번으로 세팅을 마칠
									수 있는 가이드를 제공하며, 필요 시 초기 세팅을 돕는 원격
									지원을 병행합니다. 복잡한 설치 과정은 매뉴얼에 따라 쉽게
									통과하실 수 있으며, 고객님께서는 오직 엔진의 퍼포먼스를 누리는
									것에만 집중하시면 됩니다.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Screen 9: CTA */}
			<section
				id="apply"
				className="relative min-h-[100svh] flex flex-col justify-center items-center px-6 py-20 border-t border-[#333] bg-gradient-to-t from-[#0a0a0d] to-[#040404]"
			>
				<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-px bg-gradient-to-r from-transparent via-[#c8a84b] to-transparent"></div>
				<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#c8a84b]/10 blur-[120px] rounded-full pointer-events-none"></div>

				<div className="max-w-3xl w-full mx-auto relative z-10 text-center flex flex-col items-center reveal opacity-0 translate-y-12 transition-all duration-1000">
					<h2 className="text-3xl md:text-5xl lg:text-6xl font-light text-white mb-8 tracking-tight leading-[1.3]">
						투명한 &apos;가치&apos;를 <br className="hidden md:block" /> 선별된
						소수에게만 개방합니다.
					</h2>
					<p className="text-[17px] md:text-[22px] text-[#a1a1aa] leading-[1.8] font-light max-w-3xl mb-16">
						Treia의 기술력과 가치를 더욱 많은 분들과 투명하게 나누고자 합니다. <br />
						아래 양식을 통해 신청해 주시면, 확인 후 등록하신 연락처로 <br />
						<strong className="text-white font-medium">관전자 계정 및 접속 가이드</strong>를 정중하게 안내해 드립니다. <br />
						<br />
						Treia와 함께 성숙한 투자 여정을 시작할 파트너가 되어주십시오.
					</p>

					<div className="w-full bg-[#0a0b0e]/80 backdrop-blur-xl border border-[#c8a84b]/20 p-8 md:p-12 lg:p-16 rounded-[32px] shadow-[0_0_80px_rgba(200,168,75,0.05)] text-left">
						{!isSubmitted ? (
							<form onSubmit={handleSubmit} className="flex flex-col gap-8">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
									<div className="flex flex-col gap-3">
										<label
											htmlFor="name"
											className="text-[14px] text-[#a1a1aa] ml-2 tracking-widest uppercase font-medium"
										>
											성함
										</label>
										<input
											id="name"
											type="text"
											required
											placeholder="성함을 입력해주세요"
											className="w-full bg-[#13151a] border border-[#2a2d36] text-white px-6 py-5 rounded-xl focus:outline-none focus:border-[#c8a84b]/70 focus:ring-1 focus:ring-[#c8a84b]/50 transition-all font-light text-[16px]"
											value={formData.name}
											onChange={(e) =>
												setFormData({ ...formData, name: e.target.value })
											}
										/>
									</div>
									<div className="flex flex-col gap-3">
										<label
											htmlFor="contact"
											className="text-[14px] text-[#a1a1aa] ml-2 tracking-widest uppercase font-medium"
										>
											이메일 (또는 연락처)
										</label>
										<input
											id="contact"
											type="text"
											required
											placeholder="example@gmail.com 또는 010-0000-0000"
											className="w-full bg-[#13151a] border border-[#2a2d36] text-white px-6 py-5 rounded-xl focus:outline-none focus:border-[#c8a84b]/70 focus:ring-1 focus:ring-[#c8a84b]/50 transition-all font-light text-[16px]"
											value={formData.contact}
											onChange={(e) =>
												setFormData({ ...formData, contact: e.target.value })
											}
										/>
									</div>
								</div>

								<div className="flex flex-col gap-3">
									<label
										htmlFor="reason"
										className="text-[14px] text-[#a1a1aa] ml-2 tracking-widest uppercase font-medium"
									>
										알고리즘 검증 신청 사유 (필수)
									</label>
									<textarea
										id="reason"
										rows={3}
										required
										placeholder="현재 겪고 계신 투자의 어려움이나, 관전자 계정을 통해 어떤 부분을 확인하고 싶으신지 솔직하게 남겨주시면 감사하겠습니다."
										className="w-full bg-[#13151a] border border-[#2a2d36] text-white px-6 py-5 rounded-xl focus:outline-none focus:border-[#c8a84b]/70 focus:ring-1 focus:ring-[#c8a84b]/50 transition-all font-light text-[16px] resize-none"
										value={formData.reason}
										onChange={(e) =>
											setFormData({ ...formData, reason: e.target.value })
										}
									/>
								</div>

								{errorMsg && (
									<p className="text-red-400 text-sm ml-2">{errorMsg}</p>
								)}

								<button
									type="submit"
									disabled={isLoading}
									className="w-full mt-2 bg-[#c8a84b] hover:bg-[#d4b55c] text-black text-[18px] font-bold py-6 rounded-xl transition-colors flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg"
								>
									{isLoading
										? "접수 중..."
										: "관전자 계정 신청하기"}
									{!isLoading && <ArrowUpRight size={24} />}
								</button>
							</form>
						) : (
							<div className="flex flex-col items-center justify-center py-12 text-center">
								<div className="text-5xl md:text-6xl mb-8 animate-bounce">
									👏
								</div>
								<h3 className="text-3xl text-white font-medium mb-6 tracking-tight">
									신청이 완료되었습니다!
								</h3>
								<p className="text-[#a1a1aa] leading-[1.8] font-light text-[17px] md:text-[19px] break-keep max-w-xl mx-auto">
									신청해 주셔서 감사합니다! <br />
									입력하신 이메일(또는 연락처)로 확인 절차를 거쳐 <br className="hidden md:block" />
									순차적으로 <strong className="text-white font-medium">[관전자 계정 접속 ID/PW]</strong>와 <br className="hidden md:block" />
									<strong className="text-white font-medium">[접속 가이드]</strong>를 안전하게 발송해 드릴 예정입니다.
								</p>
							</div>
						)}

						<div className="mt-20 pt-10 border-t border-[#1a1a1a] text-left">
							<h4 className="text-[#c8a84b] text-[13px] font-mono tracking-widest uppercase mb-6">
								시스템 운용 특성 및 리스크 고지
							</h4>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[13px] text-[#7a7f8e] font-light leading-[1.8] break-keep">
								<div className="flex flex-col gap-2">
									<strong className="text-white font-medium block">
										1. 살아있는 시장을 위한 지속적인 알고리즘 진화
									</strong>
									<p>
										Treia 엔진은 고정된 기계가 아닙니다. 시장의 새로운 변동성
										패턴에 대응하고 방어력을 극대화하기 위해 로직은 상시
										보완됩니다. 이 과정에서 알고리즘의 매매 템포나 진입 기준은
										사전 예고 없이 유연하게 조정될 수 있습니다.
									</p>
								</div>

								<div className="flex flex-col gap-2">
									<strong className="text-white font-medium block">
										2. 브로커 및 물리적 환경에 따른 체결 오차 (슬리피지)
									</strong>
									<p>
										실제 체결 결과는 사용자가 이용하는 브로커의 서버 상태,
										네트워크 지연 속도(Ping), 유동성에 따라 달라질 수 있습니다.
										이로 인해 마스터 계좌와 완벽히 동일한 가격에 체결되지 않는
										&apos;슬리피지&apos; 현상이 발생할 수 있으며, 이는
										자동매매의 물리적 특성입니다.
									</p>
								</div>

								<div className="flex flex-col gap-2">
									<strong className="text-white font-medium block">
										3. 통제 불가능한 거시적 충격 (블랙스완) 대응 한계
									</strong>
									<p>
										전쟁, 자연재해, 혹은 시장에 극단적인 충격을 주는 예측
										불가능한 뉴스 발생 시에는 주문 임계치를 넘어서는 등
										물리적으로 알고리즘의 통제가 불가능한 영역이 발생할 수
										있습니다.
									</p>
								</div>

								<div className="flex flex-col gap-2">
									<strong className="text-white font-medium block">
										4. 최종 운용 결정권과 자산의 귀속
									</strong>
									<p>
										본 소프트웨어는 투자의 확률적 우위를 위한 보조 도구일 뿐,
										무손실을 보장하지 않습니다. 소프트웨어 가동 여부 결정권은
										전적으로 사용자 본인에게 있으며, 모든 금융 거래의 최종적인
										결과와 책임은 사용자에게 귀속됩니다.
									</p>
								</div>
							</div>

							<div className="mt-10 pt-6 border-t border-[#1a1a1a]/50 flex flex-col gap-3 text-[12px] text-[#555]">
								<p>
									• 본 웹사이트에 공개된 모든 수익률 및 지표는 과거 특정 기간의 데모 계좌 및 백테스트 데이터이며, 실거래 시 브로커 환경 및 시장 상황에 따라 결과가 상이할 수 있습니다. 
									<strong className="text-white">어떠한 경우에도 미래의 수익을 보장하거나 확약하지 않습니다.</strong>
								</p>
								<p>
									• 차액결제거래(CFD) 및 외환 거래는 변동성이 매우 크며, 투자 원금의 상당 부분 또는 전액 손실의 위험이 있습니다. 자신의 자본 범위 내에서 신중하게 결정하십시오.
								</p>
								<p>
									• Treia 엔진은 매매 보조 소프트웨어 라이선스 대여 서비스입니다. 본 시스템은 유사투자자문이나 자산운용 행위를 하지 않으며, 종목 추천이나 투자 권유를 구체적으로 수행하지 않습니다. 
									<strong className="text-white">모든 최종적인 투자 판단과 그로 인해 발생하는 손익에 대한 법적 책임은 사용자 본인에게 귀속됩니다.</strong>
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Treia Exclusive Footer */}
			<footer className="py-20 border-t border-[#1a1a1a] bg-[#050505] text-center">
				<div className="max-w-7xl mx-auto px-6">
					<p className="text-[12px] text-[#444] font-mono tracking-widest uppercase mb-4">
						© 2026 TREIA GROUP. ALL RIGHTS RESERVED.
					</p>
					<p className="text-[11px] text-[#333] tracking-wider leading-relaxed">
						Algorithmic Trading Software Provider & Multi-Asset Intelligence
					</p>
				</div>
			</footer>
		</div>
	);
}

function Counter({ value, decimals = 0 }: { value: number; decimals?: number }) {
	const [count, setCount] = useState(0);
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });

	useEffect(() => {
		if (isInView) {
			const controls = animate(0, value, {
				duration: 2,
				ease: [0.16, 1, 0.3, 1], // easeOutQuart
				onUpdate: (latest) => setCount(latest),
			});
			return () => controls.stop();
		}
	}, [isInView, value]);

	return <span ref={ref}>{count.toFixed(decimals)}</span>;
}

// --- Main Backtest Infographic Component (Merged from Claude code) ---

const INFOGRAPHIC_TARGET = {
	profit: 5965.67, pct: 59.66, pf: 2.38, sr: 14.28, dd: 10.59,
	total: 398, win: 348, loss: 50, buy: 88.28, sell: 86.16,
	winRate: 87.44,
};

function infographicLerp(a: number, b: number, t: number) { return a + (b - a) * t }
function infographicEase(t: number) { return 1 - Math.pow(1 - t, 3) }

function generateInfographicCurve() {
	const labels: string[] = []
	const data: number[] = []
	const months = ['Jan', 'Feb', 'Mar']
	const n = 80
	for (let i = 0; i <= n; i++) {
		const t = i / n
		const mo = Math.floor(t * 3)
		const day = Math.floor((t * 3 - mo) * 28) + 1
		labels.push(`${months[Math.min(mo, 2)]} ${day}`)
		const growth = Math.pow(t, 0.72) * (17002 - 10000)
		const noise = (Math.sin(i * 1.3) * 40 + Math.cos(i * 2.1) * 25) * (1 - t * 0.4)
		let bal = 10000 + growth + noise
		if (i === n) bal = 15965.67
		data.push(Math.round(bal))
	}
	return { labels, data }
}

function useInfographicCountUp(target: number, triggered: boolean, duration = 1400, decimals = 0) {
	const [val, setVal] = useState(0)
	const rafRef = useRef<number | undefined>(undefined)

	useEffect(() => {
		if (!triggered) return
		const start = Date.now()
		function tick() {
			const p = infographicEase(Math.min((Date.now() - start) / duration, 1))
			setVal(infographicLerp(0, target, p))
			if (p < 1) rafRef.current = requestAnimationFrame(tick)
		}
		rafRef.current = requestAnimationFrame(tick)
		return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
	}, [triggered, target, duration])

	return decimals === 0 ? Math.round(val) : parseFloat(val.toFixed(decimals))
}

function MainBacktestInfographic() {
	const [scriptLoaded, setScriptLoaded] = useState(false);
	const sectionRef = useRef<HTMLDivElement>(null);
	const isTriggered = useInView(sectionRef, { once: true, amount: 0.05, margin: "0px" });

	return (
		<div ref={sectionRef} className="w-full">
			<Script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js" onLoad={() => setScriptLoaded(true)} strategy="lazyOnload" />
			
			<div className="space-y-12">
				<InfographicHeader triggered={isTriggered} />
				<InfographicChartSection scriptLoaded={scriptLoaded} triggered={isTriggered} />

				{/* 4 Multi-Stats Grid - 차트 이후 순차 노출 */}
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
					<InfographicCountCard label="Net Profit" target={INFOGRAPHIC_TARGET.profit} prefix="+$" sub={`+${INFOGRAPHIC_TARGET.pct.toFixed(1)}% Yield`} color="#10B981" triggered={isTriggered} delay={2500} />
					<InfographicCountCard label="Profit Factor" target={INFOGRAPHIC_TARGET.pf} decimals={2} sub="Statistical Stability" color="#10B981" triggered={isTriggered} delay={3100} />
					<InfographicCountCard label="Sharpe Ratio" target={INFOGRAPHIC_TARGET.sr} decimals={2} sub="Risk-Adj Return" color="#c8a84b" triggered={isTriggered} delay={3700} />
					<InfographicCountCard label="Max Drawdown" target={INFOGRAPHIC_TARGET.dd} decimals={2} suffix="%" sub="Capital Safety" color="#e05252" triggered={isTriggered} delay={4300} />
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<InfographicWinRing triggered={isTriggered} delay={5000} />
					<InfographicProfitBar triggered={isTriggered} delay={5700} />
				</div>

				<div className="grid grid-cols-2 gap-4 md:gap-6">
					<InfographicDirCard dir="매수 포지션 (Buy)" target={INFOGRAPHIC_TARGET.buy} sub="상승장 대응력" arrow="↑" triggered={isTriggered} delay={6400} />
					<InfographicDirCard dir="매도 포지션 (Sell)" target={INFOGRAPHIC_TARGET.sell} sub="하락장 하방 수익" arrow="↓" triggered={isTriggered} delay={7100} />
				</div>
                
			</div>

			<style>{`
				@keyframes treiaPulse {
					0%,100%{opacity:1;transform:scale(1)}
					50%{opacity:.4;transform:scale(1.3)}
				}
			`}</style>
		</div>
	)
}

function InfographicHeader({ triggered }: { triggered: boolean }) {
	return (
		<motion.div 
			initial={{ opacity: 0, y: 20 }}
			animate={triggered ? { opacity: 1, y: 0 } : {}}
			transition={{ duration: 0.8 }}
			className="mb-8"
		>
			<div className="flex items-center gap-3 mb-4">
				<span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse shadow-[0_0_10px_#10B981]" />
				<span className="font-mono text-[11px] md:text-[11px] tracking-[1px] md:tracking-[4px] uppercase text-[#10B981] break-all">Deep Insight Verification (Format: treia_No1_XXXX)</span>
			</div>
			<p className="font-mono text-[11px] text-[#52525b] uppercase tracking-widest">
				M5 Treia_No1 Engine · 2026.01.01 ~ 03.20 · 초기자본 $10,000 · 99% Tick Accuracy
			</p>
		</motion.div>
	)
}

function InfographicChartSection({ scriptLoaded, triggered }: { scriptLoaded: boolean, triggered: boolean }) {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const chartRef = useRef<any>(null)
	const [liveVal, setLiveVal] = useState('0.0')
	const [tooltip, setTooltip] = useState({ x: 0, y: 0, date: '', val: '', visible: false })
	const animDone = useRef(false)
	const { labels, data: rawData } = useRef(generateInfographicCurve()).current

	const runChart = useCallback(() => {
		if (animDone.current || !chartRef.current) return
		animDone.current = true
		
		// 스크롤 후 시선 안착을 위한 300ms 추가 대기
		setTimeout(() => {
			let drawn = 0
			function drawFrames() {
				if (!chartRef.current) return
				// 초당 약 60프레임 기준, 약 2초간 그려지도록 배치 조절
				const batch = Math.ceil(rawData.length / 100)
				for (let i = 0; i < batch && drawn < rawData.length; i++) {
					chartRef.current.data.datasets[0].data[drawn] = rawData[drawn]
					drawn++
				}
				chartRef.current.update('none')
				const pct = ((rawData[drawn - 1] || 10000) - 10000) / (15965.67 - 10000) * INFOGRAPHIC_TARGET.pct
				setLiveVal(Math.min(pct, INFOGRAPHIC_TARGET.pct).toFixed(1))
				if (drawn < rawData.length) requestAnimationFrame(drawFrames)
				else setLiveVal(INFOGRAPHIC_TARGET.pct.toFixed(1))
			}
			requestAnimationFrame(drawFrames)
		}, 300)
	}, [rawData])

	useEffect(() => {
		if (!scriptLoaded || !canvasRef.current || chartRef.current) return
		const Chart = (window as any).Chart
		if (!Chart) return
		const ctx = canvasRef.current.getContext('2d')!
		const grad = ctx.createLinearGradient(0, 0, 0, 300)
		grad.addColorStop(0, 'rgba(16,185,129,.25)')
		grad.addColorStop(1, 'rgba(16,185,129,0)')
		chartRef.current = new Chart(canvasRef.current, {
			type: 'line',
			data: {
				labels,
				datasets: [{
					data: rawData.map(() => null),
					borderColor: '#10B981', borderWidth: 2.5,
					backgroundColor: grad, fill: true, tension: 0.4,
					pointRadius: 0, pointHoverRadius: 6,
					pointHoverBackgroundColor: '#10B981',
					pointHoverBorderColor: '#fff', pointHoverBorderWidth: 2,
				}]
			},
			options: {
				responsive: true, maintainAspectRatio: false, animation: { duration: 0 },
				plugins: {
					legend: { display: false },
					tooltip: {
						enabled: false,
						external({ chart, tooltip }: any) {
							if (tooltip.opacity === 0) { setTooltip(t => ({ ...t, visible: false })); return }
							const dp = tooltip.dataPoints?.[0]
							if (!dp || dp.raw === null) { setTooltip(t => ({ ...t, visible: false })); return }
							setTooltip({ x: tooltip.caretX, y: tooltip.caretY, date: dp.label, val: '$' + dp.raw.toLocaleString(), visible: true })
						}
					}
				},
				scales: {
					x: { display: false },
					y: {
						display: true,
						grid: { color: 'rgba(255,255,255,.04)' },
						ticks: { color: '#52525b', font: { size: 11, family: 'monospace' }, callback: (v: any) => '$' + Number(v).toLocaleString(), maxTicksLimit: 5 },
						border: { display: false },
					}
				},
				interaction: { mode: 'index', intersect: false },
			}
		})
		if (triggered) runChart()
	}, [scriptLoaded])

	useEffect(() => {
		if (triggered && chartRef.current) runChart()
	}, [triggered])

	return (
		<motion.div 
			initial={{ opacity: 0, y: 30 }}
			animate={triggered ? { opacity: 1, y: 0 } : {}}
			transition={{ duration: 1 }}
			className="bg-[#0a0b0e] border border-white/5 rounded-[40px] p-8 md:p-12 relative overflow-hidden group shadow-2xl"
		>
			<div className="absolute top-0 right-0 w-64 h-64 bg-[#10B981]/10 blur-[100px] rounded-full group-hover:bg-[#10B981]/20 transition-all duration-1000" />
			
			<div className="flex justify-between items-end mb-12 relative z-10">
				<div>
					<p className="font-mono text-[10px] tracking-[4px] uppercase text-[#52525b] mb-3">Equity Growth Map</p>
					<h2 className="text-4xl md:text-6xl font-light text-[#10B981] font-mono tracking-tight">+{liveVal}%</h2>
				</div>
				<div className="text-right hidden sm:block">
					<p className="text-[#52525b] text-[10px] font-mono uppercase tracking-widest mb-1">Target Achievement</p>
					<p className="text-white/60 font-mono text-sm tracking-widest leading-loose">CERTIFIED BACKTEST V3.0</p>
				</div>
			</div>

			<div className="relative h-[280px] md:h-[400px] z-10">
				<canvas ref={canvasRef} className="w-full h-full" />
				{tooltip.visible && (
					<motion.div 
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						style={{ position: 'absolute', left: Math.min(tooltip.x - 16, 500), top: tooltip.y - 75, background: '#1c1e26', border: '1px solid #10B981', borderRadius: 12, padding: '12px 16px', fontSize: 13, pointerEvents: 'none', zIndex: 50, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
					>
						<div className="text-[#7a7f8e] text-[10px] font-mono mb-1 uppercase tracking-widest">{tooltip.date}</div>
						<div className="text-[#10B981] font-bold font-mono text-lg">{tooltip.val}</div>
					</motion.div>
				)}
			</div>
			
			<div className="flex justify-between mt-8 text-[#333] font-mono text-[10px] tracking-[5px] uppercase pt-8 border-t border-white/5 relative z-10">
				<span>Jan 2026</span><span>Feb 2026</span><span>Mar 2026</span>
			</div>
		</motion.div>
	)
}

function InfographicCountCard({ label, target, prefix = '', suffix = '', decimals = 0, sub, color, triggered, delay }: {
	label: string; target: number; prefix?: string; suffix?: string; decimals?: number; sub: string; color: string; triggered: boolean, delay: number
}) {
	const [active, setActive] = useState(false)
	useEffect(() => { if (triggered) setTimeout(() => setActive(true), delay + 300) }, [triggered])
	const val = useInfographicCountUp(target, active, 1600, decimals)
	const display = `${prefix}${decimals === 0 ? Number(val).toLocaleString() : val}${suffix}`
	
	return (
		<motion.div 
			initial={{ opacity: 0, y: 20 }}
			animate={triggered ? { opacity: 1, y: 0 } : {}}
			transition={{ duration: 0.6, delay: delay / 1000 }}
			className="bg-[#0a0b0e] border border-white/5 rounded-2xl md:rounded-3xl p-4 md:p-10 border-t-2 shadow-xl group hover:border-[#c8a84b]/30 transition-all"
			style={{ borderTopColor: color }}
		>
			<div className="font-mono text-[9px] md:text-[10px] tracking-[4px] uppercase text-[#52525b] mb-4 group-hover:text-white/40 transition-colors">{label}</div>
			<div className="text-2xl md:text-3xl font-light mb-2 font-mono" style={{ color }}>{display}</div>
			<div className="text-[#52525b] text-[10px] md:text-[11px] font-light leading-relaxed">{sub}</div>
		</motion.div>
	)
}

function InfographicWinRing({ triggered, delay = 600 }: { triggered: boolean; delay?: number }) {
	const [active, setActive] = useState(false)
	useEffect(() => { if (triggered) setTimeout(() => setActive(true), delay) }, [triggered, delay])
	const rate = useInfographicCountUp(INFOGRAPHIC_TARGET.winRate, active, 1800, 1) as number
	const total = useInfographicCountUp(INFOGRAPHIC_TARGET.total, active, 1500)
	const win = useInfographicCountUp(INFOGRAPHIC_TARGET.win, active, 1500)
	const loss = useInfographicCountUp(INFOGRAPHIC_TARGET.loss, active, 1500)
	const circ = 339.3
	const offset = circ * (1 - Number(rate) / 100)
	
	return (
		<motion.div 
			initial={{ opacity: 0, x: -30 }}
			animate={triggered ? { opacity: 1, x: 0 } : {}}
			transition={{ duration: 0.8, delay: delay / 1000 }}
			className="bg-[#0a0b0e] border border-white/5 rounded-[40px] p-10 md:p-12 flex flex-col items-center justify-center shadow-2xl"
		>
			<div className="relative mb-12 transform scale-110 lg:scale-125">
				<svg width="150" height="150" viewBox="0 0 140 140">
					<circle cx="70" cy="70" r="54" fill="none" stroke="#14151a" strokeWidth="12" />
					<motion.circle 
						cx="70" cy="70" r="54" fill="none" stroke="#10B981" strokeWidth="12"
						strokeDasharray={circ} animate={{ strokeDashoffset: offset }}
						transition={{ duration: 1.8, ease: "easeOut" }}
						strokeLinecap="round" transform="rotate(-90 70 70)"
						style={{ filter: 'drop-shadow(0 0 12px rgba(16,185,129,.4))' }} />
					<text x="70" y="65" textAnchor="middle" fill="#10B981" fontSize="24" fontWeight="700" className="font-mono tracking-tighter">
						{String(rate).replace(/(\.\d).*/, '$1')}%
					</text>
					<text x="70" y="86" textAnchor="middle" fill="#52525b" fontSize="10" className="font-mono tracking-widest uppercase">Win Rate</text>
				</svg>
			</div>
			
			<div className="grid grid-cols-3 gap-8 w-full text-center">
				{[
					{ label: 'Total', val: total, color: 'white' },
					{ label: 'Winner', val: win, color: '#10B981' },
					{ label: 'Loss', val: loss, color: '#ef4444' }
				].map((s, i) => (
					<div key={i}>
						<div className="font-mono text-[10px] text-[#52525b] uppercase tracking-widest mb-2">{s.label}</div>
						<div className="text-xl md:text-2xl font-bold font-mono" style={{ color: s.color }}>{s.val}</div>
					</div>
				))}
			</div>
		</motion.div>
	)
}

function InfographicProfitBar({ triggered, delay = 800 }: { triggered: boolean; delay?: number }) {
	const [active, setActive] = useState(false)
	useEffect(() => { if (triggered) setTimeout(() => setActive(true), delay) }, [triggered, delay])
	const [barPct, setBarPct] = useState(0)
	useEffect(() => {
		if (!active) return
		const start = Date.now()
		function tick() {
			const p = infographicEase(Math.min((Date.now() - start) / 1600, 1))
			setBarPct(p)
			if (p < 1) requestAnimationFrame(tick)
		}
		requestAnimationFrame(tick)
	}, [active])
	const pp = (70.4 * barPct).toFixed(1)
	const lp = (29.6 * barPct).toFixed(1)
	
	return (
		<motion.div 
			initial={{ opacity: 0, x: 30 }}
			animate={triggered ? { opacity: 1, x: 0 } : {}}
			transition={{ duration: 0.8 }}
			className="bg-[#0a0b0e] border border-white/5 rounded-[40px] p-10 md:p-12 flex flex-col justify-center gap-12 shadow-2xl"
		>
			<div className="space-y-6">
				<div className="flex justify-between items-end mb-4 font-mono text-[11px] tracking-tight">
					<span className="text-emerald-400">QUALIFIED PROFIT $10,274</span>
					<span className="text-white/20">VS</span>
					<span className="text-red-400">TOTAL RISK $4,309</span>
				</div>
				<div className="h-4 bg-[#14151a] rounded-full overflow-hidden flex shadow-inner">
					<motion.div style={{ width: `${pp}%` }} className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-l-full shadow-[0_0_15px_#05966950]" />
					<motion.div style={{ width: `${lp}%` }} className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-r-full shadow-[0_0_15px_#e0525250]" />
				</div>
				<div className="flex justify-between font-mono text-[10px] text-[#52525b] uppercase tracking-widest pt-2">
					<span>{pp}% Performance</span>
					<span className="text-white/60">Profit Factor 2.38</span>
					<span>{lp}% Risk Impact</span>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-6">
				<div className="bg-white/5 border border-white/5 rounded-3xl p-6 hover:bg-emerald-500/5 transition-colors group">
					<div className="font-mono text-[10px] text-[#52525b] uppercase tracking-[3px] mb-3 group-hover:text-emerald-500/50 transition-colors">Avg Profit</div>
					<div className="text-2xl font-bold text-emerald-400 font-mono">+$29.53</div>
					<div className="text-[10px] text-[#333] mt-2 group-hover:text-[#444]">Max +$533.39</div>
				</div>
				<div className="bg-white/5 border border-white/5 rounded-3xl p-6 hover:bg-red-500/5 transition-colors group">
					<div className="font-mono text-[10px] text-[#52525b] uppercase tracking-[3px] mb-3 group-hover:text-red-500/50 transition-colors">Avg Loss</div>
					<div className="text-2xl font-bold text-red-400 font-mono">-$86.18</div>
					<div className="text-[10px] text-[#333] mt-2 group-hover:text-[#444]">Max -$839.46</div>
				</div>
			</div>
		</motion.div>
	)
}

function InfographicDirCard({ dir, target, sub, arrow, triggered, delay }: { dir: string; target: number; sub: string; arrow: string; triggered: boolean, delay: number }) {
	const [active, setActive] = useState(false)
	useEffect(() => { if (triggered) setTimeout(() => setActive(true), delay + 1000) }, [triggered])
	const val = useInfographicCountUp(target, active, 1600, 1)
	
	return (
		<motion.div 
			initial={{ opacity: 0, y: 30 }}
			animate={triggered ? { opacity: 1, y: 0 } : {}}
			transition={{ duration: 0.8, delay: delay / 1000 }}
			className="bg-[#0a0b0e] border border-white/5 rounded-2xl md:rounded-3xl p-4 md:p-8 flex items-center justify-between shadow-xl group hover:border-[#c8a84b]/30 transition-all"
		>
			<div>
				<div className="font-mono text-[10px] text-[#52525b] uppercase tracking-[4px] mb-4 group-hover:text-white/40 transition-colors">{dir}</div>
				<div className="text-3xl md:text-5xl font-light text-[#10B981] font-mono leading-none mb-3">{val}%</div>
				<div className="text-[#52525b] text-[12px] md:text-[14px] font-light leading-relaxed">{sub}</div>
			</div>
			<div className="text-7xl font-black text-white/5 group-hover:text-white/10 transition-colors duration-700 pointer-events-none select-none">{arrow}</div>
		</motion.div>
	)
}
