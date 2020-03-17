const express = require("express");
const app = express();
const apiRouter = require("./routes/api.route");
const {
  handleCustomErrors,
  handlePSQLErrors,
  handleUnknownRoutes
} = require("./errors/errors");

app.use(express.json());

app.use("/api", apiRouter);

app.use(handleCustomErrors);

app.use(handlePSQLErrors);

app.all("/*", handleUnknownRoutes);

module.exports = app;
