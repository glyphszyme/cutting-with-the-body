"use client";

import { useEffect } from 'react';
import { useCornerLinks } from '@/contexts/CornerLinksContext';

interface UseCornerLinksProps {
    links: Array<{
        slot: 'top-left' | 'top-center' | 'top-right' | 'top-left-center' | 'top-right-center' |
              'bottom-left' | 'bottom-center' | 'bottom-right' | 'bottom-left-center' | 'bottom-right-center';
        href?: string;
        onClick?: () => void;
        label: string;
    }>;
}

export function useSetCornerLinks({ links }: UseCornerLinksProps) {
    const { setLinks } = useCornerLinks();
    
    useEffect(() => {
        setLinks(links);
        
        // 페이지 이탈 시 초기화
        return () => setLinks([]);
    }, [links, setLinks]);
}
