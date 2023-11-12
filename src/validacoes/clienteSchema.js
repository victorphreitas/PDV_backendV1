const joi = require('joi')

const clienteSchema = joi.object({
    nome: joi.string().required().messages({
        'string.empty': 'O campo nome é obrigatório',
        'any.required': 'O campo nome é obrigatório',
        'string.base': 'Informe um nome válido.'
    }),
    email: joi.string().email().required().messages({
        'string.empty': 'O campo email é obrigatório',
        'any.required': 'O campo email é obrigatório',
        'string.email': 'Informe um email válido.',
        'string.base': 'Informe um email válido.'
    }),
    cpf: joi.string().pattern(new RegExp('^[0-9]{11}$')).required().messages({
        'any.required': 'O campo cpf é obrigatório.',
        'string.empty': 'O campo cpf é obrigatório.',
        'string.pattern.base': 'Informe um cpf válido.',
        'string.base': 'Informe um cpf válido.'

    }),
    cep: joi.string().pattern(new RegExp('^[0-9]{8}$')).allow('').messages({
        'string.pattern.base': 'Informe um cep válido.',
        'string.base': 'Informe um cep válido.'
    }), 
    rua: joi.string().allow('').messages({
        'string.base': 'Informe uma rua válida.'
    }),
    numero: joi.number().allow('').messages({
        'string.base': 'Informe um numero válido.'
    }),
    bairro: joi.string().allow('').messages({
        'string.base': 'Informe um bairro válido.'
    }),
    cidade: joi.string().allow('').messages({
        'string.base': 'Informe uma cidade válida.'
    }),
    estado: joi.string().allow('').messages({
        'string.base': 'Informe um estado válido.'
    })

});

module.exports = clienteSchema