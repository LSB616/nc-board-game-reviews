const db = require("../db/connection");

exports.checkIfReviewIdExists = (id) => {
    return  db
            .query(`SELECT * FROM reviews WHERE review_id = $1;`, [id])
            .then((rows) => {
                if (rows.rowCount === 0) {
                    return Promise.reject({ status: 404, msg: 'Not Found' })
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