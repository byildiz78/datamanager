import { NextApiRequest, NextApiResponse } from 'next';
import { Dataset } from '@/pages/api/dataset';
import { WebReport } from './types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
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

        if (!reportData.ReportID || !reportData.GroupID || !reportData.ReportName) {
            return res.status(400).json({
                success: false,
                message: 'ReportID, GroupID and ReportName are required'
            });
        }

        const result = await instance.executeQuery({
            query: `
                INSERT INTO dm_infiniaWebReports (
                    ReportID,
                    GroupID,
                    ReportName,
                    ReportType,
                    ShowDesktop,
                    ShowMobile,
                    DisplayOrderID,
                    SecurityLevel,
                    ReportQuery,
                    ReportIcon,
                    QueryDayLimit
                ) VALUES (
                    @ReportID,
                    @GroupID,
                    @ReportName,
                    @ReportType,
                    @ShowDesktop,
                    @ShowMobile,
                    @DisplayOrderID,
                    @SecurityLevel,
                    @ReportQuery,
                    @ReportIcon,
                    @QueryDayLimit
                );
            `,
            parameters: {
                ReportID: reportData.ReportID,
                GroupID: reportData.GroupID,
                ReportName: reportData.ReportName,
                ReportType: reportData.ReportType || 2, // Default to Liste tipi
                ShowDesktop: reportData.ShowDesktop || 0,
                ShowMobile: reportData.ShowMobile || 0,
                DisplayOrderID: reportData.DisplayOrderID || 0,
                SecurityLevel: reportData.SecurityLevel || 0,
                ReportQuery: reportData.ReportQuery || '',
                ReportIcon: reportData.ReportIcon || '',
                QueryDayLimit: reportData.QueryDayLimit || 0
            },
            tenantId,
            req
        });

        return res.status(200).json({
            success: true,
            message: 'Report created successfully'
        });

    } catch (error) {
        console.error('Error in report creation:', error);
        return res.status(500).json({
            success: false,
            message: 'Error creating report',
            error: error instanceof Error ? {
                message: error.message,
                stack: error.stack
            } : 'Unknown error'
        });
    }
}