const { selectUserByUsername } = require("../models/users.models");

exports.getUsers = (req, res, next) => {
  selectUserByUsername(req.params.username)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};
