import { NextApiRequest, NextApiResponse } from 'next';
import { io } from 'socket.io-client';

// Socket bağlantısını API handler dışında bir kere oluştur
const SOCKETIO_HOST = process.env.NEXT_PUBLIC_SOCKETIO_SERVER_HOST || 'http://localhost';
const SOCKETIO_PORT = process.env.NEXT_PUBLIC_SOCKETIO_SERVER_PORT || '2323';

// Singleton socket instance oluştur
let socket: any;

const initSocket = () => {
    if (!socket) {
        socket = io(`${SOCKETIO_HOST}:${SOCKETIO_PORT}`, {
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socket.on('connect', () => {
            console.log('Backend socket connected');
        });

        socket.on('connect_error', (error: any) => {
            console.error('Backend socket connection error:', error);
        });
    }
    return socket;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { tenantId, userId, jobId, tabId, reportId } = req.query;

        // Parametre kontrolü
        if (!tenantId || !userId || !jobId || !tabId || !reportId) {
            return res.status(400).json({
                message: 'Missing required parameters: tenantId, userId, jobId, tabId, and reportId are required'
            });
        }

        // Socket bağlantısını al veya oluştur
        const socketInstance = initSocket();

        // Promise wrapper ile emit işlemini bekletilebilir hale getir
        await new Promise((resolve, reject) => {
            socketInstance.emit('bigquery-job-complete', {
                userId: userId,
                message: {
                    type: 'bigquery-response',
                    tenantId,
                    reportId,
                    jobId,
                    tabId,
                    timestamp: new Date().toISOString()
                }
            }, (error: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(true);
                }
            });
        });

        res.status(200).json({
            success: true,
            message: 'Notification sent successfully',
            data: {
                tenantId,
                userId,
                reportId,
                jobId,
                tabId
            }
        });

    } catch (error) {
        console.error('Error in bigquery-response handler:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
