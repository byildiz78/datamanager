import { NextApiRequest, NextApiResponse } from 'next';
import { Dataset } from '@/pages/api/dataset';
import { WebWidget } from './types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
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

        console.log(widgetData);

        if (!widgetData.ReportID || !widgetData.ReportName) {
            return res.status(400).json({
                success: false,
                message: 'ReportID and ReportName are required'
            });
        }

        const result = await instance.executeQuery({
            query: `
                DECLARE @IsSuccess BIT = 0;
                DECLARE @Message NVARCHAR(200) = '';
                DECLARE @InsertedID INT = 0;

                IF NOT EXISTS (SELECT 1 FROM dm_webWidgets7 WHERE ReportID = @ReportID)
                BEGIN
                    INSERT INTO 
                    dm_webWidgets7 (
                    ReportID,
                    ReportName,
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
                    ReportType
                ) VALUES (
                    @ReportID,
                    @ReportName,
                    @ReportIndex,
                    @ReportIcon,
                    @V1Type,
                    @V2Type,
                    @V3Type,
                    @V4Type,
                    @V5Type,
                    @V6Type,
                    @ReportQuery,
                    @ReportQuery2,
                    @IsActive,
                    @ReportColor,
                    @BranchDetail,
                    @ReportType
                );

                SET @InsertedID = SCOPE_IDENTITY();
                SET @IsSuccess = 1;
                SET @Message = 'Rapor başarıyla oluşturuldu';
                END
                ELSE
                BEGIN
                    SET @Message = 'Bu widget ID''si zaten kullanılıyor';
                END

                SELECT @InsertedID as AutoID, @IsSuccess as IsSuccess, @Message as Message;
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
                ReportColor: widgetData.ReportColor || 'bg-primary dark:bg-primary/90',
                BranchDetail: widgetData.BranchDetail ? 1 : 0,
                ReportType: widgetData.ReportType || '0'
            },
            tenantId,
            req
        });

        if (!result?.[0]?.IsSuccess) {
            return res.status(400).json({
                success: false,
                message: result?.[0]?.Message || 'Widget oluşturulurken bir hata oluştu',
                error: 'DUPLICATE_REPORT_ID'
            });
        }

        return res.status(200).json({
            success: true,
            message: result[0].Message,
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