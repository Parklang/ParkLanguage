import './LevelUpModal.css';

export default function LevelUpModal({ level, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="levelup-modal animate-scaleIn" onClick={e => e.stopPropagation()}>
        <div className="levelup-confetti-container">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#7C3AED', '#06B6D4', '#F59E0B', '#10B981', '#EF4444'][Math.floor(Math.random() * 5)]
              }}
            />
          ))}
        </div>
        <div className="levelup-emoji">🎉</div>
        <h2 className="levelup-title">Level Up!</h2>
        <div className="levelup-level">
          <span className="levelup-level-num">Lv.{level}</span>
        </div>
        <p className="levelup-text">Chúc mừng! Bạn đã lên level mới!</p>
        <button className="btn btn-primary btn-lg" onClick={onClose}>
          Tuyệt vời! 🚀
        </button>
      </div>
    </div>
  );
}
