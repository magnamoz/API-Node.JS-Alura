//cSpell:Ignore Serializador,serializar
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const config = require('config')
const roteador = require('./rotas/fornecedores')
const NaoEncontrado = require('./erros/NaoEncontrado')
const CampoInvalido = require('../api/erros/CampoInvalido')
const DadosNaoFornecidos = require('../api/erros/DadosNaoFornecidos')
const ValorNaoSuportado = require('../api/erros/ValorNaoSuportado')
const formatosAceitos = require('../api/Serializador').formatosAceitos
const SerializadorErro = require('../api/Serializador').SerializadorErro

app.use(bodyParser.json())

app.use((req, res, proximo) => {
    let formatoRequisitado = req.header('Accept')

    if (formatoRequisitado === '*/*') {
        formatoRequisitado = 'application/json'
    }

    if (formatoRequisitado.indexOf(formatoRequisitado) === -1) {
        res.status(406)
        res.end
    }

    res.setHeader('Content-Type', formatoRequisitado)
    proximo()
})

app.use('/api/fornecedores', roteador)

app.use((erro, req, res, proximo) => {
    let status = 500

    if (erro instanceof NaoEncontrado) {
        status = 404 
    } 
    
    if (erro instanceof CampoInvalido || erro instanceof DadosNaoFornecidos) {
        status = 400 
    }
    
    if (erro instanceof ValorNaoSuportado) {
        status = 406 
    }

    const serializador = new SerializadorErro(
        res.getHeader('Content-Type')
    )
    res.status(status)
    res.send(
        serializador.serializar({
            mensagem: erro.message,
            id: erro.idErro
        })
    )
})

app.listen(config.get('api.porta'), () => console.log('Funcionando'))