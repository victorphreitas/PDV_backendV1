const express = require('express')
const rotas = express()

const { listarCategorias } = require('./controladores/categorias')
const { cadastrarUsuario, loginUsuario } = require('./controladores/usuarios')
const validarRequisicao = require('./intermediarios/validarRequisicao')
const usuarioSchema = require('./validacoes/usuarioSchema')
const loginSchema = require('./validacoes/loginSchema')

rotas.get('/categoria', listarCategorias)
rotas.post('/usuario', validarRequisicao(usuarioSchema), cadastrarUsuario)
rotas.post('/login', validarRequisicao(loginSchema), loginUsuario )

module.exports = rotas
