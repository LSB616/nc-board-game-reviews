const { request, response } = require("../app");

const { selectReviews, selectCategories, selectReview, selectComment, insertComment, selectUsers  } = require("../models/board-game-review-models");
const { checkIfReviewIdExists, isIdValid, isCommentValid } = require('../controllers/controller_functions');

exports.getCategories = (req, res, next) => {
    selectCategories()
    .then((categories) => {
        res.status(200).send({categories})
    })
    .catch((err) => {
        next(err);
    });
};

exports.getReviews = (req, res, next) => {
    selectReviews()
    .then((reviews) => {
        res.status(200).send({reviews})
    })
    .catch((err) => {
        next(err)
    });
};      
        
exports.getReview = (req, res, next) => {
    const id = req.params.review_id
    Promise.all([checkIfReviewIdExists(id), isIdValid(id), selectReview(id)])
    .then(([idExists, isValidId, review]) => {
        res.status(200).send({review})
    })
    .catch((err) => {
        next(err);
    });
};

exports.getComments = (req, res, next) => {
    const id = req.params.review_id;
    Promise.all([checkIfReviewIdExists(id), isIdValid(id), selectComment(id)])
    .then(([idExists, isValidId, comments]) => {
        res.status(200).send({comments})
     })
    .catch((err) => {
        next(err);
    });
};

exports.newComment = (req, res, next) => {
    const comment = req.body
    const id = req.params.review_id

    Promise.all([isCommentValid(comment), insertComment(comment, id)])
    .then(([idExists, amendedComment]) => {
        res.status(201).send({ amendedComment })
    })
    .catch((err) => {
        next(err)
    });
  };
















  exports.getUsers = (req, res, next) => {
    selectUsers()
    .then((users) => {
        res.status(200).send({users})
    })
    .catch((err) => {
        next(err);
    });
};
