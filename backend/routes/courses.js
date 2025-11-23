const express = require('express');
const router = express.Router();
const db = require('../db');

// GET ALL with lecturer last name (LEFT JOIN)
router.get('/', async (_, res) => {
    const r = await db.query(
        `SELECT c.course_id, c.title, c.description, c.credits, c.department, c.lecturer_id,
                l.last_name AS lecturer_last_name
         FROM courses c
         LEFT JOIN lecturers l ON c.lecturer_id = l.lecturer_id
         ORDER BY c.course_id`
    );
    res.json(r.rows);
});

// GET by id (with lecturer name)
router.get('/:id', async (req, res) => {
    const r = await db.query(
        `SELECT c.course_id, c.title, c.description, c.credits, c.department, c.lecturer_id,
                l.last_name AS lecturer_last_name
         FROM courses c
         LEFT JOIN lecturers l ON c.lecturer_id = l.lecturer_id
         WHERE c.course_id = $1`,
        [req.params.id]
    );
    res.json(r.rows[0]);
});

// CREATE
router.post('/', async (req, res) => {
    const { title, description, credits, department, lecturer_id } = req.body;
    const r = await db.query(
        `INSERT INTO courses(title,description,credits,department,lecturer_id)
         VALUES($1,$2,$3,$4,$5) RETURNING *`,
        [title, description, credits, department, lecturer_id]
    );
    res.json(r.rows[0]);
});

// UPDATE
router.put('/:id', async (req, res) => {
    const { title, description, credits, department, lecturer_id } = req.body;
    const r = await db.query(
        `UPDATE courses SET title=$1,description=$2,credits=$3,department=$4,lecturer_id=$5
         WHERE course_id=$6 RETURNING *`,
        [title, description, credits, department, lecturer_id, req.params.id]
    );
    res.json(r.rows[0]);
});

// DELETE
router.delete('/:id', async (req, res) => {
    await db.query('DELETE FROM courses WHERE course_id=$1', [req.params.id]);
    res.json({ message: "Deleted" });
});

module.exports = router;