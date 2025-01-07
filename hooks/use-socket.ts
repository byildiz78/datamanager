import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Cookies from 'js-cookie';
import { useParams } from 'next/navigation';

// JWT payload'ını decode etmek için basit bir fonksiyon
const decodeJWT = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('JWT decode error:', error);
        return null;
    }
};

interface TokenPayload {
    userId: string;
}

export const useSocket = () => {
    const [socket, setSocket] = useState<any>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const params = useParams();
    const tenantId = params.tenantId as string;

    useEffect(() => {
        const initializeSocket = () => {
            try {
                // Cookie'den token'ı al
                const token = Cookies.get(`${tenantId}_access_token`);
                
                if (!token) {
                    throw new Error('No access token found');
                }

                // Token'ın payload kısmını decode et
                const payload = decodeJWT(token) as TokenPayload;
                if (!payload?.userId) {
                    throw new Error('Invalid token payload');
                }

                setUserId(payload.userId);

                // Socket.IO bağlantısını oluştur
                const socketIo = io('http://localhost:2323', {
                    query: { tenantId },
                    auth: {
                        token
                    }
                });

                // Bağlantı olaylarını dinle
                socketIo.on('connect', () => {
                    console.log('Socket connected');
                    setIsConnected(true);
                    setError(null);
                    
                    // Kullanıcı login
                    socketIo.emit('user-login', payload.userId);
                });

                socketIo.on('login-success', (data) => {
                    console.log('Login successful:', data);
                });

                socketIo.on('connect_error', (err) => {
                    console.error('Connection error:', err);
                    setIsConnected(false);
                    setError('Connection failed');
                });

                socketIo.on('disconnect', () => {
                    console.log('Socket disconnected');
                    setIsConnected(false);
                });

                socketIo.on('bigquery-job-complete', (data) => {
                    console.log('BigQuery job completed:', data);
                });

                setSocket(socketIo);

                return () => {
                    socketIo.disconnect();
                };

            } catch (err) {
                console.error('Socket initialization error:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
                setIsConnected(false);
            }
        };

        if (tenantId) {
            initializeSocket();
        }

    }, [tenantId]);

    // Token yenileme durumunu dinle
    useEffect(() => {
        const handleTokenRefresh = () => {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
        };

        window.addEventListener('tokenRefresh', handleTokenRefresh);
        return () => {
            window.removeEventListener('tokenRefresh', handleTokenRefresh);
        };
    }, [socket]);

    const reconnect = () => {
        if (socket) {
            socket.disconnect();
            setSocket(null);
        }
    };

    return { 
        socket, 
        isConnected, 
        error,
        reconnect,
        userId 
    };
};
