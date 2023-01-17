const { request, response } = require("../app");


const { selectReviews, selectCategories, selectReview, selectComment, insertComment, updateReview, selectUsers, removeComment, returnApi, selectUser, updateComment, insertReview, removeReview } = require("../models/board-game-review-models");
const { checkIfReviewIdExists, isIdValid, isCommentValid, checkIfCategoryExists, checkIfCommentIdExists, checkIfUserExists } = require('../controllers/controller_functions');


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
const { category, sort_by, order } = req.query;
    Promise.all([checkIfCategoryExists(category), selectReviews(category, sort_by, order)])
    .then(([checkIfCategoryExists, reviews]) => {
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

exports.postComment = (req, res, next) => {
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


exports.patchReview = (req, res, next) => {
    const id = req.params.review_id;
    const votes = req.body

    Promise.all([checkIfReviewIdExists(id), updateReview(votes, id)])
    .then(([idExists, review]) => {
        res.status(200).send({review})
     })
    .catch((err) => {
        next(err);
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

exports.deleteComment = (req, res, next) => {
    const id = req.params.comment_id
    Promise.all([checkIfCommentIdExists(id), removeComment(id)])
    .then(([checkIfCommentIdExists, comment]) =>{
        res.status(204).send()
    })
    .catch((err) => {
        next(err);
    });
};

exports.getApi = (req, res, next) => {
    returnApi()
    .then((endPoints) => {
        res.status(200).send(endPoints)
    })
    .catch((err) => {
        next(err);
    });  
};

exports.getUser = (req, res, next) => {
    const username = req.params.username

    Promise.all([checkIfUserExists(username), selectUser(username)])
    .then(([checkIfUserExists ,user]) => {
        res.status(200).send({user})
    })
    .catch((err) => {
        next(err);
    });
};

exports.patchComment = (req, res, next) => {
    const id = req.params.comment_id;
    const votes = req.body

    Promise.all([checkIfCommentIdExists(id), updateComment(votes, id)])
    .then(([idExists, comment]) => {
        res.status(200).send({comment})
     })
    .catch((err) => {
        next(err);
    });
};

exports.postReview = (req, res, next) => {
    const review = req.body;
    insertReview(review)
    .then((review) => {
        res.status(201).send({ review })
    })
    .catch((err) => {
        next(err);
    });
};

exports.deleteReview = (req, res, next) => {
    const id = req.params.review_id;

    

    Promise.all([checkIfReviewIdExists(id), removeReview(id)])
    .then(([checkIfReviewIdExists, review]) => {
        res.status(204).send()
    })
    .catch((err) => {
        next(err);
    });
};