import { NextApiRequest, NextApiResponse } from 'next';
import { Dataset } from '@/pages/api/dataset';
import { Ai } from './types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }

    try {
        const instance = Dataset.getInstance();
        const aiData = req.body as Ai;

        if (!aiData) {
            return res.status(400).json({
                success: false,
                message: 'Superset data is required'
            });
        }

        const referer = req.headers.referer;
        const tenantId = referer ? new URL(referer).pathname.split('/')[1] : '';

        if (!aiData.ChatBotID || !aiData.ChatbotContent || !aiData.AnalysisTitle) {
            return res.status(400).json({
                success: false,
                message: 'ChatBotID and ChatbotContent and AnalysisTitle are required'
            });
        }

        const result = await instance.executeQuery({
            query: `
                UPDATE dm_ChatBot
                SET 
                    ChatbotQuery = @ChatbotQuery,
                    ChatbotRole = @ChatbotRole,
                    AnalysisTitle = @AnalysisTitle,
                    Icon = @Icon,
                    ChatbotContent = @ChatbotContent,
                    ChatBotID = @ChatBotID,
                    ChatbotQueryParams = @ChatbotQueryParams
                WHERE AutoID = @AutoID;
            `,
            parameters: {
                AutoID: aiData.AutoID,
                ChatbotQuery: aiData.ChatbotQuery,
                ChatbotRole: aiData.ChatbotRole,
                AnalysisTitle: aiData.AnalysisTitle,
                Icon: aiData.Icon,
                ChatbotContent: aiData.ChatbotContent,
                ChatBotID: aiData.ChatBotID,
                ChatbotQueryParams: aiData.ChatbotQueryParams
            },
            tenantId,
            req
        });

        return res.status(200).json({
            success: true,
            message: 'ChatBot updated successfully'
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