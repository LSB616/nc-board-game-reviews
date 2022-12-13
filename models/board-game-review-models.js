const db = require("../db/connection");

exports.selectCategories = () => {
    return  db
            .query(`SELECT * FROM categories;`)
            .then(({ rows }) => rows);
};



























exports.selectReview = (id) => {
    return  db
            .query(`SELECT * FROM reviews WHERE review_id = $1;`, [id])
            .then(({ rows }) => rows);
};