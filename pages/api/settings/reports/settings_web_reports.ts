import { NextApiRequest, NextApiResponse } from 'next';
import { Dataset } from '@/pages/api/dataset';
import { WebReport } from '@/types/tables';

interface QueryResult extends WebReport {
    GroupAutoID: number;
    GroupName?: string;
    GroupDisplayOrderID?: number;
    GroupSecurityLevel?: number;
    GroupIcon?: string;
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
  g.AutoID AS GroupAutoID,
  g.GroupName,
  g.DisplayOrderID AS GroupDisplayOrderID,
  g.SecurityLevel AS GroupSecurityLevel,
  g.Icon AS GroupIcon,
  i.AutoID,
  i.ReportID,
  i.GroupID,
  i.ReportName,
  i.ReportType,
  i.ShowDesktop,
  i.ShowMobile,
  i.DisplayOrderID,
  i.SecurityLevel,
  i.ReportQuery,
  i.ReportIcon 
FROM
  dm_infiniaWebReports i WITH (NOLOCK)
  INNER JOIN dm_infiniaWebReportGroups2 AS g WITH (NOLOCK) ON i.GroupID = g.AutoID 
ORDER BY
  g.DisplayOrderID,
  i.DisplayOrderID
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
