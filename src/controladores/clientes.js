const knex = require('../conexoes/bancodedados')

const cadastrarCliente = async (req, res) => {
  const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body

  try {
    const emailJaExiste = await knex('clientes').where({ email }).first()

    if (emailJaExiste) {
      return res.status(400).json({ mensagem: "Email ja existe no banco de dados" })
    }

    const cpfJaExiste = await knex('clientes').where({ cpf }).first()

    if (cpfJaExiste) {
      return res.status(400).json({ mensagem: "Cpf ja existe no banco de dados" })
    }

    const novoCliente = {
      nome,
      email,
      cpf,
      cep,
      rua, 
      numero,
      bairro,
      cidade,
      estado
    }

    await knex('clientes').insert(novoCliente)

    return res.status(200).json({ novoCliente })

  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" })
  }
}

module.exports = {
  cadastrarCliente
}