const { request, response } = require("../app");
const { selectCategories } = require("../models/board-game-review-models");

exports.getApi = (req, res) => {
    res.status(200).send({ message: "ok" });
  };

exports.getCategories = (req, res) => {
    selectCategories()
    .then((categories) => {
        res.status(200).send({categories})
    })
    .catch((err) => {
        next(err);
    });
};


