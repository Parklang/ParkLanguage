import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getLevelFromXP } from '../../utils/gameUtils';
import './Navbar.css';

export default function Navbar({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const levelInfo = user ? getLevelFromXP(user.totalXP || 0) : null;
  const xpProgress = levelInfo ? (levelInfo.currentLevelXP / levelInfo.nextLevelXP) * 100 : 0;

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-left">
        <button className="navbar-menu-btn" onClick={onMenuToggle} aria-label="Toggle menu">
          <span className="navbar-menu-icon">☰</span>
        </button>
        {user && (
          <div className="navbar-xp-section">
            <div className="navbar-streak" title={`${user.currentStreak} ngày liên tiếp`}>
              <span className={`streak-fire ${user.currentStreak > 0 ? 'streak-fire--active' : ''}`}>
                🔥
              </span>
              <span className="streak-count">{user.currentStreak || 0}</span>
            </div>
            <div className="navbar-xp">
              <div className="navbar-xp-bar">
                <div className="navbar-xp-fill" style={{ width: `${Math.min(xpProgress, 100)}%` }} />
              </div>
              <span className="navbar-xp-text">
                ⚡ {user.totalXP || 0} XP
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="navbar-right">
        <button
          className="navbar-theme-btn btn-icon btn-secondary"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Chuyển sang sáng' : 'Chuyển sang tối'}
          id="theme-toggle"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {user && (
          <div className="navbar-user">
            <div className="navbar-level-badge" title={`Level ${user.level}`}>
              {user.level}
            </div>
            <button className="navbar-logout btn btn-sm btn-secondary" onClick={logout}>
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
