import Link from "next/link";


export default function NoticePage() {
  return (
    <div className="container">
      <main>
        <h1>재단하기 전 주의사항</h1>

        <h1>재단하기 전, 본인의 신장과 어깨너비가 필요합니다.</h1>
        
        <Link href="cut">
          재단하기
        </Link>
      </main>
    </div>
  );
}
