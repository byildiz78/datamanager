import { NextApiRequest, NextApiResponse } from 'next';
import { Dataset } from '@/pages/api/dataset';
import { Efr_Branches } from '@/types/tables';
import { jwtVerify } from 'jose';
import { extractTenantId } from '@/lib/utils';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {

        const tenantId = extractTenantId(req.headers.referer);
        const ACCESS_TOKEN_SECRET = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);

        const cookies = req.headers.cookie?.split(';').reduce((acc: { [key: string]: string }, cookie) => {
            const [key, value] = cookie.trim().split('=');
            if (key && value) {
                acc[key.trim()] = decodeURIComponent(value.trim());
            }
            return acc;
        }, {}) || {};

        if (cookies) {
            const accessToken = cookies[`${tenantId}_access_token`];
            const decoded = await jwtVerify(
                accessToken,
                ACCESS_TOKEN_SECRET
            );

            // Token payload'ından branches'i al
            const userId = decoded.payload.userId?.toString();

            if (!userId) {
                return res.status(400).json({ error: 'No userId found in token' });
            }

            const query = `
            SELECT DISTINCT 
                b.*,
                STUFF((
                    SELECT ',' + ef2.TagTitle
                    FROM efr_BranchTags eb2 
                    LEFT JOIN efr_Tags ef2 ON ef2.TagID = eb2.TagID
                    WHERE eb2.BranchID = b.BranchID
                    FOR XML PATH('')
                ), 1, 1, '') AS TagTitles
            FROM Efr_Branchs b 
            LEFT JOIN efr_BranchTags eb WITH (NOLOCK) ON eb.BranchID = b.BranchID
            LEFT JOIN efr_Tags ef WITH (NOLOCK) ON ef.TagID = eb.TagID
            WHERE b.IsActive = 1 
            AND EXISTS (
                SELECT 1 
                FROM Efr_Users u 
                WHERE u.UserID = @userId
                AND u.IsActive = 1 
                AND (u.Category = 5 OR CHARINDEX(',' + CAST(b.BranchID AS VARCHAR) + ',', ',' + u.UserBranchs + ',') > 0))
            `;
            const instance = Dataset.getInstance();

            const result = await instance.executeQuery<Efr_Branches[]>({    
                query,
                parameters: {
                    userId
                },
                req
            });
            if (!result || result.length === 0) {
                return res.status(404).json({ error: 'No branches found for user' });
            }
            return res.status(200).json(result);

        }

        return res.status(400).json("");

    } catch (error: any) {
        console.error('Error in branches handler:', error);
        return res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
}
