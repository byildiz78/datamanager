import { NextApiRequest, NextApiResponse } from 'next';
import { Dataset } from '@/pages/api/dataset';
import { Efr_Tags } from './types';

interface QueryResult extends Efr_Tags {
    TagID: number;
    TagTitle: string;
    IsDefault: boolean;
    CurrencyName: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const instance = Dataset.getInstance();
        const listQuery = `
        SELECT
            ef.TagID,
            ef.TagTitle,
            ef.IsDefault,
            ef.CurrencyName
        FROM
            efr_Tags ef WITH (NOLOCK)
           `;

        const result = await instance.executeQuery<QueryResult[]>({
            query: listQuery,
            req
        });

        if (!result || result.length === 0) {
            return res.status(404).json({ error: 'No reports found' });
        }

        return res.status(200).json(result);
    } catch (error: any) {
        console.error('Error in web report handler:', error);
        return res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
}
