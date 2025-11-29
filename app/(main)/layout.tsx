import "../../styles/globals.scss";

import type { Metadata } from "next";
import Frame from "@/components/Frame";
import { frameLinksMap } from "../frameLinksConfig";

export const metadata: Metadata = {
    title: "몸으로 재단하기",
    description: "",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // 경로에 따라 frameLinksMap에서 링크 결정
    // next/navigation의 usePathname은 클라이언트에서만 동작하므로, 서버에서 pathname을 props로 받아야 함
    // 여기서는 window.location.pathname을 fallback으로 사용
    let pathname = '/';
    if (typeof window !== 'undefined') {
        pathname = window.location.pathname;
    }
    const initialLinks = frameLinksMap[pathname] || [];
    return (
        <html lang="ko">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover, user-scalable=no" />
            </head>
            <body>
                <div className="app-container">
                    <Frame initialLinks={initialLinks}>
                        <div className="content-wrapper">
                            {children}
                        </div>
                    </Frame>
                </div>
            </body>
        </html>
    );
}
