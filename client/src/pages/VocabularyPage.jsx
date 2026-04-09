import { useState, useMemo, useEffect } from 'react';
import api from '../utils/api';
import './VocabularyPage.css';

export default function VocabularyPage() {
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [flippedCards, setFlippedCards] = useState({});
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [vocabulary, setVocabulary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVocab = async () => {
      try {
        const { data } = await api.get('/vocabulary');
        setVocabulary(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVocab();
  }, []);

  const categories = ['all', ...new Set(vocabulary.map(v => v.category))];

  const filteredVocab = useMemo(() => {
    return vocabulary.filter(v => {
      const matchSearch = v.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.meaningVi.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategory === 'all' || v.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [searchTerm, selectedCategory, vocabulary]);

  const toggleFlip = (id) => {
    setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const currentCard = filteredVocab[currentCardIndex];

  const categoryLabels = {
    all: 'Tất cả',
    greetings: 'Chào hỏi',
    numbers: 'Số đếm',
    colors: 'Màu sắc',
    family: 'Gia đình',
    daily: 'Hàng ngày',
    food: 'Đồ ăn',
    time: 'Thời gian',
    travel: 'Du lịch',
    adjectives: 'Tính từ',
    work: 'Công việc',
  };

  if (loading) {
    return <div className="vocab-page" style={{textAlign: 'center', paddingTop: '60px'}}><h2>Đang tải...</h2></div>;
  }

  return (
    <div className="vocab-page" id="vocabulary-page">
      <div className="page-header animate-fadeIn">
        <h1 className="page-title">📝 Từ vựng</h1>
        <p className="page-subtitle">{vocabulary.length} từ vựng · Lật thẻ để học</p>
      </div>

      {/* Controls */}
      <div className="vocab-controls animate-fadeInUp stagger-1">
        <div className="vocab-search">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="input-field"
            placeholder="Tìm từ vựng..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            id="vocab-search-input"
          />
        </div>
        <div className="vocab-view-toggle">
          <button
            className={`view-btn ${viewMode === 'cards' ? 'view-btn--active' : ''}`}
            onClick={() => setViewMode('cards')}
          >
            🃏 Flashcard
          </button>
          <button
            className={`view-btn ${viewMode === 'list' ? 'view-btn--active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            📋 Danh sách
          </button>
        </div>
      </div>

      {/* Category filter */}
      <div className="vocab-categories animate-fadeInUp stagger-2">
        {categories.map(cat => (
          <button
            key={cat}
            className={`category-btn ${selectedCategory === cat ? 'category-btn--active' : ''}`}
            onClick={() => { setSelectedCategory(cat); setCurrentCardIndex(0); }}
          >
            {categoryLabels[cat] || cat}
          </button>
        ))}
      </div>

      {/* Flashcard Mode */}
      {viewMode === 'cards' && filteredVocab.length > 0 && (
        <div className="vocab-flashcard-area animate-fadeInUp stagger-3">
          <div className="flashcard-counter">
            {currentCardIndex + 1} / {filteredVocab.length}
          </div>

          <div
            className={`flashcard ${flippedCards[currentCard._id] ? 'flashcard--flipped' : ''}`}
            onClick={() => toggleFlip(currentCard._id)}
          >
            <div className="flashcard-front">
              <span className="flashcard-word">{currentCard.word}</span>
              <span className="flashcard-pronunciation">{currentCard.pronunciation}</span>
              <button
                className="btn btn-sm btn-secondary flashcard-speak"
                onClick={(e) => { e.stopPropagation(); speak(currentCard.word); }}
              >
                🔊 Phát âm
              </button>
              <span className="flashcard-hint">Nhấn để lật thẻ</span>
            </div>
            <div className="flashcard-back">
              <span className="flashcard-meaning">{currentCard.meaningVi}</span>
              <span className="flashcard-pos badge badge-primary">{currentCard.partOfSpeech}</span>
              <div className="flashcard-example">
                <p className="example-en">"{currentCard.exampleEn}"</p>
                <p className="example-vi">{currentCard.exampleVi}</p>
              </div>
              <span className="flashcard-hint">Nhấn để lật lại</span>
            </div>
          </div>

          <div className="flashcard-nav">
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => { setCurrentCardIndex(prev => Math.max(0, prev - 1)); setFlippedCards({}); }}
              disabled={currentCardIndex === 0}
            >
              ← Trước
            </button>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => { setCurrentCardIndex(prev => Math.min(filteredVocab.length - 1, prev + 1)); setFlippedCards({}); }}
              disabled={currentCardIndex === filteredVocab.length - 1}
            >
              Tiếp →
            </button>
          </div>
        </div>
      )}

      {/* List Mode */}
      {viewMode === 'list' && (
        <div className="vocab-list animate-fadeInUp stagger-3">
          {filteredVocab.map((vocab, i) => (
            <div key={vocab._id} className="vocab-list-item glass-card" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="vocab-item-main">
                <div className="vocab-item-word-section">
                  <span className="vocab-item-word">{vocab.word}</span>
                  <span className="vocab-item-pronunciation">{vocab.pronunciation}</span>
                </div>
                <span className="vocab-item-meaning">{vocab.meaningVi}</span>
              </div>
              <div className="vocab-item-details">
                <span className="badge badge-primary">{vocab.partOfSpeech}</span>
                <span className={`badge badge-${vocab.difficulty === 'easy' ? 'success' : vocab.difficulty === 'medium' ? 'accent' : 'error'}`}>
                  {vocab.difficulty === 'easy' ? 'Dễ' : vocab.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                </span>
                <button className="btn btn-sm btn-secondary" onClick={() => speak(vocab.word)}>
                  🔊
                </button>
              </div>
              <p className="vocab-item-example">"{vocab.exampleEn}"</p>
            </div>
          ))}
        </div>
      )}

      {filteredVocab.length === 0 && (
        <div className="vocab-empty animate-fadeIn">
          <span style={{ fontSize: '48px' }}>🔍</span>
          <p>Không tìm thấy từ vựng nào</p>
        </div>
      )}
    </div>
  );
}
