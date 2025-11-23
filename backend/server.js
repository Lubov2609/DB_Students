// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();


// const app = express();
// app.use(cors());
// app.use(express.json());


// // ROUTES
// app.use('/api/students', require('./routes/students'));
// app.use('/api/lecturers', require('./routes/lecturers'));
// app.use('/api/courses', require('./routes/courses'));
// app.use('/api/grades', require('./routes/grades'));


// app.get('/', (req, res) => {
// res.send('University API is running');
// });


// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// // const express = require('express');
// // const cors = require('cors');
// // const path = require('path');
// // require('dotenv').config();

// // const app = express();

// // // ====================
// // // MIDDLEWARE
// // // ====================
// // app.use(cors());
// // app.use(express.json());

// // // ====================
// // // API ROUTES
// // // ====================
// // app.use('/api/students', require('./routes/students'));
// // app.use('/api/lecturers', require('./routes/lecturers'));
// // app.use('/api/courses', require('./routes/courses'));
// // app.use('/api/grades', require('./routes/grades'));

// // // ====================
// // // FRONTEND STATIC FILES
// // // ====================
// // app.use(express.static(path.join(__dirname, '../frontend')));

// // // Любой GET-запрос, который не попадает под /api, возвращает index.html
// // app.get('*', (req, res) => {
// //     res.sendFile(path.join(__dirname, '../frontend/index.html'));
// // });

// // // ====================
// // // START SERVER
// // // ====================
// // const PORT = process.env.PORT || 8080;
// // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ====================
// API маршруты
// ====================
app.use('/api/students', require('./routes/students'));
app.use('/api/lecturers', require('./routes/lecturers'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/grades', require('./routes/grades'));
app.use('/api/semesters', require('./routes/semesters'));


// ====================
// Отдаём фронтенд
// ====================
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ====================
// Запуск сервера
// ====================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));