// 모든 페이지별 frame link를 한 곳에서 관리
import { FrameLink } from '@/contexts/FrameLinksContext';

export const frameLinksMap: Record<string, FrameLink[]> = {
  '/': [
    { slot: 'center', href: '/select', label: '자세둘러보기' },
  ],
  '/adjust': [
    { slot: 'left', href: '/select', label: '다른자세보기' },
    { slot: 'center', href: '/', label: '처음으로' },
    { slot: 'right', href: '/cut', label: '다시재단하기' },
  ],
  '/select': [
    { slot: 'left', href: '/cut', label: '바로재단하기' },
    { slot: 'right', href: '/notice', label: '주의사항보기' },
  ],
  '/cut': [
    { slot: 'left', href: '/', label: '처음으로' },
    { slot: 'right', href: '/select', label: '뒤로가기' },
  ],
  '/notice': [
    { slot: 'left', href: '/', label: '처음으로' },
    { slot: 'center', href: '/select', label: '재단하기' },
    { slot: 'right', href: '/select', label: '뒤로가기' },
  ],
  // ... 필요시 추가
};
