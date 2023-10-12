const express = require('express')
const router = express.Router()

const capituloController = require('../controllers/CapituloController')
const novelaController = require('../controllers/NovelaController')

module.exports = function () {
  router.get('/', (req, res) => {
    res.send(`<h1>Hello World<h1>`)
  })
  
  console.log("entra");
  router.post('/api/capitulo', capituloController.add)
  router.post('/api/capitulo/addAll', capituloController.addAll)
  router.get('/api/capitulo', capituloController.show)
  router.get('/api/capitulo/:id', capituloController.showById)
  router.delete('/api/capitulo/:id', capituloController.deleteById)
  router.get('/api/paginacionCapitulo', capituloController.pagination)
  router.get('/api/paginacionCapituloPorRango', capituloController.paginationRange)

  router.post('/api/novela', novelaController.add)
  router.get('/api/novela', novelaController.show)
  router.get('/api/novela/:id', novelaController.showById)
  router.delete('/api/novela/:id', novelaController.deleteById)
  return router
}
