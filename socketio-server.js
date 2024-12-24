const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Allow all origins in development
        methods: ["GET", "POST"]
    }
});

// Store user socket mappings
const userSockets = new Map();

// Connection event handler
io.on('connection', (socket) => {
    console.log('A client connected:', socket.id);

    // Handle user login
    socket.on('user-login', (userId) => {
        userSockets.set(userId, socket.id);
        console.log(`User ${userId} logged in with socket: ${socket.id}`);
        
        // Send any pending messages for this user
        socket.emit('login-success', { userId });
    });

    // Handle client disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        // Remove user from mapping
        for (const [userId, socketId] of userSockets.entries()) {
            if (socketId === socket.id) {
                userSockets.delete(userId);
                break;
            }
        }
    });

    // Handle private messages
    socket.on('private-message', ({ targetUserId, message }) => {
        const targetSocketId = userSockets.get(targetUserId);
        if (targetSocketId) {
            // Find sender's userId
            let senderId;
            for (const [userId, socketId] of userSockets.entries()) {
                if (socketId === socket.id) {
                    senderId = userId;
                    break;
                }
            }
            
            // Send message only to the target user
            io.to(targetSocketId).emit('private-message', {
                senderId,
                message,
                timestamp: new Date().toISOString()
            });
        }
    });

    // Handle user-specific notifications or messages
    socket.on('user-notification', ({ userId, message }) => {
        const targetSocketId = userSockets.get(userId);
        if (targetSocketId) {
            io.to(targetSocketId).emit('user-notification', {
                message,
                timestamp: new Date().toISOString()
            });
        }
    });
});

const PORT = process.env.SocketIO_PORT || 2323;

httpServer.listen(PORT, () => {
    console.log(`Socket.IO server is running on port ${PORT}`);
});
