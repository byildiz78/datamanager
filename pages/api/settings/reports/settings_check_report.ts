import { NextApiRequest, NextApiResponse } from 'next';
import { Dataset } from '@/pages/api/dataset';
import { formatInTimeZone } from 'date-fns-tz';
import { subDays } from 'date-fns';
import { decrypt } from '@/utils/encryption';
const timeZone = 'Europe/Istanbul';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { reportQuery } = req.body;

        if (!reportQuery) {
            return res.status(400).json({ 
                success: false,
                error: 'Missing report query' 
            });
        }

        // Decrypt the query
        let decodedQuery: string;
        try {
            decodedQuery = decrypt(reportQuery);
        } catch (error) {
            return res.status(400).json({
                success: false,
                error: 'Invalid query format',
                details: error.message
            });
        }

        const instance = Dataset.getInstance();
        const today = new Date();
        const yesterday = subDays(today, 1);
        const date1Formatted = formatInTimeZone(yesterday, timeZone, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        const date2Formatted = formatInTimeZone(today, timeZone, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        // Check if query contains parameters
        const hasDateParam1 = decodedQuery.includes('@date1');
        const hasDateParam2 = decodedQuery.includes('@date2');
        const hasBranchParam = decodedQuery.includes('@BranchID');
        // Only include parameters that are actually used in the query
        const parameters: Record<string, any> = {};
        if (hasDateParam1) parameters.date1 = date1Formatted;
        if (hasDateParam2) parameters.date2 = date2Formatted;
        if (hasBranchParam) parameters.BranchID = 999;

        const result = await instance.checkexecuteQuery<any>({
            query: decodedQuery,
            parameters,
            req
        });

        // Check if result is error response
        if (result?.error && result.error !== '') {
            return res.status(400).json({
                success: false,
                error: 'Query execution failed',
                details: result.error,
                data: result
            });
        }

        return res.status(200).json({ 
            success: true,
            message: 'Report query executed successfully',
            data: result
        });

    } catch (error: any) {
        console.error('Error in report check handler:', error);
        return res.status(500).json({ 
            success: false,
            error: 'Internal server error',
            details: error.message 
        });
    }
}
