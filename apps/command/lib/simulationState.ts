// Single mutable simulation state for Phase 15
export const simulationState = {
    enabled: false,
    config: {
        simMode: true // Persistent simMode
    },
    nodlrs: [] as any[],
    nodls: [] as any[],
    customers: [] as any[],
    pricingTiers: [] as any[],
    ledgerTransactions: [] as any[],
    affiliatePartners: [] as any[],
    affiliateReferrals: [] as any[],
    organicRoutingCounter: 0 // For round-robin assignment to active founders
};

export const enableSimulation = () => {
    simulationState.enabled = true;
    simulationState.config.simMode = true;
};

export const disableSimulation = () => {
    simulationState.enabled = false;
    simulationState.config.simMode = false;
};

// Strict Universal ID Generator: <6-DIGIT>-<MMYY>-<NETWORK>-<SUFFIX>[-<NODL-SEQ>]
export const generateUniversalId = (nodlrId: number, founderNetworkId: string, suffix: string = 'AA', nodlSequence?: number) => {
    const mm = '04'; // April
    const yy = '26'; // 2026
    const base = `${nodlrId.toString().padStart(6, '0')}-${mm}${yy}-${founderNetworkId.padStart(2, '0')}-${suffix}`;
    if (nodlSequence !== undefined) {
        return `${base}-${nodlSequence.toString().padStart(7, '0')}`;
    }
    return base;
};

