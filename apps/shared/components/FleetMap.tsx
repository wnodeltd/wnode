"use client";

import React, { useEffect, useRef, useState } from "react";
import { Globe, MapPin, Radio, Activity } from "lucide-react";
import "leaflet/dist/leaflet.css";

interface MapProps {
    nodes: any[];
    loading?: boolean;
    onNodeSelect?: (id: string) => void;
}

export default function FleetMap({ nodes, loading = false, onNodeSelect }: MapProps) {
    const mapRef = useRef<any>(null);
    const markersRef = useRef<any>(null);
    const [L, setL] = useState<any>(null);

    const nodeList = Array.isArray(nodes) ? nodes : Object.values(nodes || {});
    const mappedNodes = nodeList.filter((n: any) => 
        n.lat !== undefined && n.lon !== undefined && 
        isFinite(Number(n.lat)) && isFinite(Number(n.lon))
    );

    useEffect(() => {
        if (typeof window === "undefined") return;

        const init = async () => {
            const leaflet = (await import("leaflet")).default;
            setL(leaflet);
            
            const container = document.getElementById("shared-fleet-map");
            if (!container || mapRef.current) return;

            mapRef.current = leaflet.map("shared-fleet-map", {
                center: [20, 0],
                zoom: 2,
                zoomControl: false,
                attributionControl: false,
            });

            leaflet.tileLayer(
                "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
                {
                    maxZoom: 20,
                    attribution: '&copy; Stadia Maps, &copy; OpenMapTiles, &copy; OpenStreetMap',
                }
            ).addTo(mapRef.current);

            markersRef.current = leaflet.layerGroup().addTo(mapRef.current);
        };

        init();

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!mapRef.current || !markersRef.current || !L || !mappedNodes.length) return;

        markersRef.current.clearLayers();

        mappedNodes.forEach((node: any) => {
            const status = node.status?.toLowerCase() || "active";
            let color = "#22D3EE";
            if (status === "offline" || status === "down") color = "#EF4444";
            if (status === "suspended" || status === "flagged") color = "#F59E0B";

            const marker = L.circleMarker([node.lat, node.lon], {
                radius: 6,
                fillColor: color,
                color: "#FFFFFF",
                weight: 1.5,
                opacity: 1,
                fillOpacity: 0.8,
            }).addTo(markersRef.current);

            const tooltipContent = `
                <div style="font-family: ui-monospace, monospace; padding: 6px 10px; border-radius: 4px; font-size: 11px; background: #000; border: 1px solid rgba(255,255,255,0.1); color: #fff;">
                    <div style="color: #64748b; margin-bottom: 2px;">NODE_ID: <span style="color: #fff; font-weight: bold;">${node.id || 'Unknown'}</span></div>
                    <div style="color: #64748b;">STATUS: <span style="color: ${color}; font-weight: bold; text-transform: uppercase;">${status}</span></div>
                </div>
            `;

            marker.bindTooltip(tooltipContent, {
                direction: "top",
                offset: [0, -10],
                className: "nodl-map-tooltip",
                opacity: 0.9,
            });

            if (onNodeSelect) {
                marker.on("click", () => onNodeSelect(node.id));
            }
        });
    }, [L, mappedNodes, onNodeSelect]);

    return (
        <section className="w-full bg-white/[0.02] border border-white/10 p-6 rounded-[5px] h-[520px] relative overflow-hidden flex flex-col group backdrop-blur-sm shadow-xl transition-all hover:bg-white/[0.03]">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-[#22D3EE] opacity-70" />
                    <span className="text-[11px] font-bold text-white uppercase tracking-[0.2em]">Global Fleet Distribution</span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] shadow-[0_0_8px_#22D3EE]" />
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Protocol Active</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 relative bg-black/40 rounded-[5px] overflow-hidden border border-white/5">
                <div id="shared-fleet-map" className="absolute inset-0 z-0" style={{ backgroundColor: "#050505" }} />

                {loading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-md">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-8 h-8 border-2 border-t-[#22D3EE] border-white/10 rounded-full animate-spin" />
                            <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Synchronizing Nodes...</span>
                        </div>
                    </div>
                )}

                {!loading && mappedNodes.length === 0 && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                        <div className="flex flex-col items-center gap-4 p-8 bg-black/60 border border-white/10 rounded-[5px] backdrop-blur-md">
                            <MapPin className="w-8 h-8 text-slate-700" />
                            <div className="text-center">
                                <span className="text-[11px] text-white uppercase tracking-[0.2em] font-bold block mb-1">Zero geocoded nodes detected</span>
                                <span className="text-[10px] text-slate-600 font-mono tracking-widest uppercase">Nodes online: {nodeList.length} — Awaiting coordinate data</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="absolute bottom-10 right-10 flex flex-col items-end pointer-events-none z-10">
                <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-[#22D3EE] animate-pulse uppercase">Fleet Link Active</span>
                <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-widest font-mono">P2P_MESH_MODE: OPERATIONAL</p>
            </div>
        </section>
    );
}
