import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './LeaderboardPage.css';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await api.get('/progress/leaderboard');
        setLeaderboard(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const currentUserRank = leaderboard.findIndex(u => u._id === user?._id) + 1;

  const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  if (loading) {
    return <div className="leaderboard-page" style={{textAlign: 'center', paddingTop: '60px'}}><h2>Đang tải...</h2></div>;
  }

  return (
    <div className="leaderboard-page" id="leaderboard-page">
      <div className="page-header animate-fadeIn">
        <h1 className="page-title">🏆 Bảng xếp hạng</h1>
        <p className="page-subtitle">Cạnh tranh với những người học khác!</p>
      </div>

      {/* Podium */}
      <div className="podium animate-fadeInUp stagger-1">
        {leaderboard.length >= 3 && [1, 0, 2].map((rankIdx) => {
          const podiumUser = leaderboard[rankIdx];
          const rank = rankIdx + 1;
          if (!podiumUser) return null;
          return (
            <div key={podiumUser._id} className={`podium-item podium-item--${rank} ${podiumUser._id === user?._id ? 'podium-item--me' : ''}`}>
              <div className="podium-avatar">
                {podiumUser.username.charAt(0).toUpperCase()}
              </div>
              <span className="podium-medal">{getMedalEmoji(rank)}</span>
              <span className="podium-name">{podiumUser.username}</span>
              <span className="podium-xp">{podiumUser.totalXP.toLocaleString()} XP</span>
              <div className={`podium-bar podium-bar--${rank}`}>
                <span className="podium-rank">{rank}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Your Rank */}
      {currentUserRank > 0 && (
        <div className="your-rank glass-card animate-fadeInUp stagger-2">
          <span className="your-rank-label">Thứ hạng của bạn</span>
          <span className="your-rank-number">#{currentUserRank}</span>
          <span className="your-rank-xp">{user?.totalXP?.toLocaleString()} XP</span>
        </div>
      )}

      {/* Full Rankings */}
      <div className="rankings animate-fadeInUp stagger-3">
        {leaderboard.map((u, i) => {
          const rank = i + 1;
          const isMe = u._id === user?._id;
          return (
            <div key={u._id} className={`ranking-item glass-card ${isMe ? 'ranking-item--me' : ''}`}>
              <div className="ranking-rank">
                {rank <= 3 ? (
                  <span className="ranking-medal">{getMedalEmoji(rank)}</span>
                ) : (
                  <span className="ranking-number">{rank}</span>
                )}
              </div>
              <div className="ranking-avatar">
                {u.username.charAt(0).toUpperCase()}
              </div>
              <div className="ranking-info">
                <span className="ranking-name">{u.username} {isMe && <span className="ranking-you">(Bạn)</span>}</span>
                <span className="ranking-level">Lv.{u.level}</span>
              </div>
              <div className="ranking-stats">
                <span className="ranking-streak">🔥 {u.currentStreak}</span>
                <span className="ranking-xp">⚡ {u.totalXP.toLocaleString()} XP</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
