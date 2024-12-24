import { NextApiRequest, NextApiResponse } from 'next';
import { io } from 'socket.io-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { tenantId, userId, jobId, tabId } = req.query;

        // Tüm gerekli parametrelerin varlığını kontrol et
        if (!tenantId || !userId || !jobId || !tabId) {
            return res.status(400).json({
                message: 'Missing required parameters: tenantId, userId, jobId, and tabId are required'
            });
        }

        // Socket.IO sunucusuna bağlan
        const socket = io('/socket-io');

        // Bağlantı başarılı olduğunda
        socket.on('connect', () => {
            // Kullanıcıya özel mesajı gönder
            socket.emit('user-notification', {
                userId: userId,
                message: {
                    type: 'bigquery-response',
                    tenantId,
                    jobId,
                    tabId,
                    timestamp: new Date().toISOString()
                }
            });

            // Mesaj gönderildikten sonra bağlantıyı kapat
            socket.disconnect();
        });

        // Bağlantı hatası durumu
        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            socket.disconnect();
            return res.status(500).json({
                message: 'Failed to connect to socket server',
                error: error.message
            });
        });

        // Başarılı yanıt dön
        res.status(200).json({
            message: 'Notification sent successfully',
            data: {
                tenantId,
                userId,
                jobId,
                tabId
            }
        });

    } catch (error) {
        console.error('Error in bigquery-response handler:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
