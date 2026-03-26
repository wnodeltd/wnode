"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { TrendingUp, AlertTriangle, Shield, Zap, Activity, Info } from "lucide-react";

interface MarketRate {
    source: string;
    price: number;
    timestamp: string;
}

interface PricingRule {
    mode: string;
    multiplier: number;
    percentOffset: number;
    floor: number;
    ceiling: number;
    manualOverride: number;
    autoTuneMode: string;
    targetPercent: number;
    targetPosition: number;
}

interface HistoryPoint {
    price: number;
    volatility: number;
    timestamp: string;
}

interface Alert {
    tierID: string;
    level: string;
    message: string;
    timestamp: string;
}

interface TierState {
    id: string;
    name: string;
    liveMarket: number;
    mean: number;
    volatility: number;
    effectiveRate: number;
    rule: PricingRule;
    smas: { m5: number; m15: number; h1: number };
    ema: number;
    sources: MarketRate[];
    history: HistoryPoint[];
    alerts: Alert[];
    lastUpdate: string;
}

interface PricingState {
    tiers: Record<string, TierState>;
    lastUpdate: string;
}

const DEFAULT_TIERS = [
    { id: 'tiny', name: 'Tiny', devices: 'Phones/Tablets' },
    { id: 'standard', name: 'Standard', devices: 'Laptops/Desktops' },
    { id: 'boost', name: 'Boost', devices: 'Gaming PCs/Macs' },
    { id: 'pro', name: 'Pro', devices: 'Servers/Workstations' },
    { id: 'ultra', name: 'Ultra', devices: 'GPU Rigs/DGX' },
];

