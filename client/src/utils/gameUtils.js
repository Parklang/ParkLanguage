export const getLevelFromXP = (xp) => {
  let level = 1;
  let currentLevelXP = xp;
  let nextLevelXP = 100;

  while (currentLevelXP >= nextLevelXP) {
    currentLevelXP -= nextLevelXP;
    level++;
    nextLevelXP = level * 100;
  }

  return { level, currentLevelXP, nextLevelXP };
};

export const achievementsList = [
  { id: 'first_flame', nameVi: 'Ngọn Lửa Đầu Tiên', description: 'Đạt chuỗi học tập 1 ngày', icon: '🔥' },
  { id: 'week_warrior', nameVi: 'Chiến Binh Tuần', description: 'Đạt chuỗi học tập 7 ngày', icon: '⚔️' },
  { id: 'month_master', nameVi: 'Bậc Thầy Tháng', description: 'Đạt chuỗi học tập 30 ngày', icon: '👑' },
  { id: 'perfect_score', nameVi: 'Điểm Tuyệt Đối', description: 'Hoàn thành 1 bài Quiz với 100% điểm', icon: '💯' },
  { id: 'vocab_hunter', nameVi: 'Thợ Săn Từ Vựng', description: 'Học được 50 từ vựng', icon: '📖' },
  { id: 'quick_learner', nameVi: 'Học Thần Tốc', description: 'Hoàn thành bài học dưới 5 phút', icon: '⚡' },
  { id: 'grammar_guru', nameVi: 'Chuyên Gia Ngữ Pháp', description: 'Hoàn thành tất cả bài ngữ pháp', icon: '🧠' },
  { id: 'weekend_warrior', nameVi: 'Anh Hùng Cuối Tuần', description: 'Học vào cả thứ 7 và Chủ nhật', icon: '📅' },
  { id: 'first_blood', nameVi: 'Hành Trình Bắt Đầu', description: 'Hoàn thành bài học đầu tiên', icon: '🌱' },
  { id: 'night_owl', nameVi: 'Cú Đêm', description: 'Học sau 10 giờ tối', icon: '🌙' }
];

export const getLevelTitle = (level) => {
  if (level < 5) return 'Beginner';
  if (level < 10) return 'Explorer';
  if (level < 20) return 'Scholar';
  if (level < 30) return 'Master';
  return 'Legend';
};
