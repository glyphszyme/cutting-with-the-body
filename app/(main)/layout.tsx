import "../../styles/globals.scss";

import type { Metadata } from "next";
import Frame from "@/components/Frame";

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
                <div className="app-container">
                    <Frame>
                        <div className="content-wrapper">
                            {children}
                        </div>
                    </Frame>
                </div>
            </body>
        </html>
    );
}
