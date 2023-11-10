const knex = require('../conexoes/bancodedados')

const cadastrarProduto = async (req, res) => {
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body
    try {
        const categoria = await knex('categorias').where({ id: categoria_id }).first()

        if (!categoria) {
            return res.status(404).json({ mensagem: 'Não foi possível encontrar a categoria informada.' })
        }

        const produtoJaExiste = await knex('produtos').where({ descricao }).first()
        if (produtoJaExiste) {
            return res.status(400).json({ mensagem: 'Este produto já está cadastrado no banco de dados.' })
        }

        const novoProduto = await knex('produtos').insert({
            descricao,
            quantidade_estoque,
            valor,
            categoria_id
        }).returning('*')

        if (!novoProduto) {
            return res.status(400).json({ mensagem: 'Não foi possível cadastrar o produto.' })
        }

        return res.json({ novoProduto: novoProduto[0] })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            mensagem: 'Erro interno do servidor.'
        })
    }
}

module.exports = {
    cadastrarProduto
}