const knex = require('../conexoes/bancodedados')
const emailSender = require('../conexoes/nodemailer')

const cadastrarPedido = async (req, res) => {
  const { cliente_id, observacao, pedido_produtos } = req.body

  try {
    const clienteExiste = await knex('clientes').where('id', cliente_id).first()

    if (!clienteExiste) {
      return res.status(400).json({ mensagem: "Cliente nao existe" })
    }

    const produtos = []
    let valorTotal = 0

    for (let i = 0; i < pedido_produtos.length; i++) {
      let produto = pedido_produtos[i]

      const produtoExiste = await knex('produtos').where({ id: produto.produto_id }).first()
  
      if (!produtoExiste) {
        return res.status(404).json({ mensagem: `O produto de id ${produto.produto_id} nao existe` })
      }
      
      if(produtoExiste.quantidade_estoque < produto.quantidade_produto) {
        return res.status(400).json({ mensagem: `So existem ${produtoExiste.quantidade_estoque} produtos do produto de id ${produtoExiste.id}` })
      }

      valorTotal += produtoExiste.valor
      
      produtos.push(produtoExiste)

    }
    
    // cadastrar pedido no banco de dados 
    const pedido = await knex('pedidos').insert({ cliente_id, observacao, valor_total: valorTotal }).returning('*')

    for (let i = 0; i < produtos.length; i++) {
      const produto = produtos[i]
      // cadastrar pedido_produtos no banco de dados 
      await knex('pedido_produtos').insert({ pedido_id: pedido[0].id, produto_id: produto.id, quantidade_produto: produto.quantidade_estoque, valor_produto: produto.valor})
    }
    // enviar email para o cliente 
    const email = {
      assunto: 'Pedido Cadastrado',
      corpoEmail: 'Seu pedido foi cadastrado com sucesso!'
    }

    emailSender(process.env.MAIL_SENDER, clienteExiste.email, email.assunto, email.corpoEmail)
    .catch(error => console.log(error))
    
    return res.status(200).json({ mensagem: "Pedido cadastrado com sucesso" })
 
  } catch (error) {
    console.log(error) 
    return res.status(500).json({ mensagem: "Erro interno do servidor" })
  }
}
 
module.exports = {
  cadastrarPedido
}