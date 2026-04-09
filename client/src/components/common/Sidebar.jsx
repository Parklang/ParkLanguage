import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import { getLevelTitle } from '../../utils/gameUtils';
import './Sidebar.css';

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const { progress } = useGame();
  const location = useLocation();

  const completedCount = progress.filter(p => p.status === 'completed').length;

  const navItems = [
    { path: '/dashboard', icon: '🏠', label: 'Trang chủ' },
    { path: '/lessons', icon: '📚', label: 'Bài học' },
    { path: '/vocabulary', icon: '📝', label: 'Từ vựng' },
    { path: '/leaderboard', icon: '🏆', label: 'Xếp hạng' },
    { path: '/profile', icon: '👤', label: 'Hồ sơ' },
  ];

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="sidebar-logo-icon">🌍</span>
            <span className="sidebar-logo-text">Park<span className="gradient-text">Language</span></span>
          </div>
        </div>

        {user && (
          <div className="sidebar-profile">
            <div className="sidebar-avatar">
              {user.username?.charAt(0).toUpperCase() || 'P'}
            </div>
            <div className="sidebar-user-info">
              <span className="sidebar-username">{user.username}</span>
              <span className="sidebar-level">Lv.{user.level} · {getLevelTitle(user.level)}</span>
            </div>
          </div>
        )}

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`}
              onClick={onClose}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span className="sidebar-link-label">{item.label}</span>
              {item.path === '/lessons' && (
                <span className="sidebar-link-badge">{completedCount}/{progress.length}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-stats">
            <div className="sidebar-stat">
              <span className="sidebar-stat-icon">🔥</span>
              <span className="sidebar-stat-value">{user?.currentStreak || 0}</span>
              <span className="sidebar-stat-label">Streak</span>
            </div>
            <div className="sidebar-stat">
              <span className="sidebar-stat-icon">⚡</span>
              <span className="sidebar-stat-value">{user?.totalXP || 0}</span>
              <span className="sidebar-stat-label">XP</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
