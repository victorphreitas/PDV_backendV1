const knex = require('../conexoes/bancodedados')

const cadastrarCliente = async (req, res) => {
  const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body

  try {
    const emailJaExiste = await knex('clientes').where({ email }).first()

    if (emailJaExiste) {
      return res.status(400).json({ mensagem: "Email já cadastrado." })
    }

    const cpfJaExiste = await knex('clientes').where({ cpf }).first()

    if (cpfJaExiste) {
      return res.status(400).json({ mensagem: "CPF já cadastrado." })
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
    return res.status(500).json({ mensagem: "Erro interno do servidor." })
  }
};

const editarCliente = async (req, res) => {
  const {nome, email, cpf, cep, rua, numero, bairro, cidade, estado} = req.body;
  const {id} = req.params;

  try {
    const cliente = await knex('clientes').where({ id }).first()

    if(!cliente){
      return res.status(404).json({ mensagem: 'Cliente não encontrado.' })
    }

    const cpfJaExiste = await knex('clientes').where({cpf}).whereNot('id',id).first()
    const emailJaExiste = await knex('clientes').where({email}).whereNot('id',id).first()

    if(cpfJaExiste){
      return res.status(400).json({ mensagem: 'CPF já está cadastrado.' })
    }

    if(emailJaExiste){
      return res.status(400).json({ mensagem: 'Email já está cadastrado.' })
    }

    const clienteAtualizado = await knex('clientes').update({
      nome,
      email,
      cpf,
      cep,
      rua,
      numero,
      bairro,
      cidade,
      estado
    }).where({id}).returning('*')

    return res.json({clienteAtualizado: clienteAtualizado[0]})

  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." })
  }
};

const listarClientes = async (req, res) => {
  
  try {
    const clientes = await knex('clientes')
    
    if(!clientes){
      return res.status(404).json({ mensagem: 'Cliente(s) nao encontrado(s).' })
    }

    return res.json(clientes)
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' })
  }

};

const detalharCliente = async (req, res) => {
  const {id} = req.params;

  try {
    const cliente = await knex('clientes').where({ id }).first()

    if(!cliente){
      return res.status(404).json({mensagem: 'Cliente não encontrado.'})
    }

    return res.json(cliente)
    
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." })
  }


};

module.exports = {
  cadastrarCliente,
  editarCliente,
  listarClientes,
  detalharCliente
}