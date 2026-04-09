import { useEffect, useState } from 'react';
import './AchievementToast.css';

export default function AchievementToast({ achievement, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!achievement) return null;

  return (
    <div className={`achievement-toast ${isVisible ? 'achievement-toast--visible' : ''}`}>
      <div className="toast-icon">{achievement.icon}</div>
      <div className="toast-content">
        <span className="toast-label">🏅 Thành tích mới!</span>
        <span className="toast-name">{achievement.nameVi}</span>
        <span className="toast-desc">{achievement.description}</span>
      </div>
    </div>
  );
}
