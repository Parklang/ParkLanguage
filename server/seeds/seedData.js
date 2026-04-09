const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const Vocabulary = require('../models/Vocabulary');

dotenv.config();

const lessons = [
  {
    title: 'Greetings & Introductions', titleVi: 'Chào hỏi & Giới thiệu',
    description: 'Learn how to greet people and introduce yourself in English.',
    level: 'A1', category: 'conversation', order: 1, xpReward: 50, estimatedMinutes: 10,
    content: [
      { type: 'explanation', titleVi: 'Cách chào hỏi cơ bản', textEn: 'In English, we use different greetings depending on the time of day and the situation.', textVi: 'Trong tiếng Anh, chúng ta sử dụng các lời chào khác nhau tùy theo thời gian trong ngày và tình huống.' },
      { type: 'example', titleVi: 'Ví dụ', textEn: '"Hello!" - A universal greeting.\n"Good morning!" - Used before noon.\n"Good afternoon!" - Used from noon to 6 PM.\n"Good evening!" - Used after 6 PM.', textVi: '"Hello!" - Lời chào phổ biến.\n"Good morning!" - Dùng trước buổi trưa.\n"Good afternoon!" - Dùng từ trưa đến 6 PM.\n"Good evening!" - Dùng sau 6 PM.' },
      { type: 'explanation', titleVi: 'Giới thiệu bản thân', textEn: 'To introduce yourself:\n"My name is [name]." or "I\'m [name]."\n"Nice to meet you!"', textVi: 'Để giới thiệu bản thân:\n"My name is [tên]." hoặc "I\'m [tên]."\n"Nice to meet you!" - Rất vui được gặp bạn!' },
      { type: 'practice', titleVi: 'Thực hành', textEn: 'Try saying:\n1. "Hello, my name is Park."\n2. "Good morning! How are you?"\n3. "Nice to meet you!"', textVi: 'Hãy thử nói các câu sau thật to!' },
      { type: 'tip', titleVi: 'Mẹo', textEn: 'Maintain eye contact and smile when meeting someone new!', textVi: 'Giao tiếp bằng mắt và mỉm cười khi gặp người mới!' }
    ]
  },
  {
    title: 'Numbers & Counting', titleVi: 'Số đếm',
    description: 'Master numbers from 1 to 100 in English.',
    level: 'A1', category: 'vocabulary', order: 2, xpReward: 50, estimatedMinutes: 12,
    content: [
      { type: 'explanation', titleVi: 'Số từ 1-10', textEn: '1-One, 2-Two, 3-Three, 4-Four, 5-Five\n6-Six, 7-Seven, 8-Eight, 9-Nine, 10-Ten', textVi: 'Hãy nhớ phát âm chuẩn cho từng số!' },
      { type: 'example', titleVi: 'Dùng số trong câu', textEn: '"I have two cats."\n"She is ten years old."\n"There are five apples."', textVi: 'Số đếm thường đứng trước danh từ.' },
      { type: 'tip', titleVi: 'Mẹo nhớ', textEn: 'Practice counting in English throughout the day!', textVi: 'Tập đếm bằng tiếng Anh suốt cả ngày!' }
    ]
  },
  {
    title: 'Colors & Descriptions', titleVi: 'Màu sắc & Mô tả',
    description: 'Learn colors and basic adjectives.',
    level: 'A1', category: 'vocabulary', order: 3, xpReward: 50, estimatedMinutes: 10,
    content: [
      { type: 'explanation', titleVi: 'Các màu cơ bản', textEn: 'Red, Blue, Green, Yellow, Orange, Purple, Pink, White, Black, Brown', textVi: 'Đỏ, Xanh dương, Xanh lá, Vàng, Cam, Tím, Hồng, Trắng, Đen, Nâu' },
      { type: 'example', titleVi: 'Sử dụng trong câu', textEn: '"The sky is blue." - "I like red flowers."', textVi: 'Tính từ màu sắc đứng trước danh từ: "red car", "blue sky"' }
    ]
  },
  {
    title: 'Family Members', titleVi: 'Các thành viên gia đình',
    description: 'Learn vocabulary about family relationships.',
    level: 'A1', category: 'vocabulary', order: 4, xpReward: 50, estimatedMinutes: 12,
    content: [
      { type: 'explanation', titleVi: 'Gia đình cơ bản', textEn: 'Father (Dad), Mother (Mom), Brother, Sister, Son, Daughter', textVi: 'Bố, Mẹ, Anh/Em trai, Chị/Em gái, Con trai, Con gái' },
      { type: 'example', titleVi: 'Giới thiệu gia đình', textEn: '"This is my mother."\n"I have two brothers."', textVi: 'Dùng "my" trước các từ về gia đình.' }
    ]
  },
  {
    title: 'Daily Routines', titleVi: 'Thói quen hàng ngày',
    description: 'Talk about your daily activities.',
    level: 'A1', category: 'conversation', order: 5, xpReward: 60, estimatedMinutes: 15,
    content: [
      { type: 'explanation', titleVi: 'Hoạt động hàng ngày', textEn: 'wake up, eat breakfast, go to school/work, have lunch, go home, have dinner, go to bed', textVi: 'thức dậy, ăn sáng, đi học/đi làm, ăn trưa, về nhà, ăn tối, đi ngủ' },
      { type: 'example', titleVi: 'Kể về một ngày', textEn: '"I wake up at 7 AM."\n"I eat breakfast at 7:30."', textVi: 'Dùng "at" + giờ để nói về thời gian.' }
    ]
  },
  {
    title: 'Present Simple Tense', titleVi: 'Thì hiện tại đơn',
    description: 'Master the most common English tense.',
    level: 'A2', category: 'grammar', order: 6, xpReward: 70, estimatedMinutes: 18,
    content: [
      { type: 'explanation', titleVi: 'Cấu trúc', textEn: 'Positive: S + V(s/es)\nNegative: S + do/does + not + V\nQuestion: Do/Does + S + V?', textVi: 'Diễn tả thói quen, sự thật chung.' },
      { type: 'tip', titleVi: 'Quy tắc S/ES', textEn: 'Add -s: work→works\nAdd -es: go→goes, watch→watches\nChange y→ies: study→studies', textVi: 'Thêm -es khi động từ kết thúc bằng -o, -ch, -sh, -ss, -x, -z.' }
    ]
  },
  {
    title: 'Food & Drinks', titleVi: 'Thức ăn & Đồ uống',
    description: 'Order food and talk about meals.',
    level: 'A2', category: 'vocabulary', order: 7, xpReward: 60, estimatedMinutes: 14,
    content: [
      { type: 'explanation', titleVi: 'Từ vựng đồ ăn', textEn: 'rice, bread, chicken, beef, fish, egg, noodles, soup, salad, pizza', textVi: 'cơm, bánh mì, gà, bò, cá, trứng, mì, súp, rau trộn, pizza' },
      { type: 'example', titleVi: 'Gọi món', textEn: '"Can I have a coffee, please?"\n"I\'d like some rice and chicken."', textVi: 'Dùng "Can I have...?" hoặc "I\'d like..."' }
    ]
  },
  {
    title: 'Past Simple Tense', titleVi: 'Thì quá khứ đơn',
    description: 'Talk about past events.',
    level: 'A2', category: 'grammar', order: 8, xpReward: 70, estimatedMinutes: 20,
    content: [
      { type: 'explanation', titleVi: 'Cấu trúc', textEn: 'Regular: add -ed (worked, played)\nIrregular: go→went, eat→ate, have→had', textVi: 'Diễn tả hành động đã xảy ra và kết thúc trong quá khứ.' },
      { type: 'example', titleVi: 'Ví dụ', textEn: '"I went to school yesterday."\n"She ate pizza last night."', textVi: 'Từ chỉ thời gian: yesterday, last night, ago.' }
    ]
  },
  {
    title: 'Travel & Directions', titleVi: 'Du lịch & Chỉ đường',
    description: 'Navigate and ask for directions.',
    level: 'B1', category: 'conversation', order: 9, xpReward: 80, estimatedMinutes: 18,
    content: [
      { type: 'explanation', titleVi: 'Hỏi đường', textEn: '"Excuse me, how do I get to the station?"\n"Where is the nearest bank?"', textVi: 'Luôn bắt đầu bằng "Excuse me".' },
      { type: 'example', titleVi: 'Chỉ đường', textEn: '"Go straight ahead."\n"Turn left at the traffic lights."\n"It\'s on your right."', textVi: 'straight=thẳng, left=trái, right=phải.' }
    ]
  },
  {
    title: 'Present Perfect Tense', titleVi: 'Thì hiện tại hoàn thành',
    description: 'Connect past to present.',
    level: 'B1', category: 'grammar', order: 10, xpReward: 80, estimatedMinutes: 22,
    content: [
      { type: 'explanation', titleVi: 'Cấu trúc', textEn: 'S + have/has + Past Participle\n"I have visited Paris."\n"She has lived here for 5 years."', textVi: 'Hành động bắt đầu trong quá khứ, còn liên quan đến hiện tại.' },
      { type: 'tip', titleVi: 'Since vs For', textEn: 'Since + point in time: "since 2020"\nFor + duration: "for 3 years"', textVi: 'Since = kể từ, For = trong (khoảng thời gian).' }
    ]
  }
];

