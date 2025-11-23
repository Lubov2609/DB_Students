const express = require('express');
const router = express.Router();
const db = require('../db');


router.get('/', async (_, res) => {
const r = await db.query('SELECT * FROM lecturers ORDER BY lecturer_id');
res.json(r.rows);
});


router.post('/', async (req, res) => {
const { first_name, last_name, email, phone_number, department, hire_date } = req.body;
const r = await db.query(
`INSERT INTO lecturers(first_name,last_name,email,phone_number,department,hire_date)
VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
[first_name, last_name, email, phone_number, department, hire_date]
);
res.json(r.rows[0]);
});


module.exports = router;