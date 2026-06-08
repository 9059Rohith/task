const jwt = require('jsonwebtoken');
const Message = require('../models/Message');

const onlineUsers = new Map();

module.exports = function(io) {
  // Middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Unauthorized: No token provided'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // { userId, username }
      next();
    } catch (err) {
      return next(new Error('Unauthorized: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const { userId, username } = socket.user;

    // Join personal room and general room
    socket.join(userId);
    socket.join('general');

    // Track online user
    onlineUsers.set(userId, { socketId: socket.id, username });

    // Emit to all that this user is online
    io.emit('user:online', { userId, username, onlineAt: new Date() });

    // Send current online users to the newly connected socket
    const usersList = Array.from(onlineUsers.entries()).map(([id, data]) => ({
      userId: id,
      username: data.username
    }));
    socket.emit('users:list', usersList);

    // Handle new message
    socket.on('message:send', async (data) => {
      try {
        const { content, room = 'general' } = data;
        
        if (!content || content.trim().length === 0 || content.length > 1000) {
          return; // invalid content
        }

        const newMessage = new Message({
          sender: userId,
          content: content.trim(),
          room
        });
        
        await newMessage.save();
        const populatedMessage = await newMessage.populate('sender', 'username');

        // Broadcast to room
        io.to(room).emit('message:received', populatedMessage);

        // Notification logic: Emit to all online users EXCEPT sender
        socket.broadcast.emit('notification:new', {
          from: username,
          preview: content.slice(0, 50),
          messageId: populatedMessage._id,
          timestamp: populatedMessage.createdAt
        });

      } catch (err) {
        console.error('Socket message:send error:', err);
      }
    });

    // Handle typing indicator
    socket.on('message:typing', (data) => {
      const { isTyping, room = 'general' } = data;
      socket.broadcast.to(room).emit('message:typing', {
        userId,
        username,
        isTyping
      });
    });

    // Handle read receipt
    socket.on('message:read', async ({ messageId, room = 'general' }) => {
      try {
        const message = await Message.findById(messageId);
        if (message && !message.readBy.includes(userId)) {
          message.readBy.push(userId);
          await message.save();
          
          io.to(room).emit('message:read:update', {
            messageId,
            readBy: message.readBy
          });
        }
      } catch (err) {
        console.error('Socket message:read error:', err);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
      io.emit('user:offline', { userId, username, offlineAt: new Date() });
    });
  });
};
