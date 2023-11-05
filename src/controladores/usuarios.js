const knex = require('../conexoes/bancodedados')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const senhaJwt = require('../senhaJwt');


const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body
    try {
        const emailJaExiste = await knex('usuarios').where({ email }).first()
        if (emailJaExiste) {
            return res.status(400).json('Este email já está cadastrado.')
        }
        const senhaCriptografada = await bcrypt.hash(senha, 10)

        const novoUsuario = await knex('usuarios').insert({
            nome,
            email,
            senha: senhaCriptografada
        }).returning('*')

        if (!novoUsuario) {
            return res.status(400).json('Não foi possível cadastrar o usuário, tente novamente.')
        }

        const { senha: _, ...dadosUsuario } = novoUsuario[0]

        return res.json(dadosUsuario)
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            mensagem: 'Erro interno do servidor.'
        })
    }
};

const loginUsuario = async (req, res) => {
    const {email, senha} = req.body;
    
    try {
        const usuario = await knex('usuarios').where({ email })
        
        if(usuario.length < 1){
            return res.status(400).json({
                mensagem: 'Email ou senha inválido.'
            })
        }

        const senhaValida = await bcrypt.compare(senha, usuario[0].senha);

        if(!senhaValida){
            return res.status(400).json({
                mensagem: 'Email ou senha inválido.'
            })
        }

        const token = jwt.sign({id: usuario[0].id}, senhaJwt, {expiresIn: '8h'})

        const {senha: _, ...usuarioLogado} = usuario[0]
        
        return res.json({
            usuario: usuarioLogado, token
        })
    } catch (error) {
        return res.status(500)
        .json({
            mensagem: 'Erro interno do servidor.'
        })
        
    }
}

module.exports = {
    cadastrarUsuario,
    loginUsuario
}