import { useDispatch, useSelector } from 'react-redux';
import { selectOnlineUsers, selectUnreadCount } from '../store/chatSlice';
import { selectCurrentUser, logout } from '../store/authSlice';
import { toggleNotifPanel, selectNotifPanelOpen } from '../store/uiSlice';
import { LogOut, Bell, MessageSquare } from 'lucide-react';

const Sidebar = () => {
  const dispatch = useDispatch();
  const onlineUsers = useSelector(selectOnlineUsers);
  const currentUser = useSelector(selectCurrentUser);
  const unreadCount = useSelector(selectUnreadCount);
  const notifPanelOpen = useSelector(selectNotifPanelOpen);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.header}>
        <div style={styles.logo}>
          <MessageSquare size={24} color="var(--accent-color)" />
          <h1 style={styles.title}>ChatApp</h1>
        </div>
        <button 
          style={styles.notifBtn} 
          onClick={() => dispatch(toggleNotifPanel())}
          title="Notifications"
        >
          <Bell size={20} color={notifPanelOpen ? 'var(--accent-color)' : 'var(--text-secondary)'} />
          {unreadCount > 0 && <span style={styles.badge}>{unreadCount}</span>}
        </button>
      </div>

      <div style={styles.usersList}>
        <h3 style={styles.sectionTitle}>Online Users</h3>
        {onlineUsers.length === 0 ? (
          <p style={styles.noUsers}>No one is online</p>
        ) : (
          onlineUsers.map(user => (
            <div key={user.userId} style={styles.userItem}>
              <div style={styles.avatar}>
                {user.username.charAt(0).toUpperCase()}
                <span style={styles.onlineDot}></span>
              </div>
              <span style={styles.username}>
                {user.username} {user.userId === currentUser?._id && '(You)'}
              </span>
            </div>
          ))
        )}
      </div>

      <div style={styles.footer}>
        <div style={styles.currentUserInfo}>
          <div style={{...styles.avatar, backgroundColor: 'var(--surface-hover)'}}>
            {currentUser?.username?.charAt(0).toUpperCase()}
          </div>
          <span style={styles.username}>{currentUser?.username}</span>
        </div>
        <button style={styles.logoutBtn} onClick={handleLogout} title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    width: '280px',
    backgroundColor: 'var(--surface-color)',
    borderRight: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  header: {
    padding: '1.5rem 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--border-color)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    margin: 0,
  },
  notifBtn: {
    background: 'transparent',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.5rem',
    borderRadius: '8px',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'var(--danger-color)',
    color: 'white',
    fontSize: '0.65rem',
    fontWeight: 'bold',
    borderRadius: '50%',
    minWidth: '16px',
    height: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 4px',
  },
  usersList: {
    flex: 1,
    padding: '1rem',
    overflowY: 'auto',
  },
  sectionTitle: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--text-secondary)',
    marginBottom: '1rem',
  },
  noUsers: {
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
    fontStyle: 'italic',
  },
  userItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.5rem 0',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent-color)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '500',
    fontSize: '0.875rem',
    position: 'relative',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '10px',
    height: '10px',
    backgroundColor: 'var(--success-color)',
    borderRadius: '50%',
    border: '2px solid var(--surface-color)',
  },
  username: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: 'var(--text-primary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  footer: {
    padding: '1rem',
    borderTop: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currentUserInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    overflow: 'hidden',
  },
  logoutBtn: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    padding: '0.5rem',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
};

export default Sidebar;
