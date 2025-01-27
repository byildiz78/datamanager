import { NextApiRequest, NextApiResponse } from 'next';
import { Dataset } from '@/pages/api/dataset';
import { WebReport } from './types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }

    try {
        const instance = Dataset.getInstance();
        const reportData = req.body as WebReport;

        if (!reportData) {
            return res.status(400).json({
                success: false,
                message: 'Report data is required'
            });
        }

        const referer = req.headers.referer;
        const tenantId = referer ? new URL(referer).pathname.split('/')[1] : '';

        if (!tenantId) {
            return res.status(400).json({
                success: false,
                message: 'Tenant ID is missing'
            });
        }

        if (!reportData.ReportID) {
            return res.status(400).json({
                success: false,
                message: 'ReportID is required for update'
            });
        }

        const parameters = {
            AutoID: reportData.AutoID,
            ReportID: reportData.ReportID,
            GroupID: parseInt(reportData.GroupID as string) || 0,
            ReportName: reportData.ReportName,
            ReportType: reportData.ReportType || 2,
            ShowDesktop: reportData.ShowDesktop || 0,
            ShowMobile: reportData.ShowMobile || 0,
            DisplayOrderID: reportData.DisplayOrderID || 0,
            SecurityLevel: reportData.SecurityLevel || 0,
            ReportQuery: reportData.ReportQuery || '',
            ReportIcon: reportData.ReportIcon || '',
            QueryDayLimit: reportData.QueryDayLimit || 0
        };

        await instance.executeQuery({
            query: `
                UPDATE dm_infiniaWebReports 
                SET 
                    ReportID = @ReportID,
                    GroupID = @GroupID,
                    ReportName = @ReportName,
                    ReportType = @ReportType,
                    ShowDesktop = @ShowDesktop,
                    ShowMobile = @ShowMobile,
                    DisplayOrderID = @DisplayOrderID,
                    SecurityLevel = @SecurityLevel,
                    ReportQuery = @ReportQuery,
                    ReportIcon = @ReportIcon,
                    QueryDayLimit = @QueryDayLimit
                WHERE AutoID = @AutoID;
            `,
            parameters,
            tenantId,
            req
        });

        return res.status(200).json({
            success: true,
            message: 'Report updated successfully'
        });

    } catch (error) {
        console.error('Error in report update:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating report',
            error: error instanceof Error ? {
                message: error.message,
                stack: error.stack
            } : 'Unknown error'
        });
    }
}