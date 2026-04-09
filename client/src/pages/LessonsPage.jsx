import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import api from '../utils/api';
import './LessonsPage.css';

export default function LessonsPage() {
  const { getLessonStatus, getLessonProgress } = useGame();
  const [lessons, setLessons] = useState([]);
  const [filterLevel, setFilterLevel] = useState('Tất cả');

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const { data } = await api.get('/lessons');
        setLessons(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLessons();
  }, []);

  const statusConfig = {
    completed: { label: 'Hoàn thành', icon: '✅', color: 'success' },
    'in-progress': { label: 'Đang học', icon: '📖', color: 'primary' },
    available: { label: 'Sẵn sàng', icon: '🔓', color: 'accent' },
    locked: { label: 'Khóa', icon: '🔒', color: 'muted' },
  };

  const filteredLessons = filterLevel === 'Tất cả' 
    ? lessons 
    : lessons.filter(l => l.level === filterLevel);

  return (
    <div className="lessons-page" id="lessons-page">
      <div className="page-header animate-fadeIn">
        <h1 className="page-title">📚 Lộ trình học tập</h1>
        <p className="page-subtitle">Chinh phục từng bài học, mở khóa kiến thức mới!</p>
      </div>

      {/* Level Filter */}
      <div className="lessons-levels animate-fadeInUp stagger-1">
        {['Tất cả', 'A1', 'A2', 'B1', 'B2'].map(level => (
          <button 
            key={level} 
            className={`level-filter-btn ${level === filterLevel ? 'level-filter-btn--active' : ''}`}
            onClick={() => setFilterLevel(level)}
          >
            {level}
          </button>
        ))}
      </div>

      {/* Learning Path */}
      <div className="learning-path animate-fadeInUp stagger-2">
        {filteredLessons.map((lesson, index) => {
          const status = getLessonStatus(lesson._id);
          const prog = getLessonProgress(lesson._id);
          const config = statusConfig[status];
          const isEven = index % 2 === 0;

          return (
            <div key={lesson._id} className={`path-node path-node--${status} ${isEven ? 'path-node--left' : 'path-node--right'}`}>
              {/* Connector line */}
              {index < filteredLessons.length - 1 && (
                <div className={`path-connector ${status === 'completed' ? 'path-connector--done' : ''}`} />
              )}

              <div className="path-node-content">
                <div className={`path-node-circle path-node-circle--${config.color}`}>
                  <span className="path-node-icon">{config.icon}</span>
                  <span className="path-node-number">{index + 1}</span>
                </div>

                <div className="path-node-card glass-card">
                  <div className="path-node-header">
                    <span className={`badge badge-${config.color === 'muted' ? 'primary' : config.color}`}>
                      {lesson.level}
                    </span>
                    <span className="path-node-category">{lesson.category}</span>
                  </div>
                  <h3 className="path-node-title">{lesson.titleVi}</h3>
                  <p className="path-node-subtitle">{lesson.title}</p>
                  <div className="path-node-meta">
                    <span>⏱️ {lesson.estimatedMinutes} phút</span>
                    <span>⚡ +{lesson.xpReward} XP</span>
                  </div>
                  {prog && prog.bestScore > 0 && (
                    <div className="path-node-score">
                      <span>🎯 Điểm cao nhất: {prog.bestScore}%</span>
                    </div>
                  )}
                  {status !== 'locked' ? (
                    <Link to={`/lessons/${lesson._id}`} className={`btn ${status === 'completed' ? 'btn-secondary' : 'btn-primary'} path-node-btn`}>
                      {status === 'completed' ? 'Ôn lại' : status === 'in-progress' ? 'Tiếp tục' : 'Bắt đầu'}
                    </Link>
                  ) : (
                    <button className="btn btn-secondary path-node-btn" disabled>
                      🔒 Hoàn thành bài trước
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
