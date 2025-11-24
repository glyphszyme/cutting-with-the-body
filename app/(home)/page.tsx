import Link from "next/link";

export default function HomePage() {
    return (
        <div className="container">
            <main>
                <div className="text" style={{
                    marginTop: '50px'
                }}>
                    화면을 클릭해 재단선을 만들어주세요.
                </div>

                <Link href="/select">
                    (임시 넘어가기 버튼))
                </Link>
            </main>
        </div>
    );
}
