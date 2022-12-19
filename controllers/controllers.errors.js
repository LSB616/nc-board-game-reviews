const handlesPsqlErrors = (err, req, res, next) => {
    if(err.code === "22P02") {
        res.status(400).send({ msg: "Bad Request" });
      } else if (err.code === "23503") {
        res.status(400).send({ msg: "Invalid Values" });
      } else {
        next(err);
      }
};

const handleCustomErrors = (err, req, res, next) => {
    if(err.msg && err.status) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        next(err);
    }
};

const handle404Paths = (req, res, next) => {
    res.status(404).send({ msg: 'Path Not Found'})
};

const handle500Paths = (err, req, res) => {
    res.status(500).send({ msg: 'Internal Server Error'});
};


module.exports = { handle500Paths, handle404Paths, handleCustomErrors, handlesPsqlErrors }