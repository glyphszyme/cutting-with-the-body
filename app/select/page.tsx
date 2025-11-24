import Link from "next/link";

// 임시 자세 데이터
const poses = [
  { id: 1, name: "사바아사나", description: "등을 대고 누운 뒤, 손과 팔은 자연스럽게 벌린다." },
  { id: 2, name: "안자니아사나", description: "한쪽 발바닥은 매트 앞쪽, 반대 무릎은 매트 뒤쪽에 둔다. 골반을 열고 손끝으로 바닥을 짚는다." },
  { id: 3, name: "발라아사나", description: "무릎을 꿇은 채 이마를 매트 앞쪽에 둔다. 양손 손바닥을 머리 위로 뻗거나 몸 옆에 둔다." },
  { id: 4, name: "사르방가아사나", description: "기본 서기 자세" },
  { id: 5, name: "우스트라아사나", description: "의자에 앉은 자세" },
  { id: 6, name: "아르다 마첸드라사나", description: "누워있는 자세" },
];

export default function SelectPage() {
  return (
    <div className="container">
      <main>
        <h1>아래 6가지 동작들을 클릭해</h1>
        <h1>매트 위에서 따라해보세요</h1>
        
        <ul className="pose-list">
          {poses.map((pose) => (
            <li key={pose.id}>
              <Link href={`/poses/${pose.id}`}>
                <h3>{pose.name}</h3>
                <p>{pose.description}</p>
              </Link>
            </li>
          ))}
        </ul>
        
        <Link href="cut">
          바로재단하기
        </Link>
        <Link href="/notice">
          주의사항보기
        </Link>
      </main>
    </div>
  );
}
