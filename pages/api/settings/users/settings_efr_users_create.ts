import { NextApiRequest, NextApiResponse } from 'next';
import { Dataset } from '@/pages/api/dataset';
import { Efr_Users } from './types';
import { query } from 'mssql';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }

    try {
        const instance = Dataset.getInstance();
        const userData = req.body as Efr_Users;

        if (!userData) {
            return res.status(400).json({
                success: false,
                message: 'User data is required'
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

        if (!userData.UserName || !userData.UserPWD || !userData.Name || !userData.SurName) {
            return res.status(400).json({
                success: false,
                message: 'Username, Password, Name and Surname are required fields'
            });
        }

        let userBranches = new Set<string>();

        // Add directly selected branches if any
        if (userData.UserBranchs) {
            userData.UserBranchs.split(',').forEach(branch => userBranches.add(branch.trim()));
        }

        // If TagID is provided, add branches from tag
        if (userData.TagID) {
            const branchResult = await instance.executeQuery({
                query: `
                    SELECT
                        b.BranchID 
                    FROM
                        efr_Branchs AS b
                        INNER JOIN efr_BranchTags AS t ON b.BranchID = t.BranchID 
                    WHERE
                        t.TagID = @TagID
                `,
                parameters: { 
                    TagID: userData.TagID
                },
                tenantId,
                req
            });

            if (branchResult && branchResult.length > 0) {
                branchResult.forEach(branch => userBranches.add(branch.BranchID.toString()));
            }
        }

        // Convert Set back to comma-separated string
        const finalUserBranches = Array.from(userBranches).join(',');

        // Execute everything in a single transaction
        const result = await instance.executeQuery({
            query: `
                DECLARE @InsertedID INT;

                INSERT INTO efr_Users2(
                    [UserName], 
                    [EncryptedPass], 
                    [UserPWD], 
                    [Category], 
                    [UserBranchs], 
                    [DefaultCountry], 
                    [LanguageName], 
                    [HiddenReports], 
                    [DisableNotification], 
                    [DisableLangaugeEditor], 
                    [DisableMailSettings], 
                    [DisableBranchMessage], 
                    [DisableBranchControlForm], 
                    [DisableDashboardReport], 
                    [UserDevices], 
                    [LastLoginDatetime1], 
                    [LastLoginDatetime2], 
                    [LastActivityDatetime], 
                    [PasswordChangeDateTime], 
                    [IsActive], 
                    [Name], 
                    [SurName], 
                    [TaxNo], 
                    [PhoneCode], 
                    [PhoneNumber], 
                    [EMail], 
                    [SmsRequired],
                    [Locked],
                    [PwdCantChange],
                    [TicketUser],
                    [UserCode]
                ) VALUES (
                    @UserName,  
                    @EncryptedPass,  
                    @UserPWD,  
                    @Category,  
                    @UserBranchs,  
                    @DefaultCountry,  
                    @LanguageName,  
                    @HiddenReports,  
                    @DisableNotification,  
                    @DisableLangaugeEditor,  
                    @DisableMailSettings,  
                    @DisableBranchMessage,  
                    @DisableBranchControlForm,  
                    @DisableDashboardReport,  
                    @UserDevices,  
                    @LastLoginDatetime1,  
                    @LastLoginDatetime2,  
                    @LastActivityDatetime,  
                    @PasswordChangeDateTime,  
                    @IsActive,  
                    @Name,  
                    @SurName,  
                    @TaxNo,  
                    @PhoneCode,  
                    @PhoneNumber,  
                    @EMail,  
                    @SmsRequired,
                    @Locked,
                    @PwdCantChange,
                    @TicketUser,
                    @UserCode
                );

                SET @InsertedID = SCOPE_IDENTITY();
                
                SELECT @InsertedID as UserID;
            `,
            parameters: {
                UserName: userData.UserName,
                EncryptedPass: userData.EncryptedPass,
                UserPWD: userData.UserPWD, // Artık client'tan şifrelenmiş olarak geliyor
                Category: userData.Category,
                UserBranchs: finalUserBranches,
                DefaultCountry: userData.DefaultCountry || 'Türkiye',
                LanguageName: 'tr', // Default language
                HiddenReports: userData.HiddenReports || '',
                DisableNotification: userData.DisableNotification ? 1 : 0,
                DisableLangaugeEditor: userData.DisableLangaugeEditor ? 1 : 0,
                DisableMailSettings: userData.DisableMailSettings ? 1 : 0,
                DisableBranchMessage: userData.DisableBranchMessage ? 1 : 0,
                DisableBranchControlForm: userData.DisableBranchControlForm ? 1 : 0,
                DisableDashboardReport: userData.DisableDashboardReport ? 1 : 0,
                UserDevices: '',
                LastLoginDatetime1: null,
                LastLoginDatetime2: null,
                LastActivityDatetime: null,
                PasswordChangeDateTime: null,
                IsActive: userData.IsActive ? 1 : 0,
                Name: userData.Name,
                SurName: userData.SurName,
                TaxNo: userData.TaxNo || '',
                PhoneCode: userData.PhoneCode || '+90',
                PhoneNumber: userData.PhoneNumber || '',
                EMail: userData.EMail || '',
                SmsRequired: userData.SmsRequired ? 1 : 0,
                Locked: 0,
                PwdCantChange: userData.PwdCantChange ? 1 : 0,
                TicketUser: userData.TicketUser ? 1 : 0,
                UserCode: crypto.randomUUID(),
            },
            tenantId,
            req
        });

        if (!result?.[0]?.UserID) {
            console.error('Failed to get new user ID. Result:', result);
            return res.status(500).json({
                success: false,
                message: 'Failed to get new user ID',
                error: result
            });
        }

        return res.status(200).json({
            success: true,
            message: 'User created successfully',
            userId: result[0].UserID
        });

    } catch (error) {
        console.error('Error in user creation:', error);
        return res.status(500).json({
            success: false,
            message: 'Error creating user',
            error: error instanceof Error ? {
                message: error.message,
                stack: error.stack
            } : 'Unknown error'
        });
    }
}