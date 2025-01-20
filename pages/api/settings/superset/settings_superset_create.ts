import { NextApiRequest, NextApiResponse } from 'next';
import { Dataset } from '@/pages/api/dataset';
import { SupersetDashboard } from './types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
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
                message: 'Widget data is required'
            });
        }

        const referer = req.headers.referer;
        const tenantId = referer ? new URL(referer).pathname.split('/')[1] : '';


        if (!supersetData.DashboardID || !supersetData.Title) {
            return res.status(400).json({
                success: false,
                message: 'DashboardID and DashboardName are required'
            });
        }

        const result = await instance.executeQuery({
            query: `
                DECLARE @InsertedID INT;
                INSERT INTO dm_supersetDashboard (
                    DashboardID,
                    Title,
                    Standalone,
                    ExtraParams,
                    Icon
                ) VALUES (
                    @DashboardID,
                    @Title,
                    @Standalone,
                    @ExtraParams,
                    @Icon
                );

                SET @InsertedID = SCOPE_IDENTITY();
                SELECT @InsertedID as AutoID;
            `,
            parameters: {
                DashboardID: supersetData.DashboardID,
                Title: supersetData.Title,
                Standalone: supersetData.Standalone,
                ExtraParams: supersetData.ExtraParams,
                Icon: supersetData.Icon
            },
            tenantId,
            req
        });

        return res.status(200).json({
            success: true,
            message: 'Widget created successfully',
            autoId: result[0].AutoID
        });

    } catch (error) {
        console.error('Error in widget creation:', error);
        return res.status(500).json({
            success: false,
            message: 'Error creating widget',
            error: error instanceof Error ? {
                message: error.message,
                stack: error.stack
            } : 'Unknown error'
        });
    }
}