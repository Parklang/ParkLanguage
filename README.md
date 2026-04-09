# 🌍 ParkLanguage - Ứng dụng Học Tiếng Anh Thông Minh

ParkLanguage là một ứng dụng web học Tiếng Anh toàn diện được xây dựng trên nền tảng **MERN Stack** (MongoDB, Express, React, Node.js). Ứng dụng kết hợp phương pháp học hiện đại với hệ thống **Gamification** giúp người học duy trì động lực và đạt hiệu quả cao nhất.

![ParkLanguage Demo](<img width="1917" height="870" alt="image" src="https://github.com/user-attachments/assets/de035196-b476-440a-8639-5583ab30ab5b" />
) *Link demo: [https://park-language.vercel.app](https://park-language.vercel.app)*

---

## ✨ Tính năng nổi bật

### 🎮 Hệ thống Gamification (Trò chơi hóa)
- **XP & Level:** Tích lũy điểm kinh nghiệm để thăng cấp.
- **Streak:** Theo dõi chuỗi ngày học liên tục để tạo thói quen.
- **Achievements:** Mở khóa các huy hiệu thành tựu khi hoàn thành mục tiêu.
- **Leaderboard:** Bảng xếp hạng thời gian thực giữa những người học.

### 📚 Nội dung học tập đa dạng
- **Bài học (Lessons):** Phân chia theo cấp độ từ Cơ bản đến Nâng cao.
- **Trắc nghiệm (Quizzes):** Kiểm tra ngay sau mỗi bài học để củng cố kiến thức.
- **Từ vựng (Vocabulary):** Kho từ vựng phong phú với nghĩa tiếng Việt, ví dụ và phân loại chủ đề.

### 📱 Giao diện hiện đại (User Experience)
- **Premium Design:** Giao diện Dark Mode sang trọng, mượt mà.
- **Responsive:** Tương thích hoàn hảo trên Máy tính, Máy tính bảng và Điện thoại.

---

## 🛠️ Công nghệ sử dụng

- **Frontend:** React.js, Vite, Axios, React Router, Lucide Icons.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB Atlas (Cloud Database).
- **Authentication:** JSON Web Token (JWT) & BcryptJS.
- **Styling:** Vanilla CSS (Modern CSS variables, Flexbox, Grid).

---

## 🚀 Hướng dẫn cài đặt local

### 1. Clone repository
```bash
git clone https://github.com/Parklang/ParkLanguage.git
cd ParkLanguage
```

### 2. Cài đặt Backend
```bash
cd server
npm install
```
Tạo file `.env` trong thư mục `server`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
```
Chạy backend:
```bash
npm run dev
```

### 3. Cài đặt Frontend
```bash
cd ../client
npm install
```
Tạo file `.env` trong thư mục `client`:
```env
VITE_API_URL=http://localhost:5000/api
```
Chạy frontend:
```bash
npm run dev
```

---

## 🌐 Triển khai (Deployment)

Dự án đã được cấu hình sẵn để triển khai trên:
- **Backend:** [Render](https://render.com/)
- **Frontend:** [Vercel](https://vercel.com/)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

## 🤝 Liên hệ
Được xây dựng với ❤️ bởi **Parklang**. 
Hy vọng ứng dụng này sẽ giúp ích cho hành trình chinh phục Tiếng Anh của bạn!

---
© 2026 ParkLanguage. All rights reserved.
