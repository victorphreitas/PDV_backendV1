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

    try {        
        if (nome || email || senha) {
            const { id } = req.usuario

            const usuario = await knex('usuarios').where({ id }).first()

            if (email) {
                // verificar se email ja existe para outro usuario
                const resp = await knex('usuarios').select('*').where({ email }).andWhere('id', '!=', id).returning('*')

                if (resp.length > 0) {
                    return res.status(400).json({ mensagem: "Email ja existe no banco de dados" })
                }
            }

            const senhaCriptografada = await bcrypt.hash(senha, 10)

            const usuarioEditado = {
                nome: nome ? nome : usuario.nome,
                email: email ? email : usuario.email,
                senha: senha ? senhaCriptografada : usuario.senha
            }

            await knex('usuarios').update({ nome: usuarioEditado.nome, email: usuarioEditado.email, senha: usuarioEditado.senha })

            return res.status(200).json({ mensagem: "Usuario editado com sucesso" })

        } else {
            return res.status(400).json({ mensagem: "Para editar o seu perfil de usuario, por favor informe nome, email e senha" })
        }

    } catch (error) {        
        console.log(error)
        return res.status(200).json({ mensagem: "Erro interno do servidor" })
    }
}

module.exports = {
    cadastrarUsuario,
    detalharPerfilUsuarioLogado,
    editarUsuario
}