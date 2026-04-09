import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { getLevelFromXP, getLevelTitle, achievementsList } from '../utils/gameUtils';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user } = useAuth();
  const { achievements, progress } = useGame();

  const levelInfo = getLevelFromXP(user?.totalXP || 0);
  const xpProgress = (levelInfo.currentLevelXP / levelInfo.nextLevelXP) * 100;
  const completedLessons = progress.filter(p => p.status === 'completed').length;
  const totalLessons = progress.length || 1; // Prevent division by zero
  const unlockedAchievementsCount = achievements.length;

  // Activity heatmap (mock last 30 days)
  const activityDays = Array.from({ length: 35 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (34 - i));
    const isActive = Math.random() > 0.4;
    const intensity = isActive ? Math.floor(Math.random() * 4) + 1 : 0;
    return { date, intensity };
  });

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Unknown';

  return (
    <div className="profile-page" id="profile-page">
      {/* Profile Header */}
      <div className="profile-header glass-card animate-fadeIn">
        <div className="profile-avatar-section">
          <div className="profile-avatar-large">
            {user?.username?.charAt(0).toUpperCase() || 'P'}
          </div>
          <div className="profile-header-info">
            <h1 className="profile-name">{user?.username}</h1>
            <p className="profile-email">{user?.email}</p>
            <p className="profile-join">📅 Tham gia từ {joinDate}</p>
          </div>
        </div>
        <div className="profile-level-section">
          <div className="profile-level-badge">
            <span className="profile-level-number">Lv.{user?.level || 1}</span>
            <span className="profile-level-title">{getLevelTitle(user?.level || 1)}</span>
          </div>
          <div className="profile-xp-bar">
            <div className="progress-bar" style={{ height: '10px' }}>
              <div className="progress-bar-fill" style={{ width: `${xpProgress}%` }} />
            </div>
            <span className="profile-xp-text">{levelInfo.currentLevelXP} / {levelInfo.nextLevelXP} XP to next level</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="profile-stats animate-fadeInUp stagger-1">
        {[
          { icon: '⚡', value: user?.totalXP || 0, label: 'Tổng XP', color: 'primary' },
          { icon: '🔥', value: user?.currentStreak || 0, label: 'Streak hiện tại', color: 'accent' },
          { icon: '🏅', value: user?.longestStreak || 0, label: 'Streak dài nhất', color: 'accent' },
          { icon: '📚', value: completedLessons, label: 'Bài đã học', color: 'secondary' },
          { icon: '📝', value: user?.quizzesCompleted || 0, label: 'Quiz đã làm', color: 'success' },
          { icon: '💎', value: user?.wordsLearned || 0, label: 'Từ đã học', color: 'primary' },
        ].map((stat, i) => (
          <div key={i} className="profile-stat-card glass-card">
            <span className="profile-stat-icon">{stat.icon}</span>
            <span className="profile-stat-value">{stat.value.toLocaleString()}</span>
            <span className="profile-stat-label">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Activity Heatmap */}
      <div className="profile-activity glass-card animate-fadeInUp stagger-2">
        <h3>📊 Hoạt động 5 tuần gần nhất</h3>
        <div className="activity-heatmap">
          {activityDays.map((day, i) => (
            <div
              key={i}
              className={`heatmap-cell heatmap-cell--${day.intensity}`}
              title={`${day.date.toLocaleDateString('vi-VN')} - ${day.intensity > 0 ? 'Đã học' : 'Chưa học'}`}
            />
          ))}
        </div>
        <div className="heatmap-legend">
          <span className="heatmap-legend-label">Ít</span>
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className={`heatmap-cell heatmap-cell--${i}`} />
          ))}
          <span className="heatmap-legend-label">Nhiều</span>
        </div>
      </div>

      {/* Achievements */}
      <div className="profile-achievements glass-card animate-fadeInUp stagger-3">
        <h3>🏅 Thành tích ({unlockedAchievementsCount}/{achievementsList.length})</h3>
        <div className="profile-achievements-grid">
          {achievementsList.map(a => {
            const isUnlocked = achievements.includes(a.id);
            return (
              <div key={a.id} className={`profile-achievement ${isUnlocked ? 'profile-achievement--unlocked' : 'profile-achievement--locked'}`}>
                <span className="profile-achievement-icon">{a.icon}</span>
                <div className="profile-achievement-info">
                  <span className="profile-achievement-name">{a.nameVi}</span>
                  <span className="profile-achievement-desc">{a.description}</span>
                </div>
                {isUnlocked && <span className="profile-achievement-check">✅</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Learning Progress */}
      <div className="profile-progress glass-card animate-fadeInUp stagger-4">
        <h3>📚 Tiến trình học tập ({completedLessons}/{totalLessons})</h3>
        <div className="progress-bar" style={{ height: '12px', marginBottom: 'var(--space-4)' }}>
          <div className="progress-bar-fill" style={{ width: `${(completedLessons / totalLessons) * 100}%` }} />
        </div>
        <p className="profile-progress-text">
          Bạn đã hoàn thành <strong>{Math.round((completedLessons / totalLessons) * 100)}%</strong> chương trình học.
          {completedLessons < totalLessons ? ' Hãy tiếp tục cố gắng! 💪' : ' Tuyệt vời! 🎉'}
        </p>
      </div>
    </div>
  );
}
