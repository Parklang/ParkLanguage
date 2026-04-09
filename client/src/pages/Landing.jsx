import './Landing.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Không thể kết nối đến server. Vui lòng kiểm tra VITE_API_URL');
    }
    setIsLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await register(formData.username, formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Không thể tạo tài khoản. Vui lòng thử lại.');
    }
    setIsLoading(false);
  };

  const closeModals = () => {
    setShowLogin(false);
    setShowRegister(false);
    setError('');
    setFormData({ username: '', email: '', password: '' });
  };

  return (
    <div className="landing" id="landing-page">
      {/* Animated background elements */}
      <div className="landing-bg">
        <div className="landing-orb landing-orb--1" />
        <div className="landing-orb landing-orb--2" />
        <div className="landing-orb landing-orb--3" />
      </div>

      {/* Header */}
      <header className="landing-header">
        <div className="landing-logo">
          <span className="landing-logo-icon">🌍</span>
          <span className="landing-logo-text">Park<span className="gradient-text">Language</span></span>
        </div>
        <div className="landing-header-actions">
          <button className="btn btn-secondary" onClick={() => setShowLogin(true)} id="login-btn">
            Đăng nhập
          </button>
          <button className="btn btn-primary" onClick={() => setShowRegister(true)} id="register-btn">
            Bắt đầu miễn phí
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-content animate-fadeInUp">
          <div className="landing-hero-badge">
            <span>🚀</span> Ứng dụng học Tiếng Anh #1
          </div>
          <h1 className="landing-hero-title">
            Học Tiếng Anh
            <br />
            <span className="gradient-text">Thông Minh & Thú Vị</span>
          </h1>
          <p className="landing-hero-desc">
            Chinh phục Tiếng Anh mỗi ngày với bài học tương tác, hệ thống gamification,
            và phương pháp học thông minh. Hoàn toàn miễn phí!
          </p>
          <div className="landing-hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => setShowRegister(true)} id="hero-cta">
              🎯 Bắt Đầu Học Ngay
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => setShowLogin(true)}>
              Tôi đã có tài khoản
            </button>
          </div>
          <div className="landing-hero-stats">
            <div className="landing-stat-item">
              <span className="landing-stat-number">10K+</span>
              <span className="landing-stat-label">Người học</span>
            </div>
            <div className="landing-stat-divider" />
            <div className="landing-stat-item">
              <span className="landing-stat-number">500+</span>
              <span className="landing-stat-label">Bài học</span>
            </div>
            <div className="landing-stat-divider" />
            <div className="landing-stat-item">
              <span className="landing-stat-number">98%</span>
              <span className="landing-stat-label">Hài lòng</span>
            </div>
          </div>
        </div>

        <div className="landing-hero-visual animate-fadeInUp stagger-2">
          <div className="landing-hero-mockup">
            <div className="mockup-card mockup-card--1">
              <span className="mockup-icon">📚</span>
              <span className="mockup-text">Bài học hôm nay</span>
              <div className="mockup-progress">
                <div className="mockup-progress-fill" style={{ width: '65%' }} />
              </div>
            </div>
            <div className="mockup-card mockup-card--2">
              <span className="mockup-icon">🔥</span>
              <span className="mockup-text">Streak: 7 ngày</span>
              <span className="mockup-emoji">🎉</span>
            </div>
            <div className="mockup-card mockup-card--3">
              <span className="mockup-icon">⚡</span>
              <span className="mockup-text">+50 XP</span>
              <span className="mockup-badge">Level Up!</span>
            </div>
            <div className="mockup-mascot">🦉</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="landing-features" id="features">
        <h2 className="landing-section-title animate-fadeInUp">
          Tại sao chọn <span className="gradient-text">ParkLanguage</span>?
        </h2>
        <div className="landing-features-grid">
          {[
            { icon: '🎮', title: 'Gamification', desc: 'Học như chơi game với XP, level, streak, và bảng xếp hạng. Mỗi bài học là một cuộc phiêu lưu!' },
            { icon: '📱', title: 'Micro-Learning', desc: 'Bài học ngắn gọn 5-10 phút, phù hợp với lịch trình bận rộn. Học mọi lúc, mọi nơi.' },
            { icon: '🧠', title: 'Spaced Repetition', desc: 'Hệ thống lặp lại thông minh giúp bạn nhớ từ vựng lâu hơn và hiệu quả hơn.' },
            { icon: '📊', title: 'Theo dõi tiến trình', desc: 'Xem chi tiết tiến bộ của bạn qua biểu đồ, thống kê, và achievement badges.' },
            { icon: '🎯', title: 'Quiz tương tác', desc: 'Đa dạng câu hỏi: trắc nghiệm, điền từ, dịch câu. Kiểm tra và củng cố kiến thức.' },
            { icon: '🌙', title: 'Dark Mode', desc: 'Giao diện dark/light mode bảo vệ mắt, thiết kế hiện đại và dễ sử dụng.' }
          ].map((feature, i) => (
            <div key={i} className={`landing-feature-card glass-card animate-fadeInUp stagger-${i + 1}`}>
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-cta">
        <div className="landing-cta-content animate-fadeInUp">
          <h2 className="landing-cta-title">Sẵn sàng chinh phục Tiếng Anh?</h2>
          <p className="landing-cta-desc">
            Tham gia cùng hàng nghìn người học khác. Bắt đầu hành trình của bạn ngay hôm nay!
          </p>
          <button className="btn btn-primary btn-lg" onClick={() => setShowRegister(true)}>
            🚀 Đăng ký miễn phí
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2026 ParkLanguage. Được xây dựng với ❤️ cho người học Tiếng Anh Việt Nam.</p>
      </footer>

      {/* Login Modal */}
      {showLogin && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: 'var(--space-2)', fontFamily: 'var(--font-heading)' }}>Đăng nhập</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-6)', fontSize: 'var(--fs-sm)' }}>
              Chào mừng bạn trở lại! 👋
            </p>
            {error && (
              <div style={{ padding: 'var(--space-3)', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)', fontSize: 'var(--fs-sm)', border: '1px solid var(--error)' }}>
                {error}
              </div>
            )}
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: 'var(--fs-sm)', fontWeight: 500 }}>Email</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required
                  id="login-email"
                />
              </div>
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: 'var(--fs-sm)', fontWeight: 500 }}>Mật khẩu</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  required
                  id="login-password"
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={isLoading} id="login-submit">
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: 'var(--space-4)', fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
              Chưa có tài khoản?{' '}
              <button
                style={{ color: 'var(--primary-light)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--fs-sm)', fontFamily: 'var(--font-body)' }}
                onClick={() => { setShowLogin(false); setShowRegister(true); }}
              >
                Đăng ký ngay
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegister && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: 'var(--space-2)', fontFamily: 'var(--font-heading)' }}>Tạo tài khoản</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-6)', fontSize: 'var(--fs-sm)' }}>
              Bắt đầu hành trình học Tiếng Anh! 🚀
            </p>
            {error && (
              <div style={{ padding: 'var(--space-3)', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)', fontSize: 'var(--fs-sm)', border: '1px solid var(--error)' }}>
                {error}
              </div>
            )}
            <form onSubmit={handleRegister}>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: 'var(--fs-sm)', fontWeight: 500 }}>Tên hiển thị</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Tên của bạn"
                  value={formData.username}
                  onChange={e => setFormData({ ...formData, username: e.target.value })}
                  required
                  id="register-username"
                />
              </div>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: 'var(--fs-sm)', fontWeight: 500 }}>Email</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required
                  id="register-email"
                />
              </div>
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: 'var(--fs-sm)', fontWeight: 500 }}>Mật khẩu</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="Tối thiểu 6 ký tự"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  id="register-password"
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={isLoading} id="register-submit">
                {isLoading ? 'Đang tạo...' : '🎯 Bắt đầu học ngay'}
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: 'var(--space-4)', fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
              Đã có tài khoản?{' '}
              <button
                style={{ color: 'var(--primary-light)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--fs-sm)', fontFamily: 'var(--font-body)' }}
                onClick={() => { setShowRegister(false); setShowLogin(true); }}
              >
                Đăng nhập
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
