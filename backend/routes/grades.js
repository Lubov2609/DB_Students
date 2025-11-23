const express = require('express');
const router = express.Router();
const db = require('../db');

// GET ALL with student last name and course title and created_at
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

// GET by id (with joins)
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

// CREATE (still expects student_id, course_id, semester, final_grade)
router.post('/', async (req, res) => {
    const { student_id, course_id, semester, final_grade } = req.body;
    const r = await db.query(
        `INSERT INTO grades(student_id,course_id,semester,final_grade)
         VALUES($1,$2,$3,$4) RETURNING *`,
        [student_id, course_id, semester, final_grade]
    );
    res.json(r.rows[0]);
});

// NOTE: we intentionally keep no PUT/DELETE for grades as per requirement (or you can keep them)
// If you want to keep PUT/DELETE, uncomment and implement.

module.exports = router;