const Capitulo = require("../models/CapitulosModel");
const Novela = require("../models/NovelasModel");

const mongoose = require('mongoose')

async function findLastInsertedChapter(novelaId) {
    try {
      const lastProduct = await Capitulo.findOne({novelas:novelaId}).sort({ numero: -1 });
  
      if (lastProduct) {
        return lastProduct;
      } else {
        console.log('No se encontraron productos.');
      }
    } catch (error) {
      console.error('Error al buscar el último producto:', error);
    }
  }

async function saveAllChapters(chaptersToSave) {
    let lastChapter = await findLastInsertedChapter(chaptersToSave[0].novelas);
    let lastChapterNumber = lastChapter.numero + 1;

    let chaptersToSaveMap = chaptersToSave.map((chapter) => (
        {
            ...chapter,
            numero: lastChapterNumber++
        }
    ));

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const savedChapters = await Promise.all(
          chaptersToSaveMap.map(async (chapterData) => {
            const chapter = new Capitulo(chapterData);

            const chapterSaved = await chapter.save({ session })

            const novela = await Novela.findById(chapterSaved.novelas);

            novela.capitulos.push(chapterSaved._id);

            novela.save();

            return chapterSaved;
        })
        );

        await session.commitTransaction();
        session.endSession();

        return savedChapters;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}

exports.addAll = async (req, res, next) => {

    let chaptersToSave = req.body.cuerpo.split("SeparacionCapitulo").map((chapter) => {

        return {
            cuerpo :chapter.split("-").slice(1).join("-"),
            novelas : req.body.novelas,
            nombre: chapter.split("-").slice(0,1)[0]
        }
    })

    saveAllChapters(chaptersToSave)
        .then((savedProducts) => {
            console.log('Productos guardados con éxito:', savedProducts);
        })
        .catch((error) => {
            console.error('Error al guardar los productos:', error);
        })
}

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

exports.paginationRange = async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    let novelaId = req.query.novelaId;

    const startIndex = (page - 1) * limit;

    try {
        const items = await Capitulo.find({novelas:novelaId}).sort({ numero: -1 }).skip(startIndex).limit(limit).exec();
        const novela = await Novela.findById(novelaId);

        const response = {
        items: items,
        currentPage: page,
        totalPages: Math.ceil(novela.numeroCapitulos/limit),
        };

        res.json(response);
    } catch (err) {
        next(err);
    }
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
  //console.log(req.get('host'));
  const numero = parseInt(req.query.id);
  
  let novela = req.query.novela;
  novela = novela.split("-").join(" ")
  
  const novelaModel = await Novela.find({nombre: novela });

  try {
    const result = await Capitulo.find({ numero: numero, novelas:novelaModel[0]._id });
    const response = {
      result: result,
      next: numero + 1,
      previous: numero - 1,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
