const { response } = require("express");
const { query } = require("../db/connection");
const db = require("../db/connection");
const { read } = require("fs");
const fs = require('fs/promises');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { type } = require("os");

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
            WHERE reviews.review_id = $1
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

exports.updateReviewVotes = (votes, id) => {
    return  db
            .query(`UPDATE reviews SET votes = $1 + (SELECT votes FROM reviews WHERE review_id = $2) WHERE review_id = $2 RETURNING *;`, [votes.inc_votes, id])
            .then(({ rows }) => {
                return rows[0];
            });
};

exports.updateReview = (updatedReview, id) => {
    const { title, category, designer, review_body, review_img_url } = updatedReview;
    return  db
            .query(`UPDATE reviews SET title = $1, category = $2, designer = $3, review_body = $4, review_img_url = $5 WHERE review_id = $6 RETURNING *;`, [title, category, designer, review_body, review_img_url, id])
            .then(({ rows }) => {
                return rows[0]
            });
}

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

exports.insertUser = async (user) => {
    const { username, name, avatar_url, email, password } = user;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return  db
            .query(`INSERT INTO users (username, name, avatar_url, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *;`, [username, name, avatar_url, email, hashedPassword])
            .then(({ rows }) => {
                return rows[0]
            })
}

exports.updateComment = (votes, id) => {
    return  db
            .query(`UPDATE comments SET votes = $1 + (SELECT votes FROM comments WHERE comment_id = $2) WHERE comment_id = $2 RETURNING *;`, [votes.inc_votes, id])
            .then(({ rows }) => {
                return rows[0];
            });
};

exports.insertReview = (review) => {
    const { owner, title, review_body, designer, category, review_img_url } = review;
    return  db
            .query(`INSERT INTO reviews (owner, title, review_body, designer, category, review_img_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
            [owner, title, review_body, designer, category, review_img_url])
            .then(({ rows }) => {
            return {...rows[0],
            comment_count: 0}
            });
};

exports.removeReview = (id) => {
    return  db
            .query(`DELETE FROM reviews WHERE review_id = $1;`, [id])
            .then(({ rows }) => rows)
}

const generateToken = (username) => {
  return jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

exports.login = async (userCreds) => {
    const { username, password } = userCreds;
  
    const user = await db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({ rows }) => rows[0])
  
    // && ()

    if (bcrypt.compare(password, user.password)) {
        return user
        // let userData = {username: user.username,
        // name: user.name,
        // avatar_url: user.avatar_url,
        // email: user.email,
        // token: generateToken(user.username)}
        // return userData
    } else {
        return Promise.reject({ status: 401, msg: 'Unauthorized'})
    }
  };