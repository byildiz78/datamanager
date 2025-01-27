import { NextApiRequest, NextApiResponse } from 'next';
import { Dataset } from '@/pages/api/dataset';
import { Ai } from './types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'   
        });
    }

    try {
        const instance = Dataset.getInstance();
        const aitData = req.body as Ai;

        if (!aitData) {
            return res.status(400).json({
                success: false,
                message: 'Widget data is required'
            });
        }

        const referer = req.headers.referer;
        const tenantId = referer ? new URL(referer).pathname.split('/')[1] : '';


        if (!aitData.ChatBotID || !aitData.ChatbotContent) {
            return res.status(400).json({
                success: false,
                message: 'DashboardID and DashboardName are required'
            });
        }

        const result = await instance.executeQuery({
            query: `
                DECLARE @InsertedID INT;
                INSERT INTO dm_ChatBot (
                ChatbotQuery,
                ChatbotRole,
                AnalysisTitle,
                Icon,
                ChatbotContent,
                ChatBotID,
                ChatbotQueryParams
                ) VALUES (
                    @ChatbotQuery,
                    @ChatbotRole,
                    @AnalysisTitle,
                    @Icon,
                    @ChatbotContent,
                    @ChatBotID,
                    @ChatbotQueryParams
                );

                SET @InsertedID = SCOPE_IDENTITY();
                SELECT @InsertedID as AutoID;
            `,
            parameters: {
                ChatbotQuery: aitData.ChatbotQuery,
                ChatbotRole: aitData.ChatbotRole,
                AnalysisTitle: aitData.AnalysisTitle,
                Icon: aitData.Icon,
                ChatbotContent: aitData.ChatbotContent,
                ChatBotID: aitData.ChatBotID,
                ChatbotQueryParams: aitData.ChatbotQueryParams,
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