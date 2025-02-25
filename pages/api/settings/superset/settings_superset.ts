import { NextApiRequest, NextApiResponse } from 'next';
import { Dataset } from '@/pages/api/dataset';
import { SupersetDashboard } from './types';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const query = `
            SELECT
            AutoID,
            DashboardID,
            Title,
            Standalone,
            ExtraParams,
            Icon
            FROM dm_supersetDashboard WITH (NOLOCK)
        `;
        const instance = Dataset.getInstance();

        const result = await instance.executeQuery<SupersetDashboard[]>({
            query,
            req
        });

        if (!result || result.length === 0) {
            return res.status(404).json({ error: 'No widgets found' });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error('API error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}



