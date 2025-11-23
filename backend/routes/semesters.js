const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const result = await db.query("SELECT semester_id, name FROM semesters ORDER BY semester_id");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Ошибка загрузки семестров");
    }
});

module.exports = router;
