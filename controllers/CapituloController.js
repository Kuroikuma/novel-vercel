const Capitulo = require("../models/CapitulosModel");
const Novela = require("../models/NovelasModel");

exports.add = async (req, res, next) => {
  const capitulo = new Capitulo(req.body);

  try {
    const capituloSaved = await capitulo.save();

    const novela = await Novela.findById(capituloSaved.novelas);

    novela.capitulos.push(capituloSaved._id);

    novela.save();

    res.json(capituloSaved);
  } catch (error) {
    next(error);
  }
};

exports.show = (req, res, next) => {
  Capitulo.find({})
    .then((respuesta) => {
      res.status(200).json(respuesta);
    })
    .catch((error) => next(error));
};

exports.showById = (req, res, next) => {
  const id = req.params.id;
  Capitulo.findById(id)
    .then((respuesta) => {
      res.status(200).json(respuesta);
    })
    .catch((error) => next(error));
};

exports.deleteById = (req, res, next) => {
  const id = req.params.id;
  Capitulo.findByIdAndRemove(id)
    .then((respuesta) => {
      res.status(204).send(respuesta);
    })
    .catch((error) => next(error));
};

exports.pagination = async (req, res, next) => {
   console.log(req.get('host'));
  const numero = parseInt(req.query.id);
  console.log(numero);

  try {
    const result = await Capitulo.find({ numero: numero });
    const response = {
      result: result,
      next: `https://${req.get('host')}/api/paginacionCapitulo?id=${numero + 1}`,
      previous: `https://${req.get('host')}/api/paginacionCapitulo?id=${numero - 1}`,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
