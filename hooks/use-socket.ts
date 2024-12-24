import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { decodeJwt } from 'jose';
import Cookies from 'js-cookie';
import { useParams } from 'next/navigation';

export const useSocket = () => {
    const socketRef = useRef<Socket | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const params = useParams();
    const tenantId = params.tenantId as string;

    useEffect(() => {
        try {
            const token = Cookies.get(`${tenantId}_access_token`);
            if (!token) return;
            const payload = decodeJwt(token);
            setUserId(payload.userId as string);

        } catch (error) {
            console.error('Error decoding token:', error);
        }

        if (userId && !socketRef.current) {
            // Socket.IO sunucusuna bağlan
            socketRef.current = io('/socket-io');

            // Bağlantı kurulduğunda kullanıcı bilgisini gönder
            socketRef.current.on('connect', () => {
                socketRef.current?.emit('user-login', userId);
            });

            // Login başarılı olduğunda
            socketRef.current.on('login-success', (data) => {
                console.log('Socket login successful:', data);
            });

            // Özel mesajları dinle
            socketRef.current.on('private-message', (data) => {
                console.log('Received private message:', data);
                // Burada mesaj geldiğinde yapılacak işlemleri ekleyebilirsiniz
            });

            // Bildirimleri dinle
            socketRef.current.on('user-notification', (data) => {
                console.log('Received notification:', data);
                // Burada bildirim geldiğinde yapılacak işlemleri ekleyebilirsiniz
            });
        }

        // Cleanup function
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [tenantId]);

    return socketRef.current;
};
