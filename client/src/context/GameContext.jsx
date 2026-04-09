import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const { user, updateUser } = useAuth();
  const [progress, setProgress] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showAchievement, setShowAchievement] = useState(null);

  // Initialize data when user logs in
  useEffect(() => {
    if (user) {
      fetchProgress();
      // achievements can be synced with user.achievements
    } else {
      setProgress([]);
      setAchievements([]);
    }
  }, [user]);

  const fetchProgress = async () => {
    try {
      const { data } = await api.get('/progress');
      setProgress(data);
    } catch (error) {
      console.error('Failed to fetch progress', error);
    }
  };

  const completeLesson = useCallback(async (lessonId, score) => {
    try {
      const { data } = await api.put(`/progress/lesson/${lessonId}`, {
        status: 'completed',
        score
      });
      // Refresh progress and user to reflect XP changes
      await fetchProgress();
      const userData = await api.get('/auth/me');
      
      // Check if level increased
      if (user && userData.data.level > user.level) {
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 3000);
      }
      
      updateUser(userData.data);
    } catch (error) {
      console.error('Failed to complete lesson', error);
    }
  }, [user, updateUser]);

  const submitQuiz = useCallback(async (quizDbId, score, totalPoints) => {
    try {
      const { data } = await api.post(`/quizzes/${quizDbId}/submit`, {
        score,
        totalPoints
      });
      
      const userData = await api.get('/auth/me');
      
      // Check if level increased
      if (user && userData.data.level > user.level) {
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 3000);
      }
      
      // Check if perfect score unlocked achievement
      if (user && userData.data.achievements.length > user.achievements.length) {
        // Find new achievement (mocking the toast for now)
        setShowAchievement({ title: 'New Achievement!', icon: '🏆' });
        setTimeout(() => setShowAchievement(null), 4000);
      }

      updateUser(userData.data);
      return data; // { percentage, xpEarned, newTotalXP, newLevel }
    } catch (error) {
      console.error('Failed to submit quiz', error);
    }
  }, [user, updateUser]);

  const updateStreak = useCallback(async () => {
    try {
      const { data } = await api.put('/progress/streak');
      
      // If streak increased, refresh user
      const userData = await api.get('/auth/me');
      
      if (user && userData.data.achievements.length > user.achievements.length) {
        setShowAchievement({ title: 'Streak Achievement Unlocked!', icon: '🔥' });
        setTimeout(() => setShowAchievement(null), 4000);
      }
      
      updateUser(userData.data);
    } catch (error) {
      console.error('Failed to update streak', error);
    }
  }, [user, updateUser]);

  const getLessonStatus = useCallback((lessonId) => {
    const p = progress.find(item => item.lessonId._id === lessonId || item.lessonId === lessonId);
    return p ? p.status : 'locked';
  }, [progress]);

  const getLessonProgress = useCallback((lessonId) => {
    return progress.find(item => item.lessonId._id === lessonId || item.lessonId === lessonId) || null;
  }, [progress]);

  return (
    <GameContext.Provider value={{
      progress,
      achievements: user?.achievements || [],
      showLevelUp,
      showAchievement,
      setShowLevelUp,
      completeLesson,
      submitQuiz,
      updateStreak,
      getLessonStatus,
      getLessonProgress,
      fetchProgress
    }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
};
