import { NextApiRequest, NextApiResponse } from 'next';
import { Dataset } from '@/pages/api/dataset';
import { Efr_Branches } from './types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }

    try {
        const instance = Dataset.getInstance();
        const branchData: Efr_Branches = req.body;
        const referer = req.headers.referer;
        const tenantId = referer ? new URL(referer).pathname.split('/')[1] : '';
        const tagIds = branchData.TagIDs || [];

        // Validasyon kontrolü
        const validation = validateBranchData(branchData);
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: validation.message
            });
        }

        // Branch güncelle
        await instance.executeQuery({
            query: `
                UPDATE efr_Branchs
                SET 
                    BranchName = @BranchName,
                    CountryName = @CountryName,
                    CurrencyName = @CurrencyName,
                    ExternalCode = @ExternalCode,
                    LogoWarehouseCode = @LogoWarehouseCode,
                    IsActive = @IsActive,
                    BranchSquareMeter = @BranchSquareMeter,
                    OpeningTime = @OpeningTime,
                    ClosingTime = @ClosingTime,
                    CustomField1 = @CustomField1,
                    CustomField2 = @CustomField2,
                    CustomField3 = @CustomField3,
                    CustomField4 = @CustomField4,
                    CustomField5 = @CustomField5,
                    CustomField6 = @CustomField6,
                    CustomField7 = @CustomField7,
                    CustomField8 = @CustomField8,
                    CustomField9 = @CustomField9,
                    CustomField10 = @CustomField10,
                    CustomField11 = @CustomField11,
                    CustomField12 = @CustomField12,
                    CustomField13 = @CustomField13,
                    CustomField14 = @CustomField14,
                    CustomField15 = @CustomField15,
                    CustomField16 = @CustomField16,
                    NumberOfServicePersonnel = @NumberOfServicePersonnel,
                    Region = @Region,
                    ShowDashboard = @ShowDashboard,
                    CpmBranchID = @CpmBranchID,
                    OrderNumber = @OrderNumber,
                    OfficeID = @OfficeID,
                    BranchReportOrder = @BranchReportOrder,
                    ParentBranchID = @ParentBranchID,
                    WebMails = @WebMails,
                    InvestorMail = @InvestorMail,
                    BranchMenuCode = @BranchMenuCode,
                    RegionalDirectorMail = @RegionalDirectorMail,
                    RegionalManagerMail = @RegionalManagerMail
                WHERE BranchID = @BranchID
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
                RegionalManagerMail: branchData.RegionalManagerMail || null
            },
            tenantId,
            req
        });


        // Önce mevcut tag'leri sil
        await instance.executeQuery({
            query: `
                    DELETE FROM efr_BranchTags
                    WHERE BranchID = @BranchID
                `,
            parameters: {
                BranchID: branchData.BranchID
            },
            tenantId,
            req
        });

        // Yeni tag'leri ekle
        if (tagIds.length > 0) {
            const tagPromises = tagIds.map(tagId =>
                instance.executeQuery({
                    query: `
                        INSERT INTO efr_BranchTags (BranchID, TagID)
                        VALUES (@BranchID, @TagID)
                    `,
                    parameters: {
                        BranchID: branchData.BranchID,
                        TagID: tagId
                    },
                    tenantId,
                    req
                })
            );

            await Promise.all(tagPromises);
        }

        // Güncel tag'leri getir
        const updatedTags = await instance.executeQuery({
            query: `
                SELECT t.TagID, t.TagTitle
                FROM efr_BranchTags bt
                JOIN efr_Tags t ON bt.TagID = t.TagID
                WHERE bt.BranchID = @BranchID
            `,
            parameters: {
                BranchID: branchData.BranchID
            },
            tenantId,
            req
        });

        return res.status(200).json({
            success: true,
            message: 'Branch updated successfully',
            branchId: branchData.BranchID,
            tags: updatedTags
        });

    } catch (error) {
        console.error('Error in branch update:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating branch',
            error: error instanceof Error ? {
                message: error.message,
                stack: error.stack
            } : 'Unknown error'
        });
    }
}

// Validasyon fonksiyonu
const validateBranchData = (branchData: Efr_Branches) => {
    if (!branchData) {
        return {
            isValid: false,
            message: 'Branch data is required'
        };
    }

    // Zorunlu alan kontrolleri
    const requiredFields = {
        BranchID: 'Şube ID',
        BranchName: 'Şube Adı',
        CountryName: 'Ülke Adı',
        CurrencyName: 'Para Birimi'
    };

    const missingFields = Object.entries(requiredFields)
        .filter(([field]) => !branchData[field])
        .map(([, label]) => label);

    if (missingFields.length > 0) {
        return {
            isValid: false,
            message: `Lütfen zorunlu alanları doldurunuz: ${missingFields.join(', ')}`
        };
    }

    // BranchID 0 kontrolü
    if (branchData.BranchID == 0) {
        return {
            isValid: false,
            message: 'Şube ID değeri 0 olamaz'
        };
    }

    return { isValid: true };
};