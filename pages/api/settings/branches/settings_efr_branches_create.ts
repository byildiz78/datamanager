import { NextApiRequest, NextApiResponse } from 'next';
import { Dataset } from '@/pages/api/dataset';
import { Efr_Branches } from './types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }

    try {
        const instance = Dataset.getInstance();
        const branchData: Efr_Branches = req.body;
        const tagIds = branchData.TagIDs || [];

        if (!branchData) {
            return res.status(400).json({
                success: false,
                message: 'Branch data is required'
            });
        }

        // BranchID kontrolü
        const checkBranchResult = await instance.executeQuery({
            query: `
                SELECT BranchID 
                FROM efr_Branchs 
                WHERE BranchID = @BranchID
            `,
            parameters: {
                BranchID: branchData.BranchID
            },
            tenantId: req.headers.referer ? new URL(req.headers.referer).pathname.split('/')[1] : '',
            req
        });

        if (checkBranchResult && checkBranchResult.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Bu Şube ID (${branchData.BranchID}) zaten kullanılıyor. Lütfen başka bir ID giriniz.`
            });
        }

        const referer = req.headers.referer;
        const tenantId = referer ? new URL(referer).pathname.split('/')[1] : '';

        // İlk olarak branch insert et
        const result = await instance.executeQuery({
            query: `
                DECLARE @InsertedID INT = @BranchID;

                INSERT INTO efr_Branchs (
                    BranchID, BranchName, CountryName, CurrencyName, ExternalCode,
                    LogoWarehouseCode, IsActive, BranchSquareMeter, OpeningTime, ClosingTime,
                    CustomField1, CustomField2, CustomField3, CustomField4, CustomField5,
                    CustomField6, CustomField7, CustomField8, CustomField9, CustomField10,
                    CustomField11, CustomField12, CustomField13, CustomField14, CustomField15,
                    CustomField16, NumberOfServicePersonnel, Region, ShowDashboard,
                    CpmBranchID, OrderNumber, OfficeID, BranchReportOrder, ParentBranchID,
                    WebMails, InvestorMail, BranchMenuCode, RegionalDirectorMail, RegionalManagerMail
                ) VALUES (
                    @BranchID, @BranchName, @CountryName, @CurrencyName, @ExternalCode,
                    @LogoWarehouseCode, @IsActive, @BranchSquareMeter, @OpeningTime, @ClosingTime,
                    @CustomField1, @CustomField2, @CustomField3, @CustomField4, @CustomField5,
                    @CustomField6, @CustomField7, @CustomField8, @CustomField9, @CustomField10,
                    @CustomField11, @CustomField12, @CustomField13, @CustomField14, @CustomField15,
                    @CustomField16, @NumberOfServicePersonnel, @Region, @ShowDashboard,
                    @CpmBranchID, @OrderNumber, @OfficeID, @BranchReportOrder, @ParentBranchID,
                    @WebMails, @InvestorMail, @BranchMenuCode, @RegionalDirectorMail, @RegionalManagerMail
                );

                -- Eğer tag varsa insert et
                IF EXISTS (SELECT 1 FROM STRING_SPLIT(@TagIDs, ',') WHERE RTRIM(value) <> '')
                BEGIN
                    INSERT INTO efr_BranchTags (BranchID, TagID)
                    SELECT @InsertedID, CAST(value AS INT)
                    FROM STRING_SPLIT(@TagIDs, ',')
                    WHERE RTRIM(value) <> '';
                END

                SELECT @InsertedID as BranchID;
            `,
            parameters: {
                BranchID: branchData.BranchID,
                BranchName: branchData.BranchName,
                CountryName: branchData.CountryName,
                CurrencyName: branchData.CurrencyName,
                ExternalCode: branchData.ExternalCode,
                LogoWarehouseCode: branchData.LogoWarehouseCode,
                IsActive: branchData.IsActive ? 1 : 0,
                BranchSquareMeter: branchData.BranchSquareMeter ? parseInt(branchData.BranchSquareMeter.toString()) : null,
                OpeningTime: branchData.OpeningTime || null,
                ClosingTime: branchData.ClosingTime || null,
                CustomField1: branchData.CustomField1 || null,
                CustomField2: branchData.CustomField2 || null,
                CustomField3: branchData.CustomField3 || null,
                CustomField4: branchData.CustomField4 || null,
                CustomField5: branchData.CustomField5 || null,
                CustomField6: branchData.CustomField6 || null,
                CustomField7: branchData.CustomField7 || null,
                CustomField8: branchData.CustomField8 || null,
                CustomField9: branchData.CustomField9 || null,
                CustomField10: branchData.CustomField10 || null,
                CustomField11: branchData.CustomField11 || null,
                CustomField12: branchData.CustomField12 || null,
                CustomField13: branchData.CustomField13 || null,
                CustomField14: branchData.CustomField14 || null,
                CustomField15: branchData.CustomField15 || null,
                CustomField16: branchData.CustomField16 || null,
                NumberOfServicePersonnel: branchData.NumberOfServicePersonnel ? parseInt(branchData.NumberOfServicePersonnel.toString()) : null,
                Region: branchData.Region || null,
                ShowDashboard: branchData.ShowDashboard ? 1 : 0,
                CpmBranchID: branchData.CpmBranchID || null,
                OrderNumber: branchData.OrderNumber || null,
                OfficeID: branchData.OfficeID || null,
                BranchReportOrder: branchData.BranchReportOrder || null,
                ParentBranchID: branchData.ParentBranchID || null,
                WebMails: branchData.WebMails || null,
                InvestorMail: branchData.InvestorMail || null,
                BranchMenuCode: branchData.BranchMenuCode || null,
                RegionalDirectorMail: branchData.RegionalDirectorMail || null,
                RegionalManagerMail: branchData.RegionalManagerMail || null,
                TagIDs: tagIds.join(',')
            },
            tenantId,
            req
        });

        return res.status(200).json({
            success: true,
            message: 'Branch created successfully',
            branchId: result[0]?.BranchID || branchData.BranchID
        });

    } catch (error) {
        console.error('Error in branch creation:', error);
        return res.status(500).json({
            success: false,
            message: 'Error creating branch',
            error: error instanceof Error ? {
                message: error.message,
                stack: error.stack
            } : 'Unknown error'
        });
    }
}