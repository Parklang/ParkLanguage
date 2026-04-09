import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useGame } from './context/GameContext';

import Sidebar from './components/common/Sidebar';
import Navbar from './components/common/Navbar';
import LevelUpModal from './components/gamification/LevelUpModal';
import AchievementToast from './components/gamification/AchievementToast';

import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import LessonsPage from './pages/LessonsPage';
import LessonDetail from './pages/LessonDetail';
import QuizPage from './pages/QuizPage';
import VocabularyPage from './pages/VocabularyPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';

function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p style={{ color: 'var(--text-muted)' }}>Đang tải...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;
  return children;
}

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const { showLevelUp, setShowLevelUp, showAchievement } = useGame();

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Navbar onMenuToggle={() => setSidebarOpen(prev => !prev)} />
      <main className="main-content">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/lessons" element={<LessonsPage />} />
          <Route path="/lessons/:id" element={<LessonDetail />} />
          <Route path="/quiz/:id" element={<QuizPage />} />
          <Route path="/vocabulary" element={<VocabularyPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>

      {/* Gamification Overlays */}
      {showLevelUp && (
        <LevelUpModal level={user?.level} onClose={() => setShowLevelUp(false)} />
      )}
      {showAchievement && (
        <AchievementToast achievement={showAchievement} onClose={() => {}} />
      )}
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function PublicRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p style={{ color: 'var(--text-muted)' }}>Đang tải...</p>
      </div>
    );
  }

  if (user) return <Navigate to="/dashboard" replace />;
  return <Landing />;
}
