"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CornerLink {
    slot: 'top-left' | 'top-center' | 'top-right' | 'top-left-center' | 'top-right-center' |
          'bottom-left' | 'bottom-center' | 'bottom-right' | 'bottom-left-center' | 'bottom-right-center';
    href?: string;
    onClick?: () => void;
    label: string;
}

interface CornerLinksContextType {
    links: CornerLink[];
    setLinks: (links: CornerLink[]) => void;
}

const CornerLinksContext = createContext<CornerLinksContextType | undefined>(undefined);

export function CornerLinksProvider({ children }: { children: ReactNode }) {
    const [links, setLinks] = useState<CornerLink[]>([]);

    return (
        <CornerLinksContext.Provider value={{ links, setLinks }}>
            {children}
        </CornerLinksContext.Provider>
    );
}

export function useCornerLinks() {
    const context = useContext(CornerLinksContext);
    if (!context) {
        throw new Error('useCornerLinks must be used within CornerLinksProvider');
    }
    return context;
}
