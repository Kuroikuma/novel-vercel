
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.json({ hello: "hi!" });
});


app.listen( 3001, function () {
  console.log(`Server de Portafolio levantado en Port:${process.env.PORT}`);
});
