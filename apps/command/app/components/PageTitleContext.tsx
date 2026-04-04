"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface PageTitleContextType {
    pageTitle: string;
    setPageTitle: (title: string) => void;
}

const PageTitleContext = createContext<PageTitleContextType | undefined>(undefined);

export function PageTitleProvider({ children }: { children: ReactNode }) {
    const [pageTitle, setPageTitle] = useState("");

    return (
        <PageTitleContext.Provider value={{ pageTitle, setPageTitle }}>
            {children}
        </PageTitleContext.Provider>
    );
}

/**
 * Hook to set the page title and access the current title.
 * @param title Optional title to set on mount
 */
export function usePageTitle(title?: string) {
    const context = useContext(PageTitleContext);
    if (!context) {
        throw new Error("usePageTitle must be used within a PageTitleProvider");
    }

    useEffect(() => {
        if (title) {
            context.setPageTitle(title);
        }
    }, [title, context]);

    return context;
}
