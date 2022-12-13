const { request, response } = require("../app");
const { selectReviews, selectCategories  } = require("../models/board-game-review-models");



exports.getCategories = (req, res) => {
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

