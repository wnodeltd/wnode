"use client";

import React, { useState, useEffect } from "react";
import { TreeNode, AffiliateNode } from "./TreeNode";

interface TreeProps {
    onNodeClick?: (node: AffiliateNode) => void;
    selectedNodeId?: string;
}

export const Tree = ({ onNodeClick, selectedNodeId }: TreeProps) => {
    const [rootNodes, setRootNodes] = useState<AffiliateNode[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRoots = async () => {
            try {
                // Mocking root fetch — in Phase 2 this will hit /api/v1/affiliates/roots
                const mockRoots: AffiliateNode[] = [
                    {
                        nodlrId: "12D3KooWLAbvSjDYvHfeNC1ge8ipJvRHkgGGaWRDvMxF1qxMo3hS",
                        wuid: "100001-0426-01-AA", // Normalized WUID
                        nodeCount: 142,
                        l1Count: 12,
                        l2Count: 130,
                        active: true,
                        isFounder: true,
                        founderIndex: 1,
                        children: []
                    },
                    {
                        nodlrId: "12D3KooWNnQ2KA9pSB5M1vzAgfD9D87KGwViPJM6V9x47WPKDpqM",
                        wuid: "100001-0426-02-BB", // Normalized WUID
                        nodeCount: 84,
                        l1Count: 8,
                        l2Count: 76,
                        active: true,
                        isFounder: false,
                        children: []
                    }
                ];
                setRootNodes(mockRoots);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRoots();
    }, []);

    const loadChildren = async (id: string): Promise<AffiliateNode[]> => {
        // Mocking child fetch — in Phase 2 this will hit /api/v1/affiliates/children?id={id}
        const childId = `child-of-${id.slice(-8)}`;
        return [
            {
                nodlrId: childId,
                wuid: childId, // Normalize fallback to ID if no WUID present
                nodeCount: 5,
                l1Count: 1,
                l2Count: 4,
                active: Math.random() > 0.3,
                children: []
            }
        ];
    };

    if (isLoading) {
        return (
            <div className="flex items-center gap-3 p-4">
                <div className="w-4 h-4 border-2 border-[#22D3EE]/20 border-t-[#22D3EE] rounded-full animate-spin" />
                <span className="text-[12px] text-slate-500 font-mono">Initializing topology mapping...</span>
            </div>
        );
    }

    return (
        <div className="space-y-1">
            {rootNodes.map((node) => (
                <TreeNode 
                    key={node.nodlrId} 
                    node={node} 
                    loadChildren={loadChildren} 
                    onNodeClick={onNodeClick} 
                    selectedNodeId={selectedNodeId}
                />
            ))}
        </div>
    );
};
