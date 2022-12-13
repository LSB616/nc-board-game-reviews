const { query } = require("../db/connection");
const db = require("../db/connection");
const { formatReviews } = require('../db/seeds/utils');

exports.selectCategories = () => {
    return  db
            .query(`SELECT * FROM categories;`)
            .then(({ rows }) => rows);
};

exports.selectReviews = () => {
    return  db
            .query(`SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, 
            reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer,
            COUNT(comments.review_id)
            AS comment_count 
            FROM reviews 
            LEFT JOIN comments 
            ON reviews.review_id = comments.review_id 
            GROUP BY reviews.review_id
            ORDER BY created_at DESC;`)
            .then(({ rows }) => rows)
};


exports.selectComment = (id) => {
    return  db
            .query(`SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC`, [id])
            .then(({ rows }) => rows)
};

exports.selectReview = (id) => {
    return  db
            .query(`SELECT * FROM reviews WHERE review_id = $1;`, [id])
            .then(({ rows }) => rows);
};

