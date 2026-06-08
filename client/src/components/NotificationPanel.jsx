import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectNotifications, clearNotifications, markNotificationRead } from '../store/chatSlice';
import { toggleNotifPanel } from '../store/uiSlice';
import { formatDistanceToNow } from 'date-fns';
import { X, CheckCircle, Trash2 } from 'lucide-react';

const NotificationPanel = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <h3 style={styles.title}>Notifications</h3>
        <div style={styles.actions}>
          {notifications.length > 0 && (
            <button 
              style={styles.clearBtn} 
              onClick={() => dispatch(clearNotifications())}
              title="Clear all"
            >
              <Trash2 size={16} />
            </button>
          )}
          <button style={styles.closeBtn} onClick={() => dispatch(toggleNotifPanel())}>
            <X size={20} />
          </button>
        </div>
      </div>

      <div style={styles.content}>
        {notifications.length === 0 ? (
          <div style={styles.empty}>
            <CheckCircle size={32} color="var(--success-color)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>You're all caught up!</p>
          </div>
        ) : (
          <div style={styles.list}>
            {notifications.map((notif, index) => (
              <div key={`${notif.messageId}-${index}`} style={styles.item}>
                <div style={styles.itemHeader}>
                  <span style={styles.from}>{notif.from}</span>
                  <span style={styles.time}>
                    {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                  </span>
                </div>
                <p style={styles.preview}>"{notif.preview}..."</p>
                <button 
                  style={styles.markReadBtn}
                  onClick={() => dispatch(markNotificationRead(notif.messageId))}
                >
                  Mark as read
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  panel: {
    width: '320px',
    backgroundColor: 'var(--surface-color)',
    borderLeft: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 10,
    boxShadow: '-5px 0 25px rgba(0,0,0,0.2)',
  },
  header: {
    padding: '1.25rem',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '1rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    margin: 0,
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  clearBtn: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    padding: '0.25rem',
  },
  closeBtn: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    padding: '0.25rem',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '1rem',
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: 'var(--text-secondary)',
    fontSize: '0.875rem',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  item: {
    padding: '1rem',
    backgroundColor: 'var(--surface-hover)',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  from: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: 'var(--accent-color)',
  },
  time: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
  },
  preview: {
    fontSize: '0.875rem',
    color: 'var(--text-primary)',
    margin: '0 0 0.75rem 0',
    fontStyle: 'italic',
  },
  markReadBtn: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    fontSize: '0.75rem',
    textDecoration: 'underline',
    padding: 0,
  }
};

export default NotificationPanel;
