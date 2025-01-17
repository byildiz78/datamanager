import { NextApiRequest, NextApiResponse } from 'next';
import { Dataset } from '@/pages/api/dataset';
import { Efr_Users } from '@/types/tables';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const query = `
            SELECT 
ef.UserID,
ef.UserCode,
ef.UserName,
ef.UserPWD,
  CASE ef.Category
  WHEN 1 THEN 'Standart'
  WHEN 2 THEN 'Çoklu Şube' 
  WHEN 3 THEN 'Bölge Sorumlusu' 
  WHEN 4 THEN 'Yönetici' 
  WHEN 5 THEN 'Süper Admin' 
  WHEN 6 THEN 'Op. Sorumlusu' 
  WHEN 7 THEN 'Müşteri Hizmetleri'
  WHEN 8 THEN 'İnsan Kaynakları' 
  WHEN 9 THEN 'İş Geliştirme' 
  WHEN 10 THEN 'IT' 
  WHEN 11 THEN 'Pazarlama' 
  WHEN 12 THEN 'Şube' 
  ELSE 'Bilinmiyor' END as Category,
ef.UserBranchs,
ef.DefaultCountry,
ef.LanguageName,
ef.DisableNotification,
ef.DisableLangaugeEditor,
ef.DisableMailSettings,
ef.DisableBranchMessage,
ef.DisableBranchControlForm,
ef.DisableDashboardReport,
ef.HiddenReports,
ef.UserDevices,
ef.LastLoginDatetime1,
ef.LastLoginDatetime2,
ef.LastActivityDatetime,
ef.PasswordChangeDateTime,
ef.IsActive,
CONCAT(ef.Name, ' ',ef.SurName) as Name,
ef.TaxNo,
ef.PhoneNumber,
ef.EMail,
ef.SmsRequired,
ef.SmsRequiredYedek,
ef.Locked,
ef.NewUser,
ef.EncryptedPass,
ef.PhoneCode,
ef.CalculatePoint,
ef.ReLogin,
ef.PwdCantChange,
ef.TicketCreate,
ef.TicketUser,
ef.ExpoToken,
ef.ExpoTokenUpdatedDate,
ef.ExpoTokenUpdatedAt,
ef.MinDiscountAmount,
ef.MinCancelAmount,
ef.MinSaleAmount
FROM 
efr_Users2 ef WITH (NOLOCK)
WHERE
ef.IsActive = 1
        `;
        const instance = Dataset.getInstance();

        const result = await instance.executeQuery<Efr_Users[]>({
            query,
            req
        });

        if (!result || result.length === 0) {
            return res.status(404).json({ error: 'No users found' });
        }

        return res.status(200).json(result);
    } catch (error: any) {
        console.error('Error in users handler:', error);
        return res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
}
