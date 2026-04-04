import { NextResponse } from 'next/server';
import { simulationState } from '../../../../lib/simulationState';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    // Always return simulation data — backend is not reliably available
    const nodlr = simulationState.nodlrs.find((n: any) => n.id === id || n.protocolId === id);
    if (!nodlr) return NextResponse.json({ error: "Nodl'r not found" }, { status: 404 });
    
    return NextResponse.json({
        ...nodlr,
        integrityScore: 950,
        payoutFrequency: 'Weekly',
        accruedFounderBalance: nodlr.accruedFounderBalance || 0,
        role: nodlr.role || 'provider',
        fleetSummary: simulationState.nodls.filter((n: any) => n.userID === nodlr.id),
        affiliateTree: simulationState.affiliateReferrals.filter((r: any) => r.partnerId === nodlr.id),
        stripeVerification: nodlr.stripeVerification || 'verified'
    });
}
