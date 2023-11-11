const express = require('express')
const rota = express.Router()

const { listarCategorias } = require('./controladores/categorias')
const { cadastrarUsuario, detalharPerfilUsuarioLogado, editarUsuario, } = require('./controladores/usuarios')
const { cadastrarProduto, editarProduto } = require('./controladores/produtos')
const validarRequisicao = require('./intermediarios/validarRequisicao')
const usuarioSchema = require('./validacoes/usuarioSchema')
const loginSchema = require('./validacoes/loginSchema')
const produtoSchema = require('./validacoes/produtoSchema')
const loginUsuario = require('./controladores/login')
const verificarUsuarioLogado = require('./intermediarios/validarUsuarioLogado')

rota.post('/usuario', validarRequisicao(usuarioSchema), cadastrarUsuario)
rota.post('/login', validarRequisicao(loginSchema), loginUsuario)
rota.get('/categoria', listarCategorias)

rota.use(verificarUsuarioLogado)

rota.get('/usuario', detalharPerfilUsuarioLogado)
rota.put('/usuario', validarRequisicao(usuarioSchema), editarUsuario)

rota.post('/produto', validarRequisicao(produtoSchema), cadastrarProduto)
rota.put('/produto/:id', validarRequisicao(produtoSchema), editarProduto)

module.exports = rota
