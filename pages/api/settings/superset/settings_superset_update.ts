import { NextApiRequest, NextApiResponse } from 'next';
import { Dataset } from '@/pages/api/dataset';
import { SupersetDashboard } from './types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }

    try {
        const instance = Dataset.getInstance();
        const supersetData = req.body as SupersetDashboard;

        if (!supersetData) {
            return res.status(400).json({
                success: false,
                message: 'Superset data is required'
            });
        }

        const referer = req.headers.referer;
        const tenantId = referer ? new URL(referer).pathname.split('/')[1] : '';

        if (!supersetData.DashboardID || !supersetData.Title) {
            return res.status(400).json({
                success: false,
                message: 'DashboardID and Title are required'
            });
        }

        const result = await instance.executeQuery({
            query: `
                UPDATE dm_supersetDashboard
                SET 
                    DashboardID = @DashboardID,
                    Title = @Title,
                    Standalone = @Standalone,
                    ExtraParams = @ExtraParams,
                    Icon = @Icon
                WHERE AutoID = @AutoID;
            `,
            parameters: {
                AutoID: supersetData.AutoID,
                DashboardID: supersetData.DashboardID,
                Title: supersetData.Title,
                Standalone: supersetData.Standalone,
                ExtraParams: supersetData.ExtraParams,
                Icon: supersetData.Icon,
            },
            tenantId,
            req
        });

        return res.status(200).json({
            success: true,
            message: 'Superset dashboard updated successfully'
        });

    } catch (error) {
        console.error('Error in superset dashboard update:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating superset dashboard',
            error: error instanceof Error ? {
                message: error.message,
                stack: error.stack
            } : 'Unknown error'
        });
    }
}