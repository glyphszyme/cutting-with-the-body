import type { Metadata } from "next";
import "./globals.scss";
import { CornerLinksProvider } from "@/contexts/CornerLinksContext";
import CornerBrackets from "@/components/CornerBrackets";

export const metadata: Metadata = {
    title: "몸으로 재단하기",
    description: "",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover, user-scalable=no" />
            </head>
            <body>
                <CornerLinksProvider>
                    <div className="app-container">
                        <div className="frame-with-corners">
                            <CornerBrackets />
                            <div className="content-wrapper">
                                {children}
                            </div>
                        </div>
                    </div>
                </CornerLinksProvider>
            </body>
        </html>
    );
}
