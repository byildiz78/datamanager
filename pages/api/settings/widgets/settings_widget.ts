import { NextApiRequest, NextApiResponse } from 'next';
import { Dataset } from '@/pages/api/dataset';
import { WebWidget } from '@/types/tables';

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
            ReportName,
            ReportID,
            ReportIndex,
            ReportIcon,
            V1Type,
            V2Type,
            V3Type,
            V4Type,
            V5Type,
            V6Type,
            ReportQuery,
            ReportQuery2,
            IsActive,
            ReportColor,
            BranchDetail,
            ReportType,
            AutoID
            FROM dm_webWidgets7 
            WHERE IsActive = 1 
            ORDER BY ReportIndex ASC
        `;
        const instance = Dataset.getInstance();

        const result = await instance.executeQuery<WebWidget[]>({
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



