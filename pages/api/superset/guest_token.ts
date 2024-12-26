import { Superset } from './superset';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const superset = Superset.getInstance();
        superset.setHeaders(req.headers as Headers);
        
        const dashboardId = req.query.dashboard_id as string;
        const forceRefresh = req.query.force_refresh === 'true';
        
        if (!dashboardId) {
            return res.status(400).json({ error: 'Dashboard ID is required' });
        }
        
        const guestToken = await superset.getGuestToken(dashboardId, forceRefresh);
        return res.json({ guest_token: guestToken });
    } catch (error) {
        console.error('Error in guest token route:', error);
        return res.status(500).json({ error: 'Failed to obtain guest token' });
    }
}
