import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useGame } from '../context/GameContext';
import './LessonDetail.css';

export default function LessonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { completeLesson, getLessonStatus } = useGame();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [lesson, setLesson] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: lessonData } = await api.get(`/lessons/${id}`);
        setLesson(lessonData);
        
        try {
          const { data: quizData } = await api.get(`/quizzes/lesson/${id}`);
          setQuiz(quizData);
        } catch (e) {
          // No quiz for this lesson
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const status = getLessonStatus(id);

  if (loading) {
    return <div className="lesson-detail" style={{textAlign: 'center', paddingTop: '60px'}}><h2>Đang tải...</h2></div>;
  }

  if (!lesson) {
    return (
      <div className="lesson-detail" style={{ textAlign: 'center', paddingTop: '60px' }}>
        <h2>Bài học không tìm thấy</h2>
        <Link to="/lessons" className="btn btn-primary" style={{ marginTop: '20px' }}>← Quay lại</Link>
      </div>
    );
  }

  const totalSlides = lesson.content.length;
  const isLastSlide = currentSlide === totalSlides - 1;
  const progressPercent = ((currentSlide + 1) / totalSlides) * 100;

  const handleNext = () => {
    if (isLastSlide) {
      setShowComplete(true);
      completeLesson(id, 85);
    } else {
      setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1));
    }
  };

  const handlePrev = () => {
    setCurrentSlide(prev => Math.max(prev - 1, 0));
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const content = lesson.content[currentSlide];

  const typeConfig = {
    explanation: { icon: '📖', label: 'Giải thích', color: 'primary' },
    example: { icon: '💡', label: 'Ví dụ', color: 'accent' },
    practice: { icon: '✏️', label: 'Thực hành', color: 'success' },
    tip: { icon: '💎', label: 'Mẹo hay', color: 'secondary' },
  };

  const config = typeConfig[content.type] || typeConfig.explanation;

  if (showComplete) {
    return (
      <div className="lesson-detail" id="lesson-complete">
        <div className="lesson-complete-screen animate-scaleIn">
          <div className="complete-confetti">🎉</div>
          <h2 className="complete-title">Tuyệt vời!</h2>
          <p className="complete-subtitle">Bạn đã hoàn thành bài học</p>
          <h3 className="complete-lesson-name">{lesson.titleVi}</h3>
          <div className="complete-rewards">
            <div className="complete-reward">
              <span className="complete-reward-icon">⚡</span>
              <span className="complete-reward-value">+{lesson.xpReward} XP</span>
            </div>
          </div>
          <div className="complete-actions">
            {quiz && (
              <Link to={`/quiz/${quiz._id}`} className="btn btn-primary btn-lg">
                📝 Làm Quiz
              </Link>
            )}
            <Link to="/lessons" className="btn btn-secondary btn-lg">
              ← Lộ trình học tập
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lesson-detail" id="lesson-detail-page">
      {/* Top Progress Bar */}
      <div className="lesson-topbar animate-fadeInDown">
        <button className="btn btn-icon btn-secondary" onClick={() => navigate('/lessons')}>✕</button>
        <div className="lesson-progress-bar">
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <span className="lesson-progress-text">{currentSlide + 1} / {totalSlides}</span>
        </div>
        <span className="lesson-xp-badge">⚡ +{lesson.xpReward} XP</span>
      </div>

      {/* Lesson Header */}
      <div className="lesson-header animate-fadeIn">
        <span className="badge badge-primary">{lesson.level}</span>
        <h1 className="lesson-title">{lesson.titleVi}</h1>
        <p className="lesson-subtitle-en">{lesson.title}</p>
      </div>

      {/* Content Slide */}
      <div className="lesson-slide glass-card animate-fadeInUp" key={currentSlide}>
        <div className="slide-type-badge" style={{ '--badge-bg': `var(--${config.color})` }}>
          <span>{config.icon}</span>
          <span>{config.label}</span>
        </div>

        <h3 className="slide-title">{content.titleVi}</h3>

        {content.textEn && (
          <div className="slide-english">
            <div className="slide-lang-label">
              <span>🇬🇧 English</span>
              <button className="btn btn-sm btn-secondary" onClick={() => speak(content.textEn)}>
                🔊 Phát âm
              </button>
            </div>
            <div className="slide-text slide-text--en">
              {content.textEn.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        )}

        {content.textVi && (
          <div className="slide-vietnamese">
            <div className="slide-lang-label">
              <span>🇻🇳 Tiếng Việt</span>
            </div>
            <div className="slide-text slide-text--vi">
              {content.textVi.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="lesson-nav animate-fadeIn">
        <button
          className="btn btn-secondary btn-lg"
          onClick={handlePrev}
          disabled={currentSlide === 0}
        >
          ← Trước
        </button>
        <button className="btn btn-primary btn-lg" onClick={handleNext}>
          {isLastSlide ? '✅ Hoàn thành' : 'Tiếp theo →'}
        </button>
      </div>
    </div>
  );
}
