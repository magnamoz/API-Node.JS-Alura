const ModeloTabela = require('../../rotas/fornecedores/ModeloTabelaFornecedor')

ModeloTabela
    .sync()
    .then(() => console.log('Tabela criada'))
    .catch(console.log)