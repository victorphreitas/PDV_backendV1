const express = require('express')
const rotas = express()

const { listarCategorias } = require('./controladores/categorias')
const { cadastrarUsuario } = require('./controladores/usuarios')
const validarRequisicao = require('./intermediarios/validarRequisicao')
const usuarioSchema = require('./validacoes/usuarioSchema')

rotas.post('/usuario', validarRequisicao(usuarioSchema), cadastrarUsuario)
rotas.get('/categoria', listarCategorias)

module.exports = rotas
