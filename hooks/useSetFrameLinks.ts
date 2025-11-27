"use client";

import { useEffect } from 'react';
import { useFrameLinks } from '@/contexts/FrameLinksContext';

interface UseFrameLinksProps {
    links: Array<{
        slot: 'left' | 'center' | 'right';
        href?: string;
        onClick?: () => void;
        label: string;
    }>;
}

export function useSetFrameLinks({ links }: UseFrameLinksProps) {
    const { setLinks } = useFrameLinks();
    
    useEffect(() => {
        setLinks(links);
        
        // 페이지 이탈 시 초기화
        return () => setLinks([]);
    }, [links, setLinks]);
}
