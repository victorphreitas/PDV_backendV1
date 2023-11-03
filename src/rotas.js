const express = require('express')
const rotas = express()

const { listarCategorias } = require('./controladores/categorias')

rotas.get('/categoria', listarCategorias)

module.exports = rotas
