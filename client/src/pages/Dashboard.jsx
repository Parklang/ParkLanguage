import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { getLevelFromXP, getLevelTitle, achievementsList } from '../utils/gameUtils';
import api from '../utils/api';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const { progress, updateStreak, achievements } = useGame();
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    updateStreak();
    
    // Fetch all lessons mapped to progress
    const fetchLessons = async () => {
      try {
        const { data } = await api.get('/lessons');
        setLessons(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchLessons();
  }, [updateStreak]);

  const levelInfo = getLevelFromXP(user?.totalXP || 0);
  const xpProgress = (levelInfo.currentLevelXP / levelInfo.nextLevelXP) * 100;
  const dailyGoal = user?.settings?.dailyGoal || 50;
  const dailyProgress = Math.min(((user?.dailyXP || 0) / dailyGoal) * 100, 100);

  const currentLesson = lessons.find(l => {
    const p = progress.find(pr => (pr.lessonId._id === l._id) || (pr.lessonId === l._id));
    return p && (p.status === 'in-progress' || p.status === 'available');
  });

  const completedCount = progress.filter(p => p.status === 'completed').length;
  const unlockedAchievements = achievements.map(id => achievementsList.find(a => a.id === id)).filter(Boolean);

  return (
    <div className="dashboard" id="dashboard-page">
      {/* Welcome Header */}
      <div className="dashboard-welcome animate-fadeIn">
        <div className="dashboard-welcome-text">
          <h1 className="page-title">
            Xin chào, <span className="gradient-text">{user?.username || 'Learner'}</span>! 👋
          </h1>
          <p className="page-subtitle">Tiếp tục hành trình học Tiếng Anh của bạn</p>
        </div>
        <div className="dashboard-level-card glass-card">
          <div className="level-info">
            <span className="level-number">Lv.{user?.level || 1}</span>
            <span className="level-title">{getLevelTitle(user?.level || 1)}</span>
          </div>
          <div className="level-progress">
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${xpProgress}%` }} />
            </div>
            <span className="level-xp-text">{levelInfo.currentLevelXP} / {levelInfo.nextLevelXP} XP</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-stats animate-fadeInUp stagger-1">
        <div className="stat-card glass-card">
          <div className="stat-icon-wrapper stat-icon--streak">🔥</div>
          <div className="stat-details">
            <span className="stat-value">{user?.currentStreak || 0}</span>
            <span className="stat-label">Ngày Streak</span>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon-wrapper stat-icon--xp">⚡</div>
          <div className="stat-details">
            <span className="stat-value">{user?.totalXP || 0}</span>
            <span className="stat-label">Tổng XP</span>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon-wrapper stat-icon--lessons">📚</div>
          <div className="stat-details">
            <span className="stat-value">{completedCount}</span>
            <span className="stat-label">Bài đã học</span>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon-wrapper stat-icon--words">💎</div>
          <div className="stat-details">
            <span className="stat-value">{user?.wordsLearned || 0}</span>
            <span className="stat-label">Từ đã học</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Daily Goal */}
        <div className="dashboard-daily glass-card animate-fadeInUp stagger-2">
          <div className="daily-header">
            <h3>🎯 Mục tiêu hôm nay</h3>
            <span className="daily-goal-text">{user?.dailyXP || 0} / {dailyGoal} XP</span>
          </div>
          <div className="daily-progress-ring-container">
            <svg className="daily-ring" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="var(--bg-tertiary)" strokeWidth="8" />
              <circle
                cx="60" cy="60" r="50" fill="none"
                stroke="url(#dailyGrad)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${dailyProgress * 3.14} 314`}
                transform="rotate(-90 60 60)"
                style={{ transition: 'stroke-dasharray 1s ease' }}
              />
              <defs>
                <linearGradient id="dailyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--primary)" />
                  <stop offset="100%" stopColor="var(--secondary)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="daily-ring-text">
              <span className="daily-ring-percent">{Math.round(dailyProgress)}%</span>
              <span className="daily-ring-label">hoàn thành</span>
            </div>
          </div>
          {dailyProgress >= 100 && (
            <p className="daily-complete-text">🎉 Hoàn thành mục tiêu hôm nay!</p>
          )}
        </div>

        {/* Continue Learning */}
        <div className="dashboard-continue glass-card animate-fadeInUp stagger-3">
          <h3>📖 Tiếp tục học</h3>
          {currentLesson ? (
            <div className="continue-lesson">
              <div className="continue-lesson-info">
                <span className="continue-lesson-level badge badge-primary">{currentLesson.level}</span>
                <h4 className="continue-lesson-title">{currentLesson.titleVi}</h4>
                <p className="continue-lesson-desc">{currentLesson.description}</p>
                <div className="continue-lesson-meta">
                  <span>⏱️ {currentLesson.estimatedMinutes} phút</span>
                  <span>⚡ +{currentLesson.xpReward} XP</span>
                </div>
              </div>
              <Link to={`/lessons/${currentLesson._id}`} className="btn btn-primary btn-lg">
                Tiếp tục →
              </Link>
            </div>
          ) : (
            <div className="continue-empty">
              <p>🎉 Tuyệt vời! Bạn đã hoàn thành tất cả bài học có sẵn.</p>
              <Link to="/lessons" className="btn btn-secondary">Xem tất cả bài học</Link>
            </div>
          )}
        </div>

        {/* Recent Achievements */}
        <div className="dashboard-achievements glass-card animate-fadeInUp stagger-4">
          <div className="achievements-header">
            <h3>🏅 Thành tích</h3>
            <Link to="/profile" className="achievements-link">Xem tất cả →</Link>
          </div>
          <div className="achievements-grid">
            {achievementsList.slice(0, 6).map(a => {
              const isUnlocked = achievements.includes(a.id);
              return (
                <div
                  key={a.id}
                  className={`achievement-item ${isUnlocked ? 'achievement--unlocked' : 'achievement--locked'}`}
                  title={isUnlocked ? `${a.nameVi} - ${a.description}` : `🔒 ${a.description}`}
                >
                  <span className="achievement-icon">{a.icon}</span>
                  <span className="achievement-name">{a.nameVi}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-actions glass-card animate-fadeInUp stagger-5">
          <h3>⚡ Hành động nhanh</h3>
          <div className="actions-list">
            <Link to="/vocabulary" className="action-item">
              <span className="action-icon">📝</span>
              <span className="action-text">Ôn từ vựng</span>
              <span className="action-arrow">→</span>
            </Link>
            <Link to="/lessons" className="action-item">
              <span className="action-icon">📚</span>
              <span className="action-text">Xem bài học</span>
              <span className="action-arrow">→</span>
            </Link>
            <Link to="/leaderboard" className="action-item">
              <span className="action-icon">🏆</span>
              <span className="action-text">Bảng xếp hạng</span>
              <span className="action-arrow">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
