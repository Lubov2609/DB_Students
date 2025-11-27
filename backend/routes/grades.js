const express = require('express');
const router = express.Router();
const db = require('../db');

// --- 1. GET: оценки конкретного студента (должно идти ПЕРВЫМ!) ---
router.get('/student/:id', async (req, res) => {
  try {
    const studentId = req.params.id;
    const q = `
      SELECT
        g.grade_id,
        g.student_id,
        g.course_id,
        c.title AS course_title,
        g.semester,
        g.final_grade,
        g.created_at
      FROM grades g
      LEFT JOIN courses c ON g.course_id = c.course_id
      WHERE g.student_id = $1
      ORDER BY g.created_at DESC
    `;
    const r = await db.query(q, [studentId]);
    res.json(r.rows);
  } catch (err) {
    console.error('GET /grades/student/:id error', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// --- 2. GET: Все оценки ---
router.get('/', async (_, res) => {
    const r = await db.query(
        `SELECT g.grade_id, g.student_id, s.last_name AS student_last_name,
                g.course_id, c.title AS course_title, g.semester, g.final_grade, g.created_at
         FROM grades g
         LEFT JOIN students s ON g.student_id = s.student_id
         LEFT JOIN courses c ON g.course_id = c.course_id
         ORDER BY g.grade_id`
    );
    res.json(r.rows);
});

// --- 3. GET: Оценка по ID ---
router.get('/:id', async (req, res) => {
    const r = await db.query(
        `SELECT g.grade_id, g.student_id, s.last_name AS student_last_name,
                g.course_id, c.title AS course_title, g.semester, g.final_grade, g.created_at
         FROM grades g
         LEFT JOIN students s ON g.student_id = s.student_id
         LEFT JOIN courses c ON g.course_id = c.course_id
         WHERE g.grade_id = $1`,
        [req.params.id]
    );
    res.json(r.rows[0]);
});

// CREATE
router.post('/', async (req, res) => {
    const { student_id, course_id, semester, final_grade } = req.body;
    const r = await db.query(
        `INSERT INTO grades(student_id,course_id,semester,final_grade)
         VALUES($1,$2,$3,$4) RETURNING *`,
        [student_id, course_id, semester, final_grade]
    );
    res.json(r.rows[0]);
});

module.exports = router;
