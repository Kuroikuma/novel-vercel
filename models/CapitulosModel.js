const { Schema, model } = require("mongoose");

const capituloSchema = new Schema({
  novelas: {
    type: Schema.Types.ObjectId,
    ref: "Novela",
  },
  cuerpo: String,
  nombre: String,
  numero: Number,
});

capituloSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Capitulo = model("Capitulo", capituloSchema);

module.exports = Capitulo;
