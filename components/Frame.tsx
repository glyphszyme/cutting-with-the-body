"use client";

import React from 'react';
import { FrameLinksProvider } from '@/contexts/FrameLinksContext';
import { useFrameLinks } from '@/contexts/FrameLinksContext';
import FrameLink from './FrameLink';

interface FrameProps {
    children: React.ReactNode;
}

function FrameContent({ children }: FrameProps) {
    const { links } = useFrameLinks();
    
    // 링크를 slot별로 분류
    const linksBySlot: Record<string, React.ReactNode> = {};
    links.forEach((link) => {
        linksBySlot[link.slot] = (
            <FrameLink key={link.slot} href={link.href} onClick={link.onClick}>
                {link.label}
            </FrameLink>
        );
    });

    return (
        <div className="frame">
            {/* 1. Crop marks - 시각적 구조물 (6개 위치) */}
            <div className="crop-mark-top-left" />
            <div className="crop-mark-top-center" />
            <div className="crop-mark-top-right" />
            <div className="crop-mark-bottom-left" />
            <div className="crop-mark-bottom-center" />
            <div className="crop-mark-bottom-right" />
            
            {/* 2. Bottom crop marks 사이에 링크 제공 (3개 슬롯: left, center, right) */}
            {linksBySlot['left'] && (
                <div className="frame-link-slot frame-link-slot-left">
                    {linksBySlot['left']}
                </div>
            )}
            {linksBySlot['center'] && (
                <div className="frame-link-slot frame-link-slot-center">
                    {linksBySlot['center']}
                </div>
            )}
            {linksBySlot['right'] && (
                <div className="frame-link-slot frame-link-slot-right">
                    {linksBySlot['right']}
                </div>
            )}
            
            {/* 3. 페이지 콘텐츠 */}
            {children}
        </div>
    );
}

// Provider로 감싸서 각 페이지에서 useSetFrameLinks로 링크 설정 가능
export default function Frame({ children, initialLinks = [] }: FrameProps & { initialLinks?: any }) {
    return (
        <FrameLinksProvider initialLinks={initialLinks}>
            <FrameContent>{children}</FrameContent>
        </FrameLinksProvider>
    );
}
