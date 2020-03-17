const usersRouter = require("express").Router();
const { getUsers } = require("../contollers/users.controllers");
const { send405Error } = require("../errors/errors");

usersRouter
  .route("/:username")
  .get(getUsers)
  .all(send405Error);

module.exports = usersRouter;
