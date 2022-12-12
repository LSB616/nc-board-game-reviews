const { query } = require("../db/connection");
const db = require("../db/connection");
const { formatReviews } = require('../db/seeds/utils');

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
