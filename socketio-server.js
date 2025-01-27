const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Kullanıcı ve tenant socket eşleşmelerini saklamak için Map'ler
const tenantSockets = new Map();
const userSockets = new Map();

// Connection event handler
io.on('connection', (socket) => {
    const tenantId = socket.handshake.query.tenantId;
    
    if (tenantId) {
        // Eğer bu tenant için bir array yoksa oluştur
        if (!tenantSockets.has(tenantId)) {
            tenantSockets.set(tenantId, new Set());
        }
        tenantSockets.get(tenantId).add(socket.id);
        socket.tenantId = tenantId;
    }

    // Handle user login
    socket.on('user-login', (userId) => {
        const userIdStr = userId.toString();
        userSockets.set(userIdStr, socket.id);
        console.log(`User ${userIdStr} connected with socket ${socket.id}`);
        // Debug için Map içeriğini göster
        console.log('Updated userSockets map:', Array.from(userSockets.entries()));
    });

    // BigQuery job tamamlandığında
    socket.on('bigquery-job-complete', (data) => {
        const { userId, message } = data;
        const targetSocketId = userSockets.get(userId.toString()); // userId'yi string'e çevir

        console.log('Received bigquery-job-complete for user:', userId);
        console.log('Target socket id:', targetSocketId);
        console.log('Current userSockets map:', userSockets);

        if (targetSocketId) {
            io.to(targetSocketId).emit('bigquery-job-complete', message);
            console.log(`Message sent to user ${userId} via socket ${targetSocketId}`);
        } else {
            console.log(`User ${userId} not found or not connected`);
        }
    });

    // Bağlantı koptuğunda
    socket.on('disconnect', () => {
        // Kullanıcıyı userSockets map'inden kaldır
        for (const [userId, socketId] of userSockets.entries()) {
            if (socketId === socket.id) {
                userSockets.delete(userId);
                console.log(`User ${userId} disconnected`);
                break;
            }
        }
    });

    // Debug: Log all events
    socket.onAny((eventName, ...args) => {
        console.log(`[Socket.IO Event] ${eventName}:`, args);
    });
});

httpServer.listen(process.env.SOCKETIO_SERVER_PORT || 2323, () => {
    console.log(`Socket.IO server running on port ${process.env.SOCKETIO_SERVER_PORT || 2323}`);
});
