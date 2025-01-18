import { NextApiRequest, NextApiResponse } from 'next';
import { Dataset } from '@/pages/api/dataset';
import { WebWidget } from './types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }

    try {
        const instance = Dataset.getInstance();
        const widgetData = req.body as WebWidget;

        if (!widgetData) {
            return res.status(400).json({
                success: false,
                message: 'Widget data is required'
            });
        }

        const referer = req.headers.referer;
        const tenantId = referer ? new URL(referer).pathname.split('/')[1] : '';

        if (!widgetData.ReportID || !widgetData.ReportName) {
            return res.status(400).json({
                success: false,
                message: 'ReportID and ReportName are required'
            });
        }

        const result = await instance.executeQuery({
            query: `
                UPDATE dm_webWidgets7
                SET 
                    ReportName = @ReportName,
                    ReportIndex = @ReportIndex,
                    ReportIcon = @ReportIcon,
                    V1Type = @V1Type,
                    V2Type = @V2Type,
                    V3Type = @V3Type,
                    V4Type = @V4Type,
                    V5Type = @V5Type,
                    V6Type = @V6Type,
                    ReportQuery = @ReportQuery,
                    ReportQuery2 = @ReportQuery2,
                    IsActive = @IsActive,
                    ReportColor = @ReportColor,
                    BranchDetail = @BranchDetail,
                    ReportType = @ReportType
                WHERE ReportID = @ReportID;
            `,
            parameters: {
                ReportID: widgetData.ReportID,
                ReportName: widgetData.ReportName,
                ReportIndex: widgetData.ReportIndex || 0,
                ReportIcon: widgetData.ReportIcon || '',
                V1Type: widgetData.V1Type || 0,
                V2Type: widgetData.V2Type || 0,
                V3Type: widgetData.V3Type || 0,
                V4Type: widgetData.V4Type || 0,
                V5Type: widgetData.V5Type || 0,
                V6Type: widgetData.V6Type || 0,
                ReportQuery: widgetData.ReportQuery || '',
                ReportQuery2: widgetData.ReportQuery2 || '',
                IsActive: widgetData.IsActive ? 1 : 0,
                ReportColor: widgetData.ReportColor || '',
                BranchDetail: widgetData.BranchDetail ? 1 : 0,
                ReportType: widgetData.ReportType || ''
            },
            tenantId,
            req
        });

        return res.status(200).json({
            success: true,
            message: 'Widget updated successfully'
        });

    } catch (error) {
        console.error('Error in widget update:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating widget',
            error: error instanceof Error ? {
                message: error.message,
                stack: error.stack
            } : 'Unknown error'
        });
    }
}