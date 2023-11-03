const express = require('express')
const rotas = express()

const { listarCategorias } = require('./controladores/controladores')

rotas.get('/categoria', listarCategorias)

module.exports = rotas
