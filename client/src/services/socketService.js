import { io } from 'socket.io-client';

const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io(SERVER_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    this.socket.on('connect_error', (err) => {
      console.error('Socket connect_error:', err.message);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendMessage(content, room = 'general') {
    if (this.socket) {
      this.socket.emit('message:send', { content, room });
    }
  }

  sendTyping(isTyping, room = 'general') {
    if (this.socket) {
      this.socket.emit('message:typing', { isTyping, room });
    }
  }

  markRead(messageId, room = 'general') {
    if (this.socket) {
      this.socket.emit('message:read', { messageId, room });
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      if (callback) {
        this.socket.off(event, callback);
      } else {
        this.socket.off(event);
      }
    }
  }

  getSocket() {
    return this.socket;
  }
}

const socketService = new SocketService();
export default socketService;
