import { NextApiRequest, NextApiResponse } from 'next';
import { Dataset } from '@/pages/api/dataset';

interface UpdateSettingsRequest {
    minDiscountAmount: number;
    minCancelAmount: number;
    minSaleAmount: number;
    userId: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }

    try {
        const instance = Dataset.getInstance();
        const settings = req.body as UpdateSettingsRequest;

        // Validate request body
        const validationError = validateSettings(settings);
        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError
            });
        }

        // Get tenant ID from referer
        const referer = req.headers.referer;
        const tenantId = referer ? new URL(referer).pathname.split('/')[1] : '';
        
        if (!tenantId) {
            return res.status(400).json({
                success: false,
                message: 'Tenant ID is missing'
            });
        }

        // Get user ID from session/token
        const userId = req.headers['x-user-id'];
        if (!userId || typeof userId !== 'string') {
            return res.status(401).json({
                success: false,
                message: 'User ID is missing from request headers'
            });
        }

        // Check and create columns if they don't exist
        await ensureColumnsExist(instance, req, tenantId);

        // Update user settings
        const result = await instance.executeQuery({
            query: `
                UPDATE efr_Users 
                SET MinDiscountAmount = @MinDiscountAmount,
                    MinCancelAmount = @MinCancelAmount,
                    MinSaleAmount = @MinSaleAmount
                OUTPUT INSERTED.UserID
                WHERE UserID = @UserID
            `,
            parameters: {
                MinDiscountAmount: settings.minDiscountAmount,
                MinCancelAmount: settings.minCancelAmount,
                MinSaleAmount: settings.minSaleAmount,
                UserID: userId
            },
            tenantId,
            req
        });

        if (!result?.[0]?.UserID) {
            return res.status(404).json({
                success: false,
                message: 'User not found or settings not updated'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Settings updated successfully',
            userId: result[0].UserID
        });

    } catch (error) {
        console.error('Error updating user settings:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating settings',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}

async function ensureColumnsExist(instance: Dataset, req: NextApiRequest, tenantId: string): Promise<void> {
    // First, check if columns exist
    const checkResult = await instance.executeQuery({
        query: `
            SELECT COUNT(*) as count
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = 'efr_Users'
            AND COLUMN_NAME IN ('MinDiscountAmount', 'MinCancelAmount', 'MinSaleAmount')
        `,
        parameters: {},
        tenantId,
        req
    });

    const existingColumnsCount = checkResult[0]?.count || 0;

    // If we don't have all three columns
    if (existingColumnsCount < 3) {
        // Add missing columns with a single transaction
        await instance.executeQuery({
            query: `
                BEGIN TRANSACTION;
                
                IF NOT EXISTS (
                    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_NAME = 'efr_Users' 
                    AND COLUMN_NAME = 'MinDiscountAmount'
                )
                BEGIN
                    ALTER TABLE efr_Users 
                    ADD MinDiscountAmount DECIMAL(18,2) 
                    CONSTRAINT DF_efr_Users_MinDiscountAmount DEFAULT 0;
                END

                IF NOT EXISTS (
                    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_NAME = 'efr_Users' 
                    AND COLUMN_NAME = 'MinCancelAmount'
                )
                BEGIN
                    ALTER TABLE efr_Users 
                    ADD MinCancelAmount DECIMAL(18,2) 
                    CONSTRAINT DF_efr_Users_MinCancelAmount DEFAULT 0;
                END

                IF NOT EXISTS (
                    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_NAME = 'efr_Users' 
                    AND COLUMN_NAME = 'MinSaleAmount'
                )
                BEGIN
                    ALTER TABLE efr_Users 
                    ADD MinSaleAmount DECIMAL(18,2) 
                    CONSTRAINT DF_efr_Users_MinSaleAmount DEFAULT 0;
                END

                COMMIT TRANSACTION;
            `,
            parameters: {},
            tenantId,
            req
        });
    }
}

function validateSettings(settings: UpdateSettingsRequest): string | null {
    if (!settings) {
        return 'Settings are required';
    }

    const requiredFields = ['minDiscountAmount', 'minCancelAmount', 'minSaleAmount'];
    
    for (const field of requiredFields) {
        const value = settings[field as keyof UpdateSettingsRequest];
        
        if (typeof value !== 'number') {
            return `${field} must be a number`;
        }
        
        if (value < 0) {
            return `${field} cannot be negative`;
        }
    }
    
    return null;
}