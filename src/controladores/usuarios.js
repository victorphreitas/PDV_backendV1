const knex = require('../conexoes/bancodedados')
const bcrypt = require('bcrypt')

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body
    try {
        const emailJaExiste = await knex('usuarios').where({ email }).first()
        if (emailJaExiste) {
            return res.status(400).json({ mensagem: 'Este email já está cadastrado.' })
        }
        const senhaCriptografada = await bcrypt.hash(senha, 10)

        const novoUsuario = await knex('usuarios').insert({
            nome,
            email,
            senha: senhaCriptografada
        }).returning('*')

        if (!novoUsuario) {
            return res.status(400).json({ mensagem: 'Não foi possível cadastrar o usuário, tente novamente.' })
        }

        const { senha: _, ...dadosUsuario } = novoUsuario[0]

        return res.status(201).json(dadosUsuario)
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            mensagem: 'Erro interno do servidor.'
        })
    }

};

const detalharPerfilUsuarioLogado = async (req, res) => {
    return res.json(req.usuario);
}

const editarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body
    const { id } = req.usuario

    try {
        const emailJaExiste = await knex('usuarios').where({ email }).andWhere('id', '!=', id).first()

        if (emailJaExiste) {
            return res.status(400).json({ mensagem: "Este email ja existe no banco de dados" })
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10)

        const usuarioEditado = await knex('usuarios').update({ nome, email, senha: senhaCriptografada }).where({id}).returning(['id', 'nome', 'email'])

        if (!usuarioEditado[0]) {
            return res.status(400).json({ mensagem: "Não foi possível atualizar o usuário" })
        }

        return res.status(200).json({ atuliazadoComSucesso: usuarioEditado[0] })

    }

    catch (error) {
        console.log(error)
        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }
}

module.exports = {
    cadastrarUsuario,
    detalharPerfilUsuarioLogado,
    editarUsuario
}