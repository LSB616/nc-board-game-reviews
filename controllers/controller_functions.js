const db = require("../db/connection");

exports.checkIfReviewIdExists = (id) => {
    return  db
            .query(`SELECT * FROM reviews WHERE review_id = $1;`, [id])
            .then((rows) => {
                if (rows.rowCount === 0) {
                    return Promise.reject({ status: 404, msg: 'ID Not Found' })
                } else {
                    return true;
                };
            });
};

exports.isIdValid = (id) => {
    if (isNaN(+id)){
        return Promise.reject({ status: 400, msg: 'Invalid Id' })
    } else {
        return true;
    }
};

exports.isCommentValid = (comment) => {
const { username, body } = comment;
if (username.length === 0 || body.length === 0){
    return Promise.reject({ status: 400, msg: "Bad Request" })
}
return true;
};


exports.checkIfCategoryExists = (category) => {
    if (category === undefined){
        return true
    };

    return  db
            .query(`SELECT * FROM reviews WHERE category = $1;`, [category])
            .then((rows) => {
                if (rows.rowCount === 0) {
                    return Promise.reject({ status: 404, msg: 'Category Does Not Exist' })
                } else {
                    return true;
                };
            });
};

exports.checkIfCommentIdExists = (id) => {
    return  db
            .query(`SELECT * FROM comments WHERE comment_id = $1;`, [id])
            .then((rows) => {
                if (rows.rowCount === 0) {
                    return Promise.reject({ status: 404, msg: 'ID Not Found' })
                } else {
                    return true;
                };
            });
};

exports.checkIfUserExists = (username) => {
    return  db
            .query(`SELECT * FROM users WHERE username = $1;`, [username])
            .then((rows) => {
                if (rows.rowCount === 0) {
                    return Promise.reject({ status: 404, msg: 'User Does Not Exist' })
                } else {
                    return true;
                };
            });
};
