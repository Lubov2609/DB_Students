const express = require('express');
const router = express.Router();
const db = require('../db');


// GET ALL
router.get('/', async (req, res) => {
const result = await db.query('SELECT * FROM students ORDER BY student_id');
res.json(result.rows);
});


// GET BY ID
router.get('/:id', async (req, res) => {
const r = await db.query('SELECT * FROM students WHERE student_id=$1', [req.params.id]);
res.json(r.rows[0]);
});


// CREATE
router.post('/', async (req, res) => {
const { first_name, last_name, email, phone_number, birth_date } = req.body;
const r = await db.query(
`INSERT INTO students(first_name, last_name, pytronimic, email, phone_number, birth_date)
 VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
[first_name, last_name, pytronimic, email, phone_number, birth_date]
);
res.json(r.rows[0]);
});


// UPDATE
router.put('/:id', async (req, res) => {
const { first_name, last_name, pytronimic, email, phone_number, birth_date } = req.body;
const r = await db.query(
  `UPDATE students 
   SET first_name=$1, last_name=$2, pytronimic=$3, email=$4, phone_number=$5, birth_date=$6
   WHERE student_id=$7
   RETURNING *`,
   [first_name, last_name, pytronimic, email, phone_number, birth_date, req.params.id]
);
res.json(r.rows[0]);
});


// DELETE
router.delete('/:id', async (req, res) => {
await db.query('DELETE FROM students WHERE student_id=$1', [req.params.id]);
res.json({ message: "Deleted" });
});


module.exports = router;