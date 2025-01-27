import { NextApiRequest, NextApiResponse } from 'next';
import { Dataset } from '@/pages/api/dataset';
import { Efr_Tags } from './types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }

    try {
        const instance = Dataset.getInstance();
        const efr_TagsData = req.body as Efr_Tags;

        if (!efr_TagsData) {
            return res.status(400).json({
                success: false,
                message: 'Efr_Tags data is required'
            });
        }
        const referer = req.headers.referer;
        const tenantId = referer ? new URL(referer).pathname.split('/')[1] : '';

        if (!efr_TagsData.TagTitle) {
            return res.status(400).json({
                success: false,
                message: 'TagTitle is required'
            });
        }

        const result = await instance.executeQuery({
            query: `
                DECLARE @InsertedID INT;

                INSERT INTO efr_Tags (
                    TagTitle,
                    IsDefault,
                    CurrencyName
                ) VALUES (
                    @TagTitle,
                    @IsDefault,
                    @CurrencyName
                );

                SET @InsertedID = SCOPE_IDENTITY();
                SELECT @InsertedID as TagID;
            `,
            parameters: {
                TagTitle: efr_TagsData.TagTitle,
                IsDefault: efr_TagsData.IsDefault ? 1 : 0,
                CurrencyName: efr_TagsData.CurrencyName || ""
            },
            tenantId,
            req
        });

        return res.status(200).json({
            success: true,
            message: 'Tag created successfully',
            tagId: result[0].TagID
        });

    } catch (error) {
        console.error('Error in Tag creation:', error);
        return res.status(500).json({
            success: false,
            message: 'Error creating Tag',
            error: error instanceof Error ? {
                message: error.message,
                stack: error.stack
            } : 'Unknown error'
        });
    }
}