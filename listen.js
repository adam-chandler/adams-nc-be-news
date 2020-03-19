const app = require("./app");

const { PORT = 9090 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));

// let port = 9091;
// app.listen(port, () => {
//   console.log(`listening on port ${port}...`);
// });
