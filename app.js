const express = require("express");
const app = express();
const apiRouter = require("./routes/api.route");
const {
  handleCustomErrors,
  handlePSQLErrors,
  handleUnknownRoutes,
  serverError
} = require("./errors/errors");

app.use(express.json());

app.use("/api", apiRouter);

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(serverError);

app.all("/*", handleUnknownRoutes);

module.exports = app;
