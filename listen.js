const app = require("./app");

let port = 9090;

app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});
