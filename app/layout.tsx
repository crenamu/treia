import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "@/app/components/LayoutWrapper";
import GlobalAuthModal from "@/components/GlobalAuthModal";
import ScrollToTop from "@/components/ScrollToTop";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
	title: "Treia Gold | 트레이아 자산 관리 알고리즘 엔진",
	description:
		"데이터 중심의 견고한 생존 원칙. 감정의 소모 없이 24시간 정교하게 작동하는 생존형 자산 관리 알고리즘 엔진, 트레이아.",
};

import { ThemeProvider } from "@/app/components/ThemeProvider";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ko" suppressHydrationWarning>
			<body className="min-h-screen flex flex-col overflow-x-hidden font-sans antialiased">
				<ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
					<AuthProvider>
						<LayoutWrapper>{children}</LayoutWrapper>
						<ScrollToTop />
						<GlobalAuthModal />
					</AuthProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
