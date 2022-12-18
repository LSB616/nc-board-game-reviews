const { response } = require("express");
const { query } = require("../db/connection");
const db = require("../db/connection");
const { read } = require("fs");
const fs = require('fs/promises');

exports.selectCategories = () => {
    return  db
            .query(`SELECT * FROM categories;`)
            .then(({ rows }) => rows);
};

exports.selectReviews = (category, sortBy = 'created_at', order = 'desc') => {
const validSortByQueries = ['owner', 'title', 'category', 'designer', 'created_at'];
const validOrderQueries = ['asc', 'desc']
const queryValues = [];

if (!validSortByQueries.includes(sortBy) || !validOrderQueries.includes(order)){
    return Promise.reject({ status: 400, msg: 'Bad Request' });
}

let queryString = `SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, 
reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer,
COUNT(comments.review_id)
AS comment_count 
FROM reviews 
LEFT JOIN comments 
ON reviews.review_id = comments.review_id
GROUP BY reviews.review_id`

if (category !== undefined){
    queryString = queryString.replace(`GROUP BY reviews.review_id`, ` WHERE category = $1 
    GROUP BY reviews.review_id`)
    queryValues.push(category);
}

if (validSortByQueries.includes(sortBy) && sortBy === 'title'){
    queryString += ` ORDER BY ${sortBy} COLLATE "C" ${order}`
} else if (validSortByQueries.includes(sortBy) && sortBy !== 'title') {
    queryString += ` ORDER BY ${sortBy} ${order}`
};

    queryString += ';'
    return  db
            .query(queryString, queryValues)
            .then(({ rows }) => rows)
};


exports.selectReview = (id) => {
    return  db
            .query(`SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, 
            reviews.review_img_url, reviews.created_at, reviews.votes, reviews.review_body, reviews.designer,
            COUNT(comments.review_id)
            AS comment_count
            FROM reviews 
            LEFT JOIN comments 
            ON reviews.review_id = comments.review_id 
            WHERE comments.review_id = $1
            GROUP BY reviews.review_id;`, [id])
            .then(({ rows }) => {
            return rows[0]});
};





exports.selectComment = (id) => {
    return  db
            .query(`SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC`, [id])
            .then(({ rows }) => rows)
};

exports.insertComment = (comment, id) => {
    const { username, body } = comment
    return  db
            .query(`INSERT INTO comments (body, review_id, author, votes) VALUES ($1, $2, $3, $4) RETURNING *;`,
            [body, id, username, 0])
            .then(({ rows }) => {
                return rows
            });
};

exports.updateReview = (votes, id) => {
    return  db
            .query(`UPDATE reviews SET votes = $1 + (SELECT votes FROM reviews WHERE review_id = $2) WHERE review_id = $2 RETURNING *;`, [votes.inc_votes, id])
            .then(({ rows }) => {
                return rows[0];
            });
};

exports.selectUsers = () => {
    return  db
    .query(`SELECT * FROM users;`)
    .then(({ rows }) => rows);
};

exports.removeComment = (id) => {
    return  db
            .query(`DELETE FROM comments WHERE comment_id = $1;`, [id])
            .then(({ rows }) => rows)
};

exports.returnApi = () => {
    return fs.readFile(`./endpoints.json`, 'utf-8')
    .then((endPoints) => JSON.parse(endPoints))
}

exports.selectUser = (username) => {
    return  db
            .query(`SELECT * FROM users WHERE username = $1`, [username])
            .then(({ rows }) => rows[0])
};

exports.updateComment = (votes, id) => {
    return  db
            .query(`UPDATE comments SET votes = $1 + (SELECT votes FROM comments WHERE comment_id = $2) WHERE comment_id = $2 RETURNING *;`, [votes.inc_votes, id])
            .then(({ rows }) => {
                return rows[0];
            });
};