const vocabulary = [
  { word: 'Hello', pronunciation: '/həˈloʊ/', meaningVi: 'Xin chào', partOfSpeech: 'interjection', exampleEn: 'Hello, how are you?', exampleVi: 'Xin chào, bạn khỏe không?', category: 'greetings', difficulty: 'easy' },
  { word: 'Goodbye', pronunciation: '/ɡʊdˈbaɪ/', meaningVi: 'Tạm biệt', partOfSpeech: 'interjection', exampleEn: 'Goodbye, see you tomorrow!', exampleVi: 'Tạm biệt, hẹn gặp lại!', category: 'greetings', difficulty: 'easy' },
  { word: 'Thank you', pronunciation: '/θæŋk juː/', meaningVi: 'Cảm ơn', partOfSpeech: 'phrase', exampleEn: 'Thank you very much!', exampleVi: 'Cảm ơn rất nhiều!', category: 'greetings', difficulty: 'easy' },
  { word: 'Please', pronunciation: '/pliːz/', meaningVi: 'Làm ơn', partOfSpeech: 'adverb', exampleEn: 'Please sit down.', exampleVi: 'Làm ơn ngồi xuống.', category: 'greetings', difficulty: 'easy' },
  { word: 'Sorry', pronunciation: '/ˈsɒri/', meaningVi: 'Xin lỗi', partOfSpeech: 'adjective', exampleEn: 'I\'m sorry for being late.', exampleVi: 'Xin lỗi vì đến muộn.', category: 'greetings', difficulty: 'easy' },
  { word: 'One', pronunciation: '/wʌn/', meaningVi: 'Một', partOfSpeech: 'number', exampleEn: 'I have one brother.', exampleVi: 'Tôi có một anh trai.', category: 'numbers', difficulty: 'easy' },
  { word: 'Two', pronunciation: '/tuː/', meaningVi: 'Hai', partOfSpeech: 'number', exampleEn: 'She has two cats.', exampleVi: 'Cô ấy có hai con mèo.', category: 'numbers', difficulty: 'easy' },
  { word: 'Three', pronunciation: '/θriː/', meaningVi: 'Ba', partOfSpeech: 'number', exampleEn: 'Three books on the table.', exampleVi: 'Ba quyển sách trên bàn.', category: 'numbers', difficulty: 'easy' },
  { word: 'Red', pronunciation: '/rɛd/', meaningVi: 'Đỏ', partOfSpeech: 'adjective', exampleEn: 'The apple is red.', exampleVi: 'Quả táo màu đỏ.', category: 'colors', difficulty: 'easy' },
  { word: 'Blue', pronunciation: '/bluː/', meaningVi: 'Xanh dương', partOfSpeech: 'adjective', exampleEn: 'The sky is blue.', exampleVi: 'Bầu trời màu xanh.', category: 'colors', difficulty: 'easy' },
  { word: 'Green', pronunciation: '/ɡriːn/', meaningVi: 'Xanh lá', partOfSpeech: 'adjective', exampleEn: 'The grass is green.', exampleVi: 'Cỏ màu xanh lá.', category: 'colors', difficulty: 'easy' },
  { word: 'Father', pronunciation: '/ˈfɑːðər/', meaningVi: 'Bố', partOfSpeech: 'noun', exampleEn: 'My father is a teacher.', exampleVi: 'Bố tôi là giáo viên.', category: 'family', difficulty: 'easy' },
  { word: 'Mother', pronunciation: '/ˈmʌðər/', meaningVi: 'Mẹ', partOfSpeech: 'noun', exampleEn: 'My mother cooks well.', exampleVi: 'Mẹ tôi nấu ăn giỏi.', category: 'family', difficulty: 'easy' },
  { word: 'Brother', pronunciation: '/ˈbrʌðər/', meaningVi: 'Anh/Em trai', partOfSpeech: 'noun', exampleEn: 'I have one brother.', exampleVi: 'Tôi có một anh trai.', category: 'family', difficulty: 'easy' },
  { word: 'Sister', pronunciation: '/ˈsɪstər/', meaningVi: 'Chị/Em gái', partOfSpeech: 'noun', exampleEn: 'My sister is 15.', exampleVi: 'Chị gái tôi 15 tuổi.', category: 'family', difficulty: 'easy' },
  { word: 'Breakfast', pronunciation: '/ˈbrɛkfəst/', meaningVi: 'Bữa sáng', partOfSpeech: 'noun', exampleEn: 'I eat breakfast at 7.', exampleVi: 'Tôi ăn sáng lúc 7 giờ.', category: 'daily', difficulty: 'easy' },
  { word: 'School', pronunciation: '/skuːl/', meaningVi: 'Trường học', partOfSpeech: 'noun', exampleEn: 'I go to school every day.', exampleVi: 'Tôi đi học mỗi ngày.', category: 'daily', difficulty: 'easy' },
  { word: 'Work', pronunciation: '/wɜːrk/', meaningVi: 'Làm việc', partOfSpeech: 'verb', exampleEn: 'I work from 9 to 5.', exampleVi: 'Tôi làm việc từ 9-5.', category: 'daily', difficulty: 'easy' },
  { word: 'Chicken', pronunciation: '/ˈtʃɪkɪn/', meaningVi: 'Thịt gà', partOfSpeech: 'noun', exampleEn: 'I\'d like some chicken.', exampleVi: 'Cho tôi ít gà.', category: 'food', difficulty: 'easy' },
  { word: 'Rice', pronunciation: '/raɪs/', meaningVi: 'Cơm', partOfSpeech: 'noun', exampleEn: 'We eat rice every day.', exampleVi: 'Chúng tôi ăn cơm mỗi ngày.', category: 'food', difficulty: 'easy' },
  { word: 'Water', pronunciation: '/ˈwɔːtər/', meaningVi: 'Nước', partOfSpeech: 'noun', exampleEn: 'Can I have some water?', exampleVi: 'Cho tôi xin ít nước?', category: 'food', difficulty: 'easy' },
  { word: 'Coffee', pronunciation: '/ˈkɒfi/', meaningVi: 'Cà phê', partOfSpeech: 'noun', exampleEn: 'I drink coffee every morning.', exampleVi: 'Tôi uống cà phê mỗi sáng.', category: 'food', difficulty: 'easy' },
  { word: 'Yesterday', pronunciation: '/ˈjɛstərdeɪ/', meaningVi: 'Hôm qua', partOfSpeech: 'adverb', exampleEn: 'I went to the park yesterday.', exampleVi: 'Tôi đi công viên hôm qua.', category: 'time', difficulty: 'medium' },
  { word: 'Airport', pronunciation: '/ˈɛrpɔːrt/', meaningVi: 'Sân bay', partOfSpeech: 'noun', exampleEn: 'The airport is far.', exampleVi: 'Sân bay ở xa.', category: 'travel', difficulty: 'medium' },
  { word: 'Beautiful', pronunciation: '/ˈbjuːtɪfʊl/', meaningVi: 'Đẹp', partOfSpeech: 'adjective', exampleEn: 'What a beautiful day!', exampleVi: 'Ngày đẹp quá!', category: 'adjectives', difficulty: 'medium' },
  { word: 'Important', pronunciation: '/ɪmˈpɔːrtənt/', meaningVi: 'Quan trọng', partOfSpeech: 'adjective', exampleEn: 'This is very important.', exampleVi: 'Điều này rất quan trọng.', category: 'adjectives', difficulty: 'medium' },
  { word: 'Understand', pronunciation: '/ˌʌndərˈstænd/', meaningVi: 'Hiểu', partOfSpeech: 'verb', exampleEn: 'I understand English.', exampleVi: 'Tôi hiểu tiếng Anh.', category: 'daily', difficulty: 'medium' },
  { word: 'Experience', pronunciation: '/ɪkˈspɪriəns/', meaningVi: 'Kinh nghiệm', partOfSpeech: 'noun', exampleEn: 'I have experience.', exampleVi: 'Tôi có kinh nghiệm.', category: 'work', difficulty: 'hard' },
  { word: 'Restaurant', pronunciation: '/ˈrɛstərɒnt/', meaningVi: 'Nhà hàng', partOfSpeech: 'noun', exampleEn: 'Let\'s go to a restaurant.', exampleVi: 'Hãy đi nhà hàng.', category: 'food', difficulty: 'medium' },
  { word: 'Station', pronunciation: '/ˈsteɪʃən/', meaningVi: 'Nhà ga', partOfSpeech: 'noun', exampleEn: 'How do I get to the station?', exampleVi: 'Đến nhà ga thế nào?', category: 'travel', difficulty: 'medium' },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Lesson.deleteMany({});
    await Quiz.deleteMany({});
    await Vocabulary.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Seed Lessons
    const createdLessons = await Lesson.insertMany(lessons);
    console.log(`📚 Seeded ${createdLessons.length} lessons`);

    // Seed Quizzes (linked to lessons)
    const quizzes = [
      {
        lessonId: createdLessons[0]._id, title: 'Greetings Quiz', timeLimit: 120, xpReward: 30,
        questions: [
          { questionText: 'How do you say "Xin chào" in English?', questionTextVi: '"Xin chào" bằng tiếng Anh?', type: 'mcq', options: ['Goodbye', 'Hello', 'Thank you', 'Sorry'], correctAnswer: 'Hello', explanationVi: '"Hello" = "Xin chào".', points: 10 },
          { questionText: 'Which greeting is used in the morning?', questionTextVi: 'Lời chào nào dùng vào buổi sáng?', type: 'mcq', options: ['Good evening', 'Good night', 'Good morning', 'Good bye'], correctAnswer: 'Good morning', explanationVi: '"Good morning" dùng trước 12 giờ trưa.', points: 10 },
          { questionText: 'Complete: "Nice to ____ you!"', questionTextVi: 'Điền: "Nice to ____ you!"', type: 'fill', options: ['see', 'meet', 'have', 'get'], correctAnswer: 'meet', explanationVi: '"Nice to meet you!" = "Rất vui được gặp bạn!"', points: 10 },
          { questionText: 'What does "My name is Park" mean?', questionTextVi: '"My name is Park" nghĩa là gì?', type: 'mcq', options: ['Tôi là Park', 'Tên tôi là Park', 'Park là bạn tôi', 'Tôi thích Park'], correctAnswer: 'Tên tôi là Park', explanationVi: '"My name is..." = "Tên tôi là..."', points: 10 },
          { questionText: 'Correct response to "How are you?"', questionTextVi: 'Trả lời "How are you?"', type: 'mcq', options: ['My name is Park', 'I\'m fine, thank you', 'Good morning', 'Nice to meet you'], correctAnswer: 'I\'m fine, thank you', explanationVi: '"I\'m fine, thank you" = "Tôi khỏe, cảm ơn".', points: 10 }
        ]
      },
      {
        lessonId: createdLessons[1]._id, title: 'Numbers Quiz', timeLimit: 90, xpReward: 30,
        questions: [
          { questionText: 'What number is "seven"?', questionTextVi: '"Seven" là số mấy?', type: 'mcq', options: ['5', '6', '7', '8'], correctAnswer: '7', explanationVi: 'Seven = 7.', points: 10 },
          { questionText: 'How do you say "10" in English?', questionTextVi: 'Số 10 tiếng Anh?', type: 'mcq', options: ['Twelve', 'Ten', 'Twenty', 'Two'], correctAnswer: 'Ten', explanationVi: 'Ten = 10.', points: 10 },
          { questionText: '"I have ____ cats" (3)', questionTextVi: 'Điền số 3', type: 'fill', options: ['tree', 'three', 'thee', 'free'], correctAnswer: 'three', explanationVi: 'Three = 3.', points: 10 }
        ]
      },
      {
        lessonId: createdLessons[2]._id, title: 'Colors Quiz', timeLimit: 90, xpReward: 30,
        questions: [
          { questionText: 'What color is the sky?', questionTextVi: 'Bầu trời màu gì?', type: 'mcq', options: ['Red', 'Green', 'Blue', 'Yellow'], correctAnswer: 'Blue', explanationVi: 'The sky is blue.', points: 10 },
          { questionText: 'What color is grass?', questionTextVi: 'Cỏ màu gì?', type: 'mcq', options: ['Green', 'Blue', 'Red', 'White'], correctAnswer: 'Green', explanationVi: 'Grass is green.', points: 10 }
        ]
      },
      {
        lessonId: createdLessons[4]._id, title: 'Daily Routines Quiz', timeLimit: 120, xpReward: 35,
        questions: [
          { questionText: 'What do you do first in the morning?', questionTextVi: 'Việc đầu tiên vào sáng?', type: 'mcq', options: ['Go to bed', 'Have dinner', 'Wake up', 'Go home'], correctAnswer: 'Wake up', explanationVi: 'Wake up = thức dậy.', points: 10 },
          { questionText: '"I ____ breakfast at 7 AM."', questionTextVi: 'Điền động từ', type: 'fill', options: ['eat', 'go', 'make', 'take'], correctAnswer: 'eat', explanationVi: '"Eat breakfast" = ăn sáng.', points: 10 }
        ]
      },
      {
        lessonId: createdLessons[5]._id, title: 'Present Simple Quiz', timeLimit: 150, xpReward: 40,
        questions: [
          { questionText: '"She ____ to school every day."', questionTextVi: 'Chia động từ go', type: 'mcq', options: ['go', 'goes', 'going', 'gone'], correctAnswer: 'goes', explanationVi: 'She/He/It + V-s/es: go → goes.', points: 10 },
          { questionText: 'Negative: "He ____ football."', questionTextVi: 'Phủ định', type: 'mcq', options: ['don\'t play', 'doesn\'t play', 'not plays', 'doesn\'t plays'], correctAnswer: 'doesn\'t play', explanationVi: 'He + doesn\'t + V nguyên mẫu.', points: 10 },
          { questionText: '"They ____ English."', questionTextVi: 'Chia "study"', type: 'mcq', options: ['studies', 'study', 'studys', 'studying'], correctAnswer: 'study', explanationVi: 'They + V nguyên mẫu.', points: 10 }
        ]
      }
    ];
    const createdQuizzes = await Quiz.insertMany(quizzes);
    console.log(`📝 Seeded ${createdQuizzes.length} quizzes`);

    // Seed Vocabulary (linked to lessons)
    const vocabWithLessons = vocabulary.map(v => {
      // Match vocab to lesson by category
      let lessonIndex = 0;
      if (v.category === 'greetings') lessonIndex = 0;
      else if (v.category === 'numbers') lessonIndex = 1;
      else if (v.category === 'colors' || v.category === 'adjectives') lessonIndex = 2;
      else if (v.category === 'family') lessonIndex = 3;
      else if (v.category === 'daily') lessonIndex = 4;
      else if (v.category === 'food') lessonIndex = 6;
      else if (v.category === 'time') lessonIndex = 7;
      else if (v.category === 'travel') lessonIndex = 8;
      else if (v.category === 'work') lessonIndex = 9;
      return { ...v, lessonId: createdLessons[lessonIndex]._id };
    });
    const createdVocab = await Vocabulary.insertMany(vocabWithLessons);
    console.log(`💎 Seeded ${createdVocab.length} vocabulary words`);

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDB();
