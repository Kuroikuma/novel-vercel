const Novela = require("../models/NovelasModel");

exports.add = (req, res, next) => {
  const novela = new Novela(req.body);

  novela
    .save()
    .then((saveResponse) => {
      res.status(200).json({ mensaje: saveResponse });
    })
    .catch((error) => {
      next(error);
    });
};

exports.show = (req, res, next) => {

  Novela.find({})
    // .populate("capitulos")
    .then((respuesta) => {
      res.status(200).json(respuesta);
    })
    .catch((error) => next(error));
};

exports.showById = (req, res, next) => {
  const id = req.params.id;
  Novela.findById(id)
    .populate("capitulos")
    .then((novela) => {
      res.status(200).json(novela);
    })
    .catch((error) => next(error));
};

exports.deleteById = (req, res, next) => {
  const id = req.params.id;
  Novela.findByIdAndRemove(id)
    .then((novela) => {
      res.status(204).send(novela);
    })
    .catch((error) => next(error));
};
