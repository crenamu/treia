import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "@/app/components/LayoutWrapper";
import GlobalAuthModal from "@/components/GlobalAuthModal";
import ScrollToTop from "@/components/ScrollToTop";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
	title: "FinTable | 지금 가장 좋은 금리, 한눈에 비교하세요",
	description:
		"금융감독원 공시 기준 실시간 데이터를 기반으로 당신에게 가장 유리한 금융 상품을 분석합니다.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ko">
			<body className="min-h-screen flex flex-col overflow-x-hidden font-sans antialiased text-gray-900 bg-[var(--bg-beige)]">
				<AuthProvider>
					<LayoutWrapper>{children}</LayoutWrapper>
					<ScrollToTop />
					<GlobalAuthModal />
				</AuthProvider>
			</body>
		</html>
	);
}
