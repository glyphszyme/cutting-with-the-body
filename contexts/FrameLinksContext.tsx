"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FrameLink {
    slot: 'left' | 'center' | 'right';
    href?: string;
    onClick?: () => void;
    label: string;
}

interface FrameLinksContextType {
    links: FrameLink[];
    setLinks: (links: FrameLink[]) => void;
}

const FrameLinksContext = createContext<FrameLinksContextType | undefined>(undefined);

export function FrameLinksProvider({ children }: { children: ReactNode }) {
    const [links, setLinks] = useState<FrameLink[]>([]);

    return (
        <FrameLinksContext.Provider value={{ links, setLinks }}>
            {children}
        </FrameLinksContext.Provider>
    );
}

export function useFrameLinks() {
    const context = useContext(FrameLinksContext);
    if (!context) {
        throw new Error('useFrameLinks must be used within FrameLinksProvider');
    }
    return context;
}
