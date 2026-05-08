import { NextApiRequest, NextApiResponse } from 'next';

// Mock WUID generator matching the format 100001-0426-01-AA
function generateWuid() {
    const prefix = "100001";
    const date = "0508"; // Current mock date
    const index = Math.floor(Math.random() * 99).toString().padStart(2, '0');
    const suffix = "INV";
    return `${prefix}-${date}-${index}-${suffix}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Role check (Mocked for now, assuming user is Owner)
    // const user = req.user;
    // if (user.role !== 'Owner') return res.status(403).json({ message: 'Forbidden' });

    const { slot, email } = req.body;

    if (!slot || !email) {
        return res.status(400).json({ message: 'Missing slot or email' });
    }

    try {
        const wuid = generateWuid();

        // Database logic would go here:
        // await db.affiliate.create({
        //     data: {
        //         type: slot.type,
        //         wuid,
        //         email,
        //         invitedBy: user.id,
        //         inviteSent: true,
        //     }
        // });

        // Email logic would go here:
        // await mailer.sendInvite(email, wuid);

        return res.status(200).json({ 
            success: true, 
            wuid,
            message: `Invitation successfully issued to ${email}` 
        });
    } catch (error) {
        console.error('Failed to create invite:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
