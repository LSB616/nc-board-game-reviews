const { request, response } = require("../app");
const { selectCategories } = require("../models/board-game-review-models");

exports.getCategories = (req, res) => {
    selectCategories()
    .then((categories) => {
        res.status(200).send({categories})
    })
    .catch((err) => {
        next(err);
    });
};


