import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useGame } from '../context/GameContext';
import './QuizPage.css';

export default function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { submitQuiz } = useGame();

  const [quiz, setQuiz] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: quizData } = await api.get(`/quizzes/${id}`);
        setQuiz(quizData);
        if (quizData.lessonId) {
          try {
            const { data: lessonData } = await api.get(`/lessons/${quizData.lessonId}`);
            setLesson(lessonData);
          } catch (e) {}
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [quizStarted, setQuizStarted] = useState(false);

  // Timer
  useEffect(() => {
    if (!quizStarted || showResults || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          finishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [quizStarted, showResults]);

  useEffect(() => {
    if (quiz && !quizStarted && !loading) {
      setTimeLeft(quiz.timeLimit || 120);
    }
  }, [quiz, quizStarted, loading]);

  if (loading) {
    return <div className="quiz-page" style={{textAlign: 'center', paddingTop: '60px'}}><h2>Đang tải...</h2></div>;
  }

  if (!quiz) {
    return (
      <div className="quiz-page" style={{ textAlign: 'center', paddingTop: '60px' }}>
        <h2>Quiz không tìm thấy</h2>
        <Link to="/lessons" className="btn btn-primary" style={{ marginTop: '20px' }}>← Quay lại</Link>
      </div>
    );
  }

  const questions = quiz.questions;
  const question = questions[currentQ];
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  const handleAnswer = (answer) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    setIsAnswered(true);

    const isCorrect = answer === question.correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + question.points);
    }
    setAnswers(prev => [...prev, { questionId: question._id, answer, isCorrect }]);
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const result = submitQuiz(quiz._id, score, totalPoints);
    setShowResults(true);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const percentage = Math.round((score / totalPoints) * 100);

  if (!quizStarted) {
    return (
      <div className="quiz-page" id="quiz-page">
        <div className="quiz-intro animate-scaleIn">
          <div className="quiz-intro-icon">📝</div>
          <h1 className="quiz-intro-title">{quiz.title}</h1>
          {lesson && <p className="quiz-intro-lesson">Bài học: {lesson.titleVi}</p>}
          <div className="quiz-intro-details">
            <div className="quiz-intro-detail">
              <span>❓</span>
              <span>{questions.length} câu hỏi</span>
            </div>
            <div className="quiz-intro-detail">
              <span>⏱️</span>
              <span>{formatTime(quiz.timeLimit)}</span>
            </div>
            <div className="quiz-intro-detail">
              <span>⚡</span>
              <span>+{quiz.xpReward} XP</span>
            </div>
          </div>
          <button className="btn btn-primary btn-lg" onClick={() => setQuizStarted(true)}>
            🚀 Bắt đầu Quiz
          </button>
          <Link to="/lessons" className="btn btn-secondary" style={{ marginTop: 'var(--space-3)' }}>
            ← Quay lại
          </Link>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="quiz-page" id="quiz-results">
        <div className="quiz-results animate-scaleIn">
          <div className="results-emoji">
            {percentage >= 80 ? '🎉' : percentage >= 50 ? '👍' : '💪'}
          </div>
          <h2 className="results-title">
            {percentage >= 80 ? 'Xuất sắc!' : percentage >= 50 ? 'Khá tốt!' : 'Cần cố gắng thêm!'}
          </h2>
          <div className="results-score-ring">
            <svg viewBox="0 0 120 120" width="150" height="150">
              <circle cx="60" cy="60" r="50" fill="none" stroke="var(--bg-tertiary)" strokeWidth="8" />
              <circle
                cx="60" cy="60" r="50" fill="none"
                stroke={percentage >= 80 ? 'var(--success)' : percentage >= 50 ? 'var(--accent)' : 'var(--error)'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${percentage * 3.14} 314`}
                transform="rotate(-90 60 60)"
                style={{ transition: 'stroke-dasharray 1s ease' }}
              />
            </svg>
            <div className="results-score-text">
              <span className="results-percent">{percentage}%</span>
            </div>
          </div>
          <div className="results-stats">
            <div className="results-stat">
              <span className="results-stat-label">Đúng</span>
              <span className="results-stat-value" style={{ color: 'var(--success)' }}>
                {answers.filter(a => a.isCorrect).length}
              </span>
            </div>
            <div className="results-stat">
              <span className="results-stat-label">Sai</span>
              <span className="results-stat-value" style={{ color: 'var(--error)' }}>
                {answers.filter(a => !a.isCorrect).length}
              </span>
            </div>
            <div className="results-stat">
              <span className="results-stat-label">Điểm</span>
              <span className="results-stat-value">{score}/{totalPoints}</span>
            </div>
          </div>

          {/* Review answers */}
          <div className="results-review">
            <h3>📋 Chi tiết câu trả lời</h3>
            {questions.map((q, i) => {
              const userAnswer = answers[i];
              return (
                <div key={q._id} className={`review-item ${userAnswer?.isCorrect ? 'review-item--correct' : 'review-item--wrong'}`}>
                  <div className="review-header">
                    <span className="review-number">Câu {i + 1}</span>
                    <span className="review-status">{userAnswer?.isCorrect ? '✅' : '❌'}</span>
                  </div>
                  <p className="review-question">{q.questionText}</p>
                  {!userAnswer?.isCorrect && (
                    <p className="review-correct">Đáp án đúng: <strong>{q.correctAnswer}</strong></p>
                  )}
                  <p className="review-explanation">{q.explanationVi}</p>
                </div>
              );
            })}
          </div>

          <div className="results-actions">
            <button className="btn btn-primary btn-lg" onClick={() => {
              setCurrentQ(0);
              setSelectedAnswer(null);
              setIsAnswered(false);
              setScore(0);
              setAnswers([]);
              setShowResults(false);
              setTimeLeft(quiz.timeLimit);
              setQuizStarted(false);
            }}>
              🔄 Làm lại
            </button>
            <Link to="/lessons" className="btn btn-secondary btn-lg">← Lộ trình học tập</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page" id="quiz-active">
      {/* Quiz Header */}
      <div className="quiz-header animate-fadeInDown">
        <button className="btn btn-icon btn-secondary" onClick={() => navigate('/lessons')}>✕</button>
        <div className="quiz-progress-area">
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
          </div>
          <span className="quiz-progress-text">Câu {currentQ + 1}/{questions.length}</span>
        </div>
        <div className={`quiz-timer ${timeLeft <= 30 ? 'quiz-timer--warning' : ''}`}>
          ⏱️ {formatTime(timeLeft)}
        </div>
      </div>

      {/* Question */}
      <div className="quiz-question animate-fadeInUp" key={currentQ}>
        <div className="quiz-q-number">Câu hỏi {currentQ + 1}</div>
        <h2 className="quiz-q-text">{question.questionText}</h2>
        {question.questionTextVi && (
          <p className="quiz-q-text-vi">{question.questionTextVi}</p>
        )}

        <div className="quiz-options">
          {question.options.map((option, i) => {
            let optionClass = 'quiz-option';
            if (isAnswered) {
              if (option === question.correctAnswer) optionClass += ' quiz-option--correct';
              else if (option === selectedAnswer) optionClass += ' quiz-option--wrong';
            }
            if (option === selectedAnswer && !isAnswered) optionClass += ' quiz-option--selected';

            return (
              <button
                key={i}
                className={optionClass}
                onClick={() => handleAnswer(option)}
                disabled={isAnswered}
              >
                <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                <span className="option-text">{option}</span>
                {isAnswered && option === question.correctAnswer && <span className="option-icon">✅</span>}
                {isAnswered && option === selectedAnswer && option !== question.correctAnswer && <span className="option-icon">❌</span>}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {isAnswered && (
          <div className={`quiz-explanation animate-fadeInUp ${selectedAnswer === question.correctAnswer ? 'quiz-explanation--correct' : 'quiz-explanation--wrong'}`}>
            <p className="explanation-status">
              {selectedAnswer === question.correctAnswer ? '🎉 Chính xác!' : '😅 Chưa đúng rồi!'}
            </p>
            <p className="explanation-text">{question.explanationVi}</p>
          </div>
        )}
      </div>

      {/* Next Button */}
      {isAnswered && (
        <div className="quiz-next animate-fadeIn">
          <button className="btn btn-primary btn-lg" onClick={handleNext} style={{ width: '100%', maxWidth: '400px' }}>
            {currentQ < questions.length - 1 ? 'Câu tiếp theo →' : '📊 Xem kết quả'}
          </button>
        </div>
      )}
    </div>
  );
}
