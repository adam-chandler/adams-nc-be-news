const express = require("express");
const app = express();
const apiRouter = require("./routes/api.route");
const {
  handleCustomErrors,
  handlePSQLErrors,
  handleUnknownRoutes,
  serverError,
} = require("./errors/errors");

app.use(express.json());

app.use("/api", apiRouter);
app.all("/*", handleUnknownRoutes);

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(serverError);

module.exports = app;
