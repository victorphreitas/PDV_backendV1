const knex = require('../conexoes/bancodedados')

const cadastrarCliente = async (req, res) => {
  const { nome, email, cpf } = req.body

  try {
    // vericar duplicidade de email
    const emailDuplicidade = await knex('clientes').select('*').where({ email }).first()

    if (emailDuplicidade) {
      return res.status(400).json({ mensagem: "Email ja existe no banco de dados" })
    }
    // verificar duplicidade de cpf 
    const cpfDuplicidade = await knex('clientes').select('*').where({ cpf }).first()

    if (cpfDuplicidade) {
      return res.status(400).json({ mensagem: "Cpf ja existe no banco de dados" })
    }

    const novoCliente = {
      nome,
      email,
      cpf
    }

    const clienteCadastro = await knex('clientes').insert(novoCliente)

    return res.status(200).json({ mensagem: "Cliente cadastrado com sucesso" })
    console.log(clienteCadastro)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ mensagem: "Erro interno do servidor" })
  }
}

module.exports = {
  cadastrarCliente
}