// 요가 포즈 데이터
export interface Pose {
    id: string;
    name: string;
    target_area: string[];
    description: string;
}

export const poses: Pose[] = [
    {
        id: 'savasana',
        name: '사바아사나',
        target_area: ['몸 전체'],
        description: '등을 대고 누운 뒤, 손과 팔은 자연스럽게 벌린다.',
    },
    {
        id: 'anjaneyasana',
        name: '안자니아사나',
        target_area: ['무릎', '발바닥', '손끝', '정강이', '발등'],
        description: '한쪽 발바닥은 매트 앞쪽, 반대 무릎은 매트 뒤쪽에 둔다. 골반을 열고 손끝으로바닥을 짚는다.'
    },
    {
        id: 'balasana',
        name: '발라아사나',
        target_area: ['손바닥', '이마', '정강이', '발등'],
        description: '무릎을 꿇은 채 이마를 매트 앞쪽에 둔다. 양손 손바닥을 머리 위로 뻗거나 몸 옆에 둔다.'
    },
    {
        id: 'sarvangasana',
        name: '사르방가아사나',
        target_area: ['뒷통수', '어깨', '팔뚝'],
        description: '어깨와 팔은 매트를 누르고, 다리를 위로 뻗는다. 목을 편안하게 두고, 몸은 하늘을 향해 들어올린다.'
    },
    {
        id: 'ustrasana',
        name: '우스트라아사나',
        target_area: ['무릎', '정강이', '손끝'],
        description: '양 무릎을 바닥에 대고 앉은 후, 상체를 뒤로 젖혀 손으로 발꿈치를 잡는다. 가슴은 천장을 향해 뻗는다.'
    },
    {
        id: 'ardha-matsyendrasana',
        name: '아르다 마첸드라아사나',
        target_area: ['엉덩이', '허벅지', '발바닥'],
        description: '엉덩이를 대고 앉는다. 한쪽 다리를 접고, 반대쪽은 상체를 틀며 복부 너머로 넘긴다. 척추를 중심으로 몸을 회전시킨다.'
    },
];

// ID로 포즈 찾기
export function getPoseById(id: string): Pose | undefined {
    return poses.find(pose => pose.id === id);
}