export const resetSimulation = () => {
    simulationState.pricingTiers = [
        { id: 'standard', name: 'Standard Compute', cpu_cores: 4, ram_gb: 16, gpu_model: 'N/A', rate_th_sec: 0.0012, description: 'General purpose workloads for edge nodes.' },
        { id: 'boost', name: 'Boost Compute', cpu_cores: 8, ram_gb: 32, gpu_model: 'N/A', rate_th_sec: 0.0035, description: 'Enhanced compute for distributed tasks.' },
        { id: 'ultra', name: 'Ultra Compute', cpu_cores: 16, ram_gb: 64, gpu_model: 'High-End CPU Cluster', rate_th_sec: 0.0072, description: 'High-performance CPU-bound processing.' },
        { id: 'decc', name: 'DECC Protected', cpu_cores: 8, ram_gb: 32, gpu_model: 'Encrypted Enclave', rate_th_sec: 0.0110, description: 'Secure, confidential compute environments.' },
        { id: 'gpu-pro', name: 'GPU Pro', cpu_cores: 16, ram_gb: 48, gpu_model: 'NVIDIA RTX 4080', rate_th_sec: 0.0185, description: 'Mid-range GPU acceleration for rendering.' },
        { id: 'gpu-max', name: 'GPU Max', cpu_cores: 32, ram_gb: 128, gpu_model: 'NVIDIA A100 / H100', rate_th_sec: 0.0450, description: 'Top-tier AI and LLM training capacity.' }
    ];

    simulationState.ledgerTransactions = [
        { id: 'TX-88210', jobId: 'JOB-990', type: 'credit', status: 'completed', amount: 12000, fee: 1200, timestamp: new Date(Date.now() - 3600000).toISOString(), entity_name: 'CloudMesh Corp', entity_id: 'C-1' },
        { id: 'TX-88211', jobId: 'JOB-441', type: 'payout', status: 'paid', amount: 5000, fee: 500, timestamp: new Date(Date.now() - 7200000).toISOString(), entity_name: 'Alpha Node Runner', entity_id: 'NR-A' },
    ];

    // Initialize 10 Founders (5 Active, 5 Dormant)
    const founders = [
        { id: '100001-0426-01-AA', name: 'Stephen Soos', email: 'stephen@nodl.one', region: 'North America', status: 'active', crmRights: 'full', onboardingBypass: true, balance: 250000 },
        { id: '100002-0426-02-AA', name: 'Eldesskar', email: 'eldesskar@protocol.nodl', region: 'Northern Europe', status: 'active', crmRights: 'none', onboardingBypass: true, balance: 125000 },
        { id: '100003-0426-03-AA', name: 'Ava Chen', email: 'ava@nodl.one', region: 'Asia Pacific', status: 'active', crmRights: 'none', onboardingBypass: true, balance: 85000 },
        { id: '100004-0426-04-AA', name: 'Marcus Thorne', email: 'marcus@nodl.one', region: 'Western Europe', status: 'active', crmRights: 'none', onboardingBypass: true, balance: 92000 },
        { id: '100005-0426-05-AA', name: 'Yara Hassan', email: 'yara@nodl.one', region: 'Middle East', status: 'active', crmRights: 'none', onboardingBypass: true, balance: 77000 },
        { id: '100006-0426-06-AA', name: 'Founder 06', email: 'f06@nodl.one', region: 'Global', status: 'dormant', crmRights: 'none', onboardingBypass: true, balance: 0 },
        { id: '100007-0426-07-AA', name: 'Founder 07', email: 'f07@nodl.one', region: 'Global', status: 'dormant', crmRights: 'none', onboardingBypass: true, balance: 0 },
        { id: '100008-0426-08-AA', name: 'Founder 08', email: 'f08@nodl.one', region: 'Global', status: 'dormant', crmRights: 'none', onboardingBypass: true, balance: 0 },
        { id: '100009-0426-09-AA', name: 'Founder 09', email: 'f09@nodl.one', region: 'Global', status: 'dormant', crmRights: 'none', onboardingBypass: true, balance: 0 },
        { id: '100010-0426-10-AA', name: 'Founder 10', email: 'f10@nodl.one', region: 'Global', status: 'dormant', crmRights: 'none', onboardingBypass: true, balance: 0 },
    ];

    simulationState.nodlrs = founders.map((f, i) => ({
        id: f.id,
        protocolId: f.id,
        name: f.name,
        displayName: f.name,
        email: f.email,
        region: f.region,
        status: f.status,
        accountHealth: f.status === 'active' ? 'Optimal' : 'Dormant',
        nodeCount: f.id === '100001-0426-01-AA' ? 3 : 0,
        accruedFounderBalance: f.balance,
        stability: f.status === 'active' ? 100.0 : 0.0,
        stripeVerification: 'verified',
        isFounder: true,
        founderNetworkId: (i + 1).toString().padStart(2, '0'),
        nodlSequence: 1000000 + i,
        role: i === 0 ? 'owner' : 'manager',
        crmRights: f.crmRights,
        onboardingBypass: f.onboardingBypass,
        createdAt: new Date(2025, 0, 15 + i).toISOString(),
        metadata: { region: f.region, tier: 'FOUNDER' },
        contactInfo: { phone: f.id === '100001-0426-01-AA' ? '+1-555-0101' : 'N/A', telegram: `@${f.name.toLowerCase().replace(' ', '')}` }
    }));

    // Add Alpha Runner
    const alphaRunnerId = generateUniversalId(100201, '01', 'AA');
    simulationState.nodlrs.push({
        id: alphaRunnerId,
        protocolId: alphaRunnerId,
        name: 'Alpha Node Runner',
        displayName: 'Alpha Node Runner',
        email: 'alpha@runner.io',
        region: 'Western Europe',
        status: 'active',
        accountHealth: 'Stable',
        nodeCount: 1,
        accruedFounderBalance: 4500,
        stability: 97.4,
        stripeVerification: 'verified',
        isFounder: false,
        founderNetworkId: '01',
        nodlSequence: 1000000,
        role: 'provider',
        crmRights: 'none',
        onboardingBypass: false,
        createdAt: new Date(2026, 2, 10).toISOString(),
        metadata: { region: 'Western Europe', tier: 'CORE' },
        contactInfo: { phone: '+44-20-7946-0958', telegram: '@alpharunner' }
    });

    simulationState.nodls = [
        { 
            node_id: 'N-1001', 
            userID: '100001-0426-01-AA', 
            status: 'active', 
            tier: 'Ultra', 
            cpuCores: 16, 
            memoryGB: 64, 
            gpuModel: 'RTX 4090', 
            lastHeartbeat: new Date().toISOString(),
            protocolId: generateUniversalId(100001, '01', 'AA', 1000000)
        },
        { 
            node_id: 'N-1002', 
            userID: '100001-0426-01-AA', 
            status: 'active', 
            tier: 'Standard', 
            cpuCores: 4, 
            memoryGB: 16, 
            gpuModel: null, 
            lastHeartbeat: new Date().toISOString(),
            protocolId: generateUniversalId(100001, '01', 'AA', 1000001)
        },
        { 
            node_id: 'N-1003', 
            userID: alphaRunnerId, 
            status: 'active', 
            tier: 'Standard', 
            cpuCores: 4, 
            memoryGB: 8, 
            gpuModel: null, 
            lastHeartbeat: new Date().toISOString(),
            protocolId: generateUniversalId(100201, '01', 'AA', 1000000)
        }
    ];

    simulationState.affiliatePartners = simulationState.nodlrs.map(nodlr => ({
        id: nodlr.protocolId,
        name: nodlr.name,
        email: nodlr.email,
        isFounder: nodlr.isFounder,
        founderStatus: nodlr.status,
        status: nodlr.status,
        referralCode: nodlr.name.split(' ')[0].toUpperCase() + '-' + nodlr.founderNetworkId,
        walletAddress: '0x' + nodlr.protocolId.replace(/-/g, '').slice(0, 10),
        commission: { l1: 2.0, l2: 6.0, infinity: nodlr.isFounder ? 3.0 : 0.0 },
        earnings: { 
            totalEarned: (nodlr.accruedFounderBalance || 0) * 10, 
            pendingPayout: (nodlr.accruedFounderBalance || 0), 
            paidOut: (nodlr.accruedFounderBalance || 0) * 9, 
            nextPayoutDate: new Date(Date.now() + 86400000 * 7).toISOString() 
        },
        nodlSequence: 1000000,
        ...nodlr // Merge CRM fields
    }));

    simulationState.affiliateReferrals = [
        { id: 'REF-001', partnerId: '100001-0426-01-AA', referredUserId: alphaRunnerId, timestamp: new Date(Date.now() - 86400000 * 5).toISOString(), level: 'L1', revenueGenerated: 125000, founderNetworkId: '01' }
    ];
};

export const flushSimulation = () => {
    simulationState.nodlrs = [];
    simulationState.nodls = [];
    simulationState.customers = [];
};

// Initialize with default data
resetSimulation();
