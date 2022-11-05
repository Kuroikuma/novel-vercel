const { Schema, model } = require("mongoose");

const novelaSchema = new Schema({
  capitulos: [
    {
      type: Schema.Types.ObjectId,
      ref: "Capitulo",
    },
  ],
  imagen: String,
  nombre: String,
  sinopsis: String,
  numeroCapitulos: Number,
});

novelaSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Novela = model("Novela", novelaSchema);

module.exports = Novela;
