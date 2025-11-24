import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container">
      <main>
        <h1>화면을 클릭해 재단선을 만들어주세요.</h1>

        <Link href="/select">
          자세 선택하기
        </Link>
      </main>
    </div>
  );
}
