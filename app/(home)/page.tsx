import Link from "next/link";

export default function HomePage() {
    return (
        <div className="container">
            <main>
                <div className="text text--header">
                    화면을 클릭해 재단선을 만들어주세요.
                </div>

                <div className="text" style={{
                    lineHeight: '1.33',
                    position: 'absolute',
                    textDecoration: 'underline',
                    border: 'none',
                    left: '50%',
                    // marginTop: '20px',
                    bottom: 'var(--outer-padding)',
                    fontSize: 'var(--font-size-base)',
                    transform: 'translateX(-50%)',
                }}>
                    <Link href="/select">
                        (재단선을 만들어 이동)
                    </Link>
                </div>

            </main>
        </div>
    );
}
