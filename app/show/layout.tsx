import "../../styles/pages/global_show.scss";

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Show - 몸으로 재단하기",
    description: "",
};

export default function ShowLayout({
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
                    {children}
                </div>
            </body>
        </html>
    );
}
