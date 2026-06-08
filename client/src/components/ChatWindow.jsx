import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { Trash2, Check, CheckCheck } from 'lucide-react';

import { 
  selectMessages, 
  selectTypingUsers, 
  deleteMessage, 
  fetchMessages,
  selectChatLoading,
  selectHasMore,
  selectPage
} from '../store/chatSlice';
import { selectCurrentUser } from '../store/authSlice';
import socketService from '../services/socketService';
import MessageInput from './MessageInput';

const ChatWindow = () => {
  const dispatch = useDispatch();
  const messages = useSelector(selectMessages);
  const typingUsers = useSelector(selectTypingUsers);
  const currentUser = useSelector(selectCurrentUser);
  const loading = useSelector(selectChatLoading);
  const hasMore = useSelector(selectHasMore);
  const page = useSelector(selectPage);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (shouldAutoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, shouldAutoScroll]);

  // Mark unread messages as read
  useEffect(() => {
    if (currentUser) {
      messages.forEach(msg => {
        if (msg.sender._id !== currentUser._id && (!msg.readBy || !msg.readBy.includes(currentUser._id))) {
          socketService.markRead(msg._id);
        }
      });
    }
  }, [messages, currentUser]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    
    // Check if at top to load more
    if (scrollTop === 0 && hasMore && !loading) {
      const prevScrollHeight = scrollHeight;
      dispatch(fetchMessages({ room: 'general', page: page + 1, limit: 30 })).then(() => {
        // Adjust scroll position to keep current view
        if (chatContainerRef.current) {
          const newScrollHeight = chatContainerRef.current.scrollHeight;
          chatContainerRef.current.scrollTop = newScrollHeight - prevScrollHeight;
        }
      });
    }

    // Check if near bottom to enable auto-scroll
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShouldAutoScroll(isNearBottom);
  };

  const handleDelete = (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      dispatch(deleteMessage(messageId));
    }
  };

  const typingDisplay = typingUsers.filter(u => u.userId !== currentUser?._id);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.roomName}># general</h2>
      </div>

      {/* Messages Area */}
      <div 
        style={styles.messagesContainer} 
        onScroll={handleScroll}
        ref={chatContainerRef}
      >
        {loading && <div style={styles.loadingWrapper}><div className="spinner"></div></div>}
        
        {messages.map((msg, index) => {
          const isOwn = msg.sender._id === currentUser?._id;
          const showAvatar = index === 0 || messages[index - 1].sender._id !== msg.sender._id;

          return (
            <div key={msg._id} style={{
              ...styles.messageWrapper,
              flexDirection: isOwn ? 'row-reverse' : 'row',
              alignSelf: isOwn ? 'flex-end' : 'flex-start'
            }}>
              {!isOwn && showAvatar ? (
                <div style={styles.avatar}>{msg.sender.username.charAt(0).toUpperCase()}</div>
              ) : (
                <div style={{ width: '40px' }}></div>
              )}

              <div style={{
                ...styles.messageBubble,
                backgroundColor: isOwn ? 'var(--accent-color)' : 'var(--surface-color)',
                alignItems: isOwn ? 'flex-end' : 'flex-start',
                borderBottomRightRadius: isOwn ? 0 : '12px',
                borderBottomLeftRadius: isOwn ? '12px' : 0,
              }}>
                {!isOwn && showAvatar && (
                  <span style={styles.senderName}>{msg.sender.username}</span>
                )}
                
                <p style={styles.content}>{msg.content}</p>
                
                <div style={styles.messageInfo}>
                  <span style={styles.time}>{format(new Date(msg.createdAt), 'HH:mm')}</span>
                  {isOwn && (
                    <span style={styles.readReceipt}>
                      {msg.readBy && msg.readBy.length > 0 ? (
                        <CheckCheck size={14} color="#a5b4fc" />
                      ) : (
                        <Check size={14} color="rgba(255,255,255,0.6)" />
                      )}
                    </span>
                  )}
                </div>

                {isOwn && (
                  <button 
                    className="delete-btn"
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(msg._id)}
                    title="Delete Message"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      {typingDisplay.length > 0 && (
        <div style={styles.typingIndicator}>
          {typingDisplay.length === 1 
            ? `${typingDisplay[0].username} is typing...`
            : `${typingDisplay.length} people are typing...`
          }
        </div>
      )}

      {/* Input Area */}
      <MessageInput />

      {/* Injected CSS for hover effect */}
      <style>{`
        .delete-btn { opacity: 0; }
        div:hover > .delete-btn { opacity: 1; }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    position: 'relative',
  },
  header: {
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid var(--border-color)',
    backgroundColor: 'var(--surface-color)',
  },
  roomName: {
    margin: 0,
    fontSize: '1.25rem',
    color: 'var(--text-primary)',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  loadingWrapper: {
    textAlign: 'center',
    padding: '1rem',
  },
  messageWrapper: {
    display: 'flex',
    gap: '0.75rem',
    maxWidth: '85%',
    alignSelf: 'flex-start',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'var(--surface-hover)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    color: 'var(--text-primary)',
    flexShrink: 0,
  },
  messageBubble: {
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    minWidth: '120px',
  },
  senderName: {
    fontSize: '0.75rem',
    fontWeight: 'bold',
    color: 'var(--text-secondary)',
    marginBottom: '0.25rem',
  },
  content: {
    margin: '0 0 0.5rem 0',
    fontSize: '0.95rem',
    lineHeight: '1.4',
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
  },
  messageInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    alignSelf: 'flex-end',
  },
  time: {
    fontSize: '0.65rem',
    opacity: 0.7,
  },
  readReceipt: {
    display: 'flex',
    alignItems: 'center',
  },
  deleteBtn: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    backgroundColor: 'var(--danger-color)',
    color: 'white',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    transition: 'opacity 0.2s',
  },
  typingIndicator: {
    padding: '0.5rem 1.5rem',
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    fontStyle: 'italic',
    position: 'absolute',
    bottom: '80px',
    left: 0,
  }
};

export default ChatWindow;