export default function PricingPage() {
    const [pricing, setPricing] = useState<PricingState | null>(null);
    const [selectedTier, setSelectedTier] = useState<string | null>(null);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [isOwner] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPricingData = async () => {
        try {
            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://api.nodl.one';
            const [pricingRes, alertsRes] = await Promise.all([
                fetch(`${apiBase}/pricing`),
                fetch(`${apiBase}/pricing/alerts`)
            ]);
            
            if (pricingRes.ok) {
                const data = await pricingRes.json();
                setPricing(data);
            }
            if (alertsRes.ok) {
                const data = await alertsRes.json();
                setAlerts(data);
            }
        } catch (err) {
            console.error("Failed to fetch data:", err);
            setError("Connection to API gateway failed.");
        }
    };

    useEffect(() => {
        fetchPricingData();
        const interval = setInterval(fetchPricingData, 10000); // 10s poll for v3.0
        return () => clearInterval(interval);
    }, []);

    const updateOverride = async (tierId: string, rule: PricingRule) => {
        try {
            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://api.nodl.one';
            const res = await fetch(`${apiBase}/pricing/override`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tierID: tierId, rule })
            });
            if (res.ok) {
                const updatedTier = await res.json();
                setPricing(prev => prev ? {
                    ...prev,
                    tiers: { ...prev.tiers, [tierId]: updatedTier }
                } : prev);
            }
        } catch (err) {
            console.error("Failed to update override:", err);
        }
    };

    const activeTier = selectedTier && pricing?.tiers[selectedTier];

    return (
        <div className="flex min-h-screen bg-black text-white font-sans overflow-hidden">
            <Sidebar />
            <div className="flex-1 lg:pl-64 flex flex-col relative h-screen overflow-hidden">
                <header className="h-14 border-b border-white/25 flex items-center justify-between px-8 bg-black shrink-0">
                    <div className="flex items-center gap-4">
                        <span className="text-[12px] font-normal text-slate-400 tracking-[0.2em] uppercase-none">Autonomous Pricing Engine v3.0</span>
                        <div className="flex items-center gap-2 bg-[#22D3EE]/10 px-2 py-0.5 rounded border border-[#22D3EE]/20">
                            <Activity className="w-3 h-3 text-[#22D3EE] animate-pulse" />
                            <span className="text-[10px] text-[#22D3EE] font-mono">ORACLE_ACTIVE</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5 bg-[#22D3EE] px-3 py-1 rounded-[5px]">
                        <span className="text-[14px] text-black font-normal uppercase-none italic">Stephen_Nodlrs [Owner]</span>
                    </div>
                </header>

                <main className="flex-1 p-8 overflow-y-auto pb-24 space-y-8">
                    {/* Hero Section */}
                    <div className="flex justify-between items-end">
                        <div>
                            <h2 className="text-[20px] font-normal tracking-tight text-white mb-1 uppercase-none italic">Market Intelligence Console</h2>
                            <p className="text-[14px] text-slate-400 font-normal uppercase-none">Advanced volatility smoothing and autonomous valuation protocols.</p>
                        </div>
                        <div className="flex gap-4">
                           <div className="card-sovereign py-2 px-4 border-[#22D3EE]/20 bg-[#22D3EE]/5">
                                <span className="text-[10px] text-slate-500 block">Avg Volatility</span>
                                <span className="text-[16px] text-[#22D3EE] font-mono">High Coverage</span>
                           </div>
                           <div className="card-sovereign py-2 px-4 border-orange-500/20 bg-orange-500/5">
                                <span className="text-[10px] text-slate-500 block">System Alerts</span>
                                <span className="text-[16px] text-orange-400 font-mono">{alerts.length} Active</span>
                           </div>
                        </div>
                    </div>

                    {/* Alerts Feed */}
                    {alerts.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {alerts.slice(0, 2).map((alert, idx) => (
                                <div key={idx} className={`p-3 rounded-[5px] border flex items-center gap-3 animate-in fade-in duration-500 ${
                                    alert.level === 'critical' ? 'bg-[#22D3EE]/10 border-[#22D3EE]/30 text-[#22D3EE]' :
                                    alert.level === 'warning' ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' :
                                    'bg-blue-500/10 border-blue-500/30 text-blue-400'
                                }`}>
                                    <AlertTriangle className="w-4 h-4 shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-[12px] font-bold uppercase-none">{alert.tierID.toUpperCase()} ALERT</p>
                                        <p className="text-[12px] opacity-80">{alert.message}</p>
                                    </div>
                                    <span className="text-[10px] opacity-50 font-mono">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Tier Selection Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {DEFAULT_TIERS.map((tier) => {
                            const state = pricing?.tiers[tier.id];
                            const isSelected = selectedTier === tier.id;
                            
                            return (
                                <div 
                                    key={tier.id} 
                                    onClick={() => setSelectedTier(tier.id)}
                                    className={`card-sovereign p-5 flex flex-col gap-4 group transition-all cursor-pointer ${isSelected ? 'border-[#22D3EE] bg-white/[0.12]' : 'hover:border-[#22D3EE]/50 shadow-none'}`}
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-white text-[16px] font-normal tracking-tight uppercase-none">{tier.name}</h3>
                                            <div className="flex gap-1">
                                                {state?.volatility !== undefined && state.volatility > 0.05 && (
                                                    <Zap className="w-3 h-3 text-orange-400" />
                                                )}
                                                <span className="text-[9px] bg-[#22D3EE]/10 text-[#22D3EE] px-1.5 py-0.5 rounded-[2px] border border-[#22D3EE]/20 font-bold">
                                                    {state?.rule.mode === 'manual' ? 'MAN' : state?.rule.mode === 'auto_tune' ? 'AUTO' : 'MKT'}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-slate-500 text-[11px] uppercase-none tracking-wider">{tier.devices}</p>
                                    </div>

                                    {/* Sparkline Visualization */}
                                    <div className="h-12 w-full bg-white/[0.03] rounded-[3px] overflow-hidden relative border border-white/5">
                                        {state?.history && state.history.length > 1 ? (
                                            <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                                                <polyline
                                                    fill="none"
                                                    stroke="#22D3EE"
                                                    strokeWidth="1.5"
                                                    points={state.history.slice(-10).map((p, i) => `${i * 11.1},${40 - ((p.price - (state.liveMarket * 0.8)) / (state.liveMarket * 0.4) * 40)}`).join(' ')}
                                                />
                                            </svg>
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-full h-[1px] bg-white/10" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-3 py-3 border-y border-white/10">
                                        <div className="flex justify-between items-end">
                                            <span className="text-slate-500 text-[9px] uppercase-none tracking-widest">Effective</span>
                                            <div className="flex items-baseline gap-0.5">
                                                <span className="text-[20px] text-[#22D3EE] font-normal tracking-tighter leading-none font-mono">
                                                    ${state?.effectiveRate.toFixed(4) || "0.0000"}
                                                </span>
                                                <span className="text-slate-600 text-[10px]">/hr</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-center text-[9px]">
                                        <div className="flex items-center gap-1.5 text-slate-500">
                                            <div className={`w-1 h-1 rounded-full ${state ? 'bg-[#22D3EE]' : 'bg-slate-700 animate-pulse'}`} />
                                            <span className="font-mono">{state ? 'SYNCED' : 'FETCHING'}</span>
                                        </div>
                                        <span className="text-slate-600 font-mono italic">
                                            {state?.volatility !== undefined ? `±${(state.volatility/state.liveMarket*100).toFixed(1)}%` : '--'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Advanced analytics & Rule Editor */}
                    {activeTier && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                            {/* Analytics Panel */}
                            <div className="lg:col-span-8 flex flex-col gap-6">
                                <div className="card-sovereign p-6 flex flex-col gap-6">
                                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                        <div>
                                            <h3 className="text-[18px] text-white uppercase-none italic tracking-tight">{activeTier.name} Analytics</h3>
                                            <p className="text-slate-500 text-[13px]">Historical trends, volatility bands, and normalization metrics.</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="px-3 py-1 bg-white/5 rounded-[4px] border border-white/10 flex flex-col items-center">
                                                <span className="text-[9px] text-slate-500">Vol Band</span>
                                                <span className="text-[12px] text-[#22D3EE] font-mono">2σ Stable</span>
                                            </div>
                                            <div className="px-3 py-1 bg-white/5 rounded-[4px] border border-white/10 flex flex-col items-center">
                                                <span className="text-[9px] text-slate-500">MA Spread</span>
                                                <span className="text-[12px] text-emerald-400 font-mono">Tight</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Large Chart */}
                                    <div className="h-64 w-full bg-black/40 rounded-[5px] border border-white/10 relative overflow-hidden group">
                                        <div className="absolute top-4 left-4 flex gap-4 z-10">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-[#22D3EE]" />
                                                <span className="text-[10px] text-slate-400 font-mono uppercase-none">Market Price</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                                <span className="text-[10px] text-slate-400 font-mono uppercase-none">EMA Smoothing</span>
                                            </div>
                                        </div>

                                        {activeTier.history && activeTier.history.length > 1 ? (
                                            <svg className="w-full h-full px-4 pt-12 pb-4" viewBox="0 0 1000 200" preserveAspectRatio="none">
                                                {/* Grid Lines */}
                                                <line x1="0" y1="50" x2="1000" y2="50" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.1" />
                                                <line x1="0" y1="100" x2="1000" y2="100" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.1" />
                                                <line x1="0" y1="150" x2="1000" y2="150" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.1" />
                                                
                                                {/* Price Line */}
                                                <polyline
                                                    fill="none"
                                                    stroke="#22D3EE"
                                                    strokeWidth="2"
                                                    strokeLinejoin="round"
                                                    points={activeTier.history.map((p, i) => `${(i / (activeTier.history.length - 1)) * 1000},${180 - ((p.price - (activeTier.liveMarket * 0.7)) / (activeTier.liveMarket * 0.6) * 160)}`).join(' ')}
                                                />
                                                
                                                {/* EMA Sim */}
                                                <polyline
                                                    fill="none"
                                                    stroke="rgba(52, 211, 153, 0.5)"
                                                    strokeWidth="2"
                                                    strokeDasharray="5 5"
                                                    points={activeTier.history.map((p, i) => `${(i / (activeTier.history.length - 1)) * 1000},${185 - ((activeTier.ema - (activeTier.liveMarket * 0.7)) / (activeTier.liveMarket * 0.6) * 160)}`).join(' ')}
                                                />
                                            </svg>
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-slate-600 italic text-[14px]">
                                                Initializing historical buffer...
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-[4px] space-y-1">
                                            <span className="text-[10px] text-slate-500 uppercase-none tracking-widest">5m SMA</span>
                                            <span className="text-[16px] text-white font-mono block">${activeTier.smas.m5.toFixed(4)}</span>
                                        </div>
                                        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-[4px] space-y-1">
                                            <span className="text-[10px] text-slate-500 uppercase-none tracking-widest">15m SMA</span>
                                            <span className="text-[16px] text-white font-mono block">${activeTier.smas.m15.toFixed(4)}</span>
                                        </div>
                                        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-[4px] space-y-1">
                                            <span className="text-[10px] text-slate-500 uppercase-none tracking-widest">EMA (α=0.3)</span>
                                            <span className="text-[16px] text-emerald-400 font-mono block">${activeTier.ema.toFixed(4)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-sovereign p-6 bg-[#22D3EE]/5 border-[#22D3EE]/20">
                                    <h4 className="text-[11px] text-[#22D3EE] font-bold uppercase-none mb-4 flex items-center gap-2">
                                        <Shield className="w-3.5 h-3.5" />
                                        VALUATION LOGIC EXECUTION
                                    </h4>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                        <div className="space-y-1">
                                            <span className="text-[9px] text-slate-500 block uppercase-none">Raw Market</span>
                                            <span className="text-[14px] text-slate-300 font-mono">${activeTier.mean.toFixed(4)}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[9px] text-slate-500 block uppercase-none">Normalization</span>
                                            <span className="text-[14px] text-slate-300 font-mono italic">IQR Filter</span>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[9px] text-slate-500 block uppercase-none">Volatility Offset</span>
                                            <span className="text-[14px] text-slate-300 font-mono">{(activeTier.volatility/activeTier.liveMarket*100).toFixed(2)}%</span>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[9px] text-slate-500 block uppercase-none">Safety Dampening</span>
                                            <span className="text-[14px] text-[#22D3EE] font-mono">Active (2σ)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Configuration Panel */}
                            <div className="lg:col-span-4 flex flex-col gap-6">
                                <div className="card-sovereign p-6 flex flex-col gap-6 h-full">
                                    <div className="border-b border-white/10 pb-4">
                                        <h3 className="text-[18px] text-[#22D3EE] uppercase-none italic tracking-tight">Auto-Tuning Engine</h3>
                                        <p className="text-slate-500 text-[13px]">Define autonomous behavior & safety limits.</p>
                                    </div>

                                    <div className="flex bg-black p-1 rounded-[6px] border border-white/10">
                                        {['follow_market', 'auto_tune', 'manual'].map((m) => (
                                            <button 
                                                key={m}
                                                onClick={() => updateOverride(activeTier.id, { ...activeTier.rule, mode: m })}
                                                className={`flex-1 py-2 text-[10px] rounded-[4px] font-bold transition-all uppercase-none ${activeTier.rule.mode === m ? 'bg-[#22D3EE] text-black shadow-[0_0_12px_rgba(34,211,238,0.4)]' : 'text-slate-500 hover:text-slate-300'}`}
                                            >
                                                {m.replace('_', ' ')}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex-1 space-y-6">
                                        {activeTier.rule.mode === 'auto_tune' ? (
                                            <div className="space-y-6 animate-in fade-in duration-300">
                                                <div className="flex flex-col gap-3">
                                                    <label className="text-slate-400 text-[11px] uppercase-none tracking-widest font-bold">Optimization Strategy</label>
                                                    <select 
                                                        value={activeTier.rule.autoTuneMode}
                                                        onChange={(e) => updateOverride(activeTier.id, { ...activeTier.rule, autoTuneMode: e.target.value })}
                                                        className="bg-black/50 border border-white/20 rounded-[5px] px-4 py-2.5 text-[#22D3EE] font-mono focus:border-[#22D3EE] focus:outline-none appearance-none cursor-pointer"
                                                    >
                                                        <option value="undercut">UNDERCUT MARKET</option>
                                                        <option value="top_n">MAINTAIN TOP POSITION</option>
                                                        <option value="volatility_adaptive">VOLATILITY ADAPTIVE</option>
                                                    </select>
                                                </div>

                                                {activeTier.rule.autoTuneMode === 'undercut' && (
                                                    <div className="flex flex-col gap-3">
                                                        <label className="text-slate-400 text-[11px] uppercase-none tracking-widest">Undercut Offset (%)</label>
                                                        <input 
                                                            type="number" step="0.5"
                                                            value={activeTier.rule.targetPercent}
                                                            onChange={(e) => updateOverride(activeTier.id, { ...activeTier.rule, targetPercent: parseFloat(e.target.value) || 0 })}
                                                            className="bg-black/80 border border-white/20 rounded-[5px] px-4 py-2.5 text-[#22D3EE] font-mono focus:border-[#22D3EE] focus:outline-none"
                                                        />
                                                        <p className="text-[10px] text-slate-600 italic">Reduces pricing by X% below market median to drive node utilization.</p>
                                                    </div>
                                                )}

                                                {activeTier.rule.autoTuneMode === 'top_n' && (
                                                    <div className="flex flex-col gap-3">
                                                        <label className="text-slate-400 text-[11px] uppercase-none tracking-widest">Target Market Position (%)</label>
                                                        <input 
                                                            type="number" step="1"
                                                            value={activeTier.rule.targetPosition}
                                                            onChange={(e) => updateOverride(activeTier.id, { ...activeTier.rule, targetPosition: parseFloat(e.target.value) || 0 })}
                                                            className="bg-black/80 border border-white/20 rounded-[5px] px-4 py-2.5 text-[#22D3EE] font-mono focus:border-[#22D3EE] focus:outline-none"
                                                        />
                                                        <p className="text-[10px] text-slate-600 italic">Positions effective rate in the top N% of global cloud pricing.</p>
                                                    </div>
                                                )}
                                            </div>
                                        ) : activeTier.rule.mode === 'manual' ? (
                                            <div className="flex flex-col gap-3 animate-in fade-in duration-300">
                                                <label className="text-slate-400 text-[11px] uppercase-none tracking-widest font-bold font-mono">Static Override (USD/hr)</label>
                                                <input 
                                                    type="number" step="0.01"
                                                    value={activeTier.rule.manualOverride}
                                                    onChange={(e) => updateOverride(activeTier.id, { ...activeTier.rule, manualOverride: parseFloat(e.target.value) || 0 })}
                                                    className="bg-black/80 border border-white/20 rounded-[5px] px-4 py-2.5 text-[#22D3EE] font-mono text-[18px] focus:border-[#22D3EE] focus:outline-none"
                                                />
                                            </div>
                                        ) : (
                                            <div className="space-y-6 animate-in fade-in duration-300">
                                                <div className="flex flex-col gap-3">
                                                    <label className="text-slate-400 text-[11px] uppercase-none tracking-widest font-bold font-mono">Multiplier (x)</label>
                                                    <input 
                                                        type="number" step="0.05"
                                                        value={activeTier.rule.multiplier}
                                                        onChange={(e) => updateOverride(activeTier.id, { ...activeTier.rule, multiplier: parseFloat(e.target.value) || 0 })}
                                                        className="bg-black/80 border border-white/20 rounded-[5px] px-4 py-2.5 text-[#22D3EE] font-mono focus:border-[#22D3EE] focus:outline-none"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-3">
                                                    <label className="text-slate-400 text-[11px] uppercase-none tracking-widest font-bold font-mono">Relative Offset (%)</label>
                                                    <input 
                                                        type="number" step="1"
                                                        value={activeTier.rule.percentOffset}
                                                        onChange={(e) => updateOverride(activeTier.id, { ...activeTier.rule, percentOffset: parseFloat(e.target.value) || 0 })}
                                                        className="bg-black/80 border border-white/20 rounded-[5px] px-4 py-2.5 text-[#22D3EE] font-mono focus:border-[#22D3EE] focus:outline-none"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div className="pt-6 border-t border-white/10 space-y-4">
                                            <div className="flex flex-col gap-2">
                                                <span className="text-slate-500 text-[10px] uppercase-none tracking-widest font-bold">Hard Pricing Floor</span>
                                                <div className="flex items-center gap-3">
                                                    <input 
                                                        type="number" step="0.01"
                                                        value={activeTier.rule.floor}
                                                        onChange={(e) => updateOverride(activeTier.id, { ...activeTier.rule, floor: parseFloat(e.target.value) || 0 })}
                                                        className="bg-black border border-white/10 rounded-[4px] px-3 py-1.5 text-slate-300 font-mono text-[12px] w-full focus:border-[#22D3EE] focus:outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <span className="text-slate-500 text-[10px] uppercase-none tracking-widest font-bold">Hard Pricing Ceiling</span>
                                                <div className="flex items-center gap-3">
                                                    <input 
                                                        type="number" step="0.01"
                                                        value={activeTier.rule.ceiling}
                                                        onChange={(e) => updateOverride(activeTier.id, { ...activeTier.rule, ceiling: parseFloat(e.target.value) || 0 })}
                                                        className="bg-black border border-white/10 rounded-[4px] px-3 py-1.5 text-slate-300 font-mono text-[12px] w-full focus:border-[#22D3EE] focus:outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        <button className="w-full py-3 bg-[#22D3EE]/10 border border-[#22D3EE]/30 text-[#22D3EE] rounded-[5px] text-[12px] font-bold tracking-widest uppercase-none hover:bg-[#22D3EE]/20 transition-all flex items-center justify-center gap-2">
                                            <Shield className="w-4 h-4" />
                                            SAVE RULE CONFIG
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {!activeTier && (
                        <div className="card-sovereign p-20 flex flex-col items-center justify-center text-center gap-6 border-dashed border-white/10 bg-transparent">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                                <Activity className="w-8 h-8 text-slate-600" />
                            </div>
                            <div>
                                <h3 className="text-white text-[18px] uppercase-none italic">Select a tier for autonomous optimization</h3>
                                <p className="text-slate-500 max-w-sm mt-2">Deep analytics and rule-based tuning are available for all configured compute tiers once selected.</p>
                            </div>
                        </div>
                    )}

                    {/* Verification Footer */}
                    <div className="flex justify-between items-center text-slate-700 border-t border-white/10 pt-10 px-2 shrink-0">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                                <span className="text-[11px] uppercase-none tracking-widest">Market Oracle: Autonomous v3.0 | 10s Precision</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-3 h-3 text-emerald-400" />
                                <span className="text-[11px] font-mono tracking-tighter text-slate-600 overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]">NODE_VALUATION_REF: {pricing?.lastUpdate ? new Date(pricing.lastUpdate).toISOString() : 'BOOTING...'}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-slate-600">
                            <span className="text-[11px] font-mono">ENCRYPTED_ORACLE_FEED: ON</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                            <span className="text-[11px] font-mono">VALUATION_AUTO: ACTIVE</span>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
