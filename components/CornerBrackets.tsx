"use client";

import React from 'react';
import { useCornerLinks } from '@/contexts/CornerLinksContext';
import CornerLink from './CornerLink';

export default function CornerBrackets() {
    const { links } = useCornerLinks();
    
    // slot별로 링크 분류
    const linksBySlot: Record<string, React.ReactNode> = {};
    links.forEach((link) => {
        linksBySlot[link.slot] = (
            <CornerLink key={link.slot} href={link.href} onClick={link.onClick}>
                {link.label}
            </CornerLink>
        );
    });

    return (
        <>
            <div className="corner-top-left">{linksBySlot['top-left']}</div>
            <div className="corner-top-center">{linksBySlot['top-center']}</div>
            <div className="corner-top-right">{linksBySlot['top-right']}</div>
            <div className="corner-bottom-left">{linksBySlot['bottom-left']}</div>
            <div className="corner-bottom-center">{linksBySlot['bottom-center']}</div>
            <div className="corner-bottom-right">{linksBySlot['bottom-right']}</div>
            
            {/* 코너 사이 위치 */}
            {linksBySlot['top-left-center'] && <div className="corner-slot corner-slot-top-left-center">{linksBySlot['top-left-center']}</div>}
            {linksBySlot['top-right-center'] && <div className="corner-slot corner-slot-top-right-center">{linksBySlot['top-right-center']}</div>}
            {linksBySlot['bottom-left-center'] && <div className="corner-slot corner-slot-bottom-left-center">{linksBySlot['bottom-left-center']}</div>}
            {linksBySlot['bottom-right-center'] && <div className="corner-slot corner-slot-bottom-right-center">{linksBySlot['bottom-right-center']}</div>}
        </>
    );
}
