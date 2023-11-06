const express = require('express')
const rotas = express()

const { listarCategorias } = require('./controladores/categorias')
const { cadastrarUsuario,  } = require('./controladores/usuarios')
const validarRequisicao = require('./intermediarios/validarRequisicao')
const usuarioSchema = require('./validacoes/usuarioSchema')
const loginSchema = require('./validacoes/loginSchema')
const loginUsuario = require('./controladores/login')
const verificarUsuarioLogado = require('./intermediarios/validarUsuarioLogado')

rotas.post('/usuario', validarRequisicao(usuarioSchema), cadastrarUsuario)
rotas.post('/login', validarRequisicao(loginSchema), loginUsuario )

rotas.use(verificarUsuarioLogado)
rotas.get('/categoria', listarCategorias)

module.exports = rotas
