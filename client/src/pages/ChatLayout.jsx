import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken, selectCurrentUser } from '../store/authSlice';
import {
  addMessage,
  addNotification,
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  setTypingUser,
  removeTypingUser,
  removeMessage,
  updateMessageReadBy,
  fetchMessages,
} from '../store/chatSlice';
import { selectNotifPanelOpen } from '../store/uiSlice';
import socketService from '../services/socketService';

import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import NotificationPanel from '../components/NotificationPanel';

const ChatLayout = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const currentUser = useSelector(selectCurrentUser);
  const notifPanelOpen = useSelector(selectNotifPanelOpen);

  useEffect(() => {
    if (!token || !currentUser) return;

    // Connect socket
    socketService.connect(token);

    // Initial fetch of messages
    dispatch(fetchMessages({ room: 'general', page: 1, limit: 30 }));

    // Setup socket listeners
    socketService.on('message:received', (message) => {
      dispatch(addMessage(message));
    });

    socketService.on('notification:new', (notification) => {
      dispatch(addNotification(notification));
      // Show browser notification if permitted and tab not focused
      if (Notification.permission === 'granted' && document.hidden) {
        new Notification(`New message from ${notification.from}`, {
          body: notification.preview,
        });
      }
    });

    socketService.on('users:list', (users) => {
      dispatch(setOnlineUsers(users));
    });

    socketService.on('user:online', (user) => {
      dispatch(addOnlineUser(user));
    });

    socketService.on('user:offline', (user) => {
      dispatch(removeOnlineUser(user.userId));
    });

    socketService.on('message:typing', (data) => {
      if (data.isTyping) {
        dispatch(setTypingUser(data));
      } else {
        dispatch(removeTypingUser(data.userId));
      }
    });

    socketService.on('message:deleted', (data) => {
      dispatch(removeMessage(data.messageId));
    });

    socketService.on('message:read:update', (data) => {
      dispatch(updateMessageReadBy(data));
    });

    // Request Notification permission
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }

    return () => {
      // Cleanup
      socketService.disconnect();
    };
  }, [token, currentUser, dispatch]);

  return (
    <div className="app-container">
      <Sidebar />
      <main style={styles.mainContent}>
        <ChatWindow />
      </main>
      {notifPanelOpen && <NotificationPanel />}
    </div>
  );
};

const styles = {
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--bg-color)',
    position: 'relative',
    height: '100%',
  }
};

export default ChatLayout;
