// pages/api/settings/users/settings_efr_users_update.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Dataset } from '@/pages/api/dataset';
import { Efr_Users } from './types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }

    try {
        const instance = Dataset.getInstance();
        const userData = req.body as Efr_Users;

        if (!userData || !userData.UserID) {
            return res.status(400).json({
                success: false,
                message: 'User data and UserID are required'
            });
        }

        const referer = req.headers.referer;
        const tenantId = referer ? new URL(referer).pathname.split('/')[1] : '';

        if (!tenantId) {
            return res.status(400).json({
                success: false,
                message: 'Tenant ID is missing'
            });
        }

        let userBranches = new Set<string>();
        if (userData.Category !== 5) { // Süper Admin değilse şubeleri ekle
            if (userData.UserBranchs) {
                userData.UserBranchs.split(',').forEach(branch => userBranches.add(branch.trim()));
            }

            if (userData.TagID) {
                const branchResult = await instance.executeQuery({
                    query: `
                        SELECT b.BranchID 
                        FROM efr_Branchs AS b
                        INNER JOIN efr_BranchTags AS t ON b.BranchID = t.BranchID 
                        WHERE t.TagID = @TagID
                    `,
                    parameters: { TagID: userData.TagID },
                    tenantId,
                    req
                });

                if (branchResult && branchResult.length > 0) {
                    branchResult.forEach(branch => userBranches.add(branch.BranchID.toString()));
                }
            }
        }

        const finalUserBranches = userData.Category === 5 ? "0" : Array.from(userBranches).join(',');

        const result = await instance.executeQuery({
            query: `
                UPDATE efr_Users2 SET
                    UserName = @UserName,
                    Category = @Category,
                    UserBranchs = @UserBranchs,
                    DefaultCountry = @DefaultCountry,
                    HiddenReports = @HiddenReports,
                    EncryptedPass = @EncryptedPass,
                    UserPWD = @UserPWD,
                    DisableNotification = @DisableNotification,
                    DisableLangaugeEditor = @DisableLangaugeEditor,
                    DisableMailSettings = @DisableMailSettings,
                    DisableBranchMessage = @DisableBranchMessage,
                    DisableBranchControlForm = @DisableBranchControlForm,
                    DisableDashboardReport = @DisableDashboardReport,
                    IsActive = @IsActive,
                    Name = @Name,
                    SurName = @SurName,
                    TaxNo = @TaxNo,
                    PhoneCode = @PhoneCode,
                    PhoneNumber = @PhoneNumber,
                    EMail = @EMail,
                    SmsRequired = @SmsRequired,
                    PwdCantChange = @PwdCantChange,
                    TicketUser = @TicketUser
                WHERE UserID = @UserID

                SELECT UserID FROM efr_Users2 WHERE UserID = @UserID;
            `,
            parameters: {
                UserID: userData.UserID,
                UserName: userData.UserName,
                Category: userData.Category,
                UserBranchs: finalUserBranches,
                DefaultCountry: userData.DefaultCountry || 'Türkiye',
                HiddenReports: userData.HiddenReports || '',
                EncryptedPass: userData.EncryptedPass || '',
                UserPWD: userData.UserPWD || '',
                DisableNotification: userData.DisableNotification ? 1 : 0,
                DisableLangaugeEditor: userData.DisableLangaugeEditor ? 1 : 0,
                DisableMailSettings: userData.DisableMailSettings ? 1 : 0,
                DisableBranchMessage: userData.DisableBranchMessage ? 1 : 0,
                DisableBranchControlForm: userData.DisableBranchControlForm ? 1 : 0,
                DisableDashboardReport: userData.DisableDashboardReport ? 1 : 0,
                IsActive: userData.IsActive ? 1 : 0,
                Name: userData.Name,
                SurName: userData.SurName,
                TaxNo: userData.TaxNo || '',
                PhoneCode: userData.PhoneCode || '+90',
                PhoneNumber: userData.PhoneNumber || '',
                EMail: userData.EMail || '',
                SmsRequired: userData.SmsRequired ? 1 : 0,
                PwdCantChange: userData.PwdCantChange ? 1 : 0,
                TicketUser: userData.TicketUser ? 1 : 0
            },
            tenantId,
            req
        });

        if (!result?.[0]?.UserID) {
            return res.status(500).json({
                success: false,
                message: 'Failed to update user'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'User updated successfully',
            userId: result[0].UserID
        });

    } catch (error) {
        console.error('Error in user update:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating user',
            error: error instanceof Error ? {
                message: error.message,
                stack: error.stack
            } : 'Unknown error'
        });
    }
}