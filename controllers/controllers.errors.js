const handle404Paths = (req, res, next) => {
    res.status(404).send({ msg: 'Path Not Found'})
};

const handle500Paths = (err, req, res) => {
    res.status(500).send({ msg: 'Internal Server Error'});
};


module.exports = { handle500Paths, handle404Paths }