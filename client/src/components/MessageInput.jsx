import { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import socketService from '../services/socketService';

const MessageInput = () => {
  const [content, setContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  const maxLength = 1000;

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      socketService.sendTyping(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socketService.sendTyping(false);
    }, 1500);
  };

  const handleChange = (e) => {
    setContent(e.target.value);
    handleTyping();
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    const trimmed = content.trim();
    if (trimmed && trimmed.length <= maxLength) {
      socketService.sendMessage(trimmed);
      setContent('');
      
      // Stop typing immediately
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      setIsTyping(false);
      socketService.sendTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isOverLimit = content.length > maxLength;
  const isDisabled = !content.trim() || isOverLimit;

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputWrapper}>
          <textarea
            style={{
              ...styles.textarea,
              borderColor: isOverLimit ? 'var(--danger-color)' : 'var(--border-color)'
            }}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Shift+Enter for newline)"
            rows={1}
            maxLength={maxLength + 10} // allow typing over slightly to show error
          />
          <div style={styles.footer}>
            <span style={{
              ...styles.counter,
              color: isOverLimit ? 'var(--danger-color)' : 'var(--text-secondary)'
            }}>
              {content.length}/{maxLength}
            </span>
            <button 
              type="submit" 
              style={{
                ...styles.sendBtn,
                opacity: isDisabled ? 0.5 : 1,
                cursor: isDisabled ? 'not-allowed' : 'pointer'
              }}
              disabled={isDisabled}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: '1rem 1.5rem',
    backgroundColor: 'var(--surface-color)',
    borderTop: '1px solid var(--border-color)',
  },
  form: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  inputWrapper: {
    flex: 1,
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-end',
    backgroundColor: 'var(--bg-color)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '0.5rem',
    transition: 'border-color 0.2s',
  },
  textarea: {
    flex: 1,
    width: '100%',
    minHeight: '44px',
    maxHeight: '150px',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--text-primary)',
    resize: 'none',
    padding: '0.5rem',
    fontSize: '0.95rem',
    lineHeight: '1.4',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    paddingLeft: '0.5rem',
  },
  counter: {
    fontSize: '0.75rem',
  },
  sendBtn: {
    backgroundColor: 'var(--accent-color)',
    color: 'white',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  }
};

export default MessageInput;
