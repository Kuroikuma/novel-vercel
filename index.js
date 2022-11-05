require("./db/mongoDB.js");
const express = require("express");

const bodyParser = require("body-parser");
const cors = require("cors");

const routes = require("./routes");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use("/", routes());

app.use((error, request, response, next) => {
  console.error(error.name);
  switch (error.name) {
    case "CastError":
      response.status(400).send({ error: "id mal formado" });
      break;
    case "ReferenceError":
      response.status(500).send({ error: "Error interno" });
      break;
    default:
      response.status(500).end();
      break;
  }
});

app.listen( 3001, function () {
  console.log(`Server de Portafolio levantado en Port:${process.env.PORT}`);
});

