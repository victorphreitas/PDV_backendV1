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

const editarProduto = async (req, res) => {
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body
    const { id } = req.params

    try {
        const produto = await knex('produtos').where({ id }).first()

        if (!produto) {
            return res.status(404).json({ mensagem: 'Não foi possível encontrar o produto.' })
        }

        const categoria = await knex('categorias').where({ id: categoria_id }).first()

        if (!categoria) {
            return res.status(404).json({ mensagem: 'Não foi possível encontrar a categoria informada.' })
        }

        const produtoJaExiste = await knex('produtos').where({ descricao }).andWhere('id', '!=', id).first()

        if (produtoJaExiste) {
            return res.status(400).json({ mensagem: 'Este produto já está cadastrado no banco de dados.' })
        }

        const produtoAtualizado = await knex('produtos').update({
            descricao,
            quantidade_estoque,
            valor,
            categoria_id
        }).where({ id }).returning('*')

        if (!produtoAtualizado) {
            return res.status(400).json({ mensagem: 'Não foi possível atualizar o produto.' })
        }

        return res.json({ produtoAtualizado: produtoAtualizado[0] })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            mensagem: 'Erro interno do servidor.'
        })
    }
}

const listarProdutos = async (req, res) => {
    const { categoria_id } = req.query
    try {
        if (categoria_id) {
            const categoria = await knex('categorias').where({ id: categoria_id }).first()

            if (!categoria) {
                return res.status(404).json({ mensagem: 'Não foi possível encontrar a categoria informada.' })
            }

            const produtos = await knex('produtos').where({ categoria_id }).orderBy("id")
            if (produtos.length < 1) {
                return res.status(404).json({ mensagem: 'Não foi possível encontrar produtos utilizando a categoria informada.' })
            }
            return res.json(produtos)
        }
        const produtos = await knex('produtos').orderBy("id")
        console.log(produtos);
        return res.json(produtos)

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            mensagem: 'Erro interno do servidor.'
        })
    }
}
module.exports = {
    cadastrarProduto,
    editarProduto,
    listarProdutos
}