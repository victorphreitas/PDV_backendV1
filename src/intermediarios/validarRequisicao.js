const validarRequisicao = (schema) => async (req, res, next) => {
    try {
        await schema.validateAsync(req.body)
        console.log('passei aqui');
        next()
    } catch (error) {
        return res.status(400).json({
            mensagem: error.message
        })
    }
}

module.exports = validarRequisicao