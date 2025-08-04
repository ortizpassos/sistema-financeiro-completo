// Definição de todas as telas do sistema
const screens = {
    home: {
        title: 'VISÃO GERAL',
        content: `
            <div class="row">
                <!-- Cards superiores -->
                <div class="col-md-6 mb-4">
                    <div class="card-custom">
                        <div class="d-flex align-items-center mb-3">
                            <div class="me-3" style="color: #dc3545; font-size: 2rem;">
                                <i class="bi bi-calendar-x"></i>
                            </div>
                            <div>
                                <h5 class="mb-1">Contas a Pagar no Mês</h5>
                                <h2 class="text-danger mb-0">R$ 4.500,00</h2>
                            </div>
                        </div>
                        <button class="btn btn-danger btn-sm" tabindex="7">VER RELATÓRIO DE CONTAS</button>
                    </div>
                </div>
                
                <div class="col-md-6 mb-4">
                    <div class="card-custom">
                        <div class="d-flex align-items-center mb-3">
                            <div class="me-3" style="color: #17a2b8; font-size: 2rem;">
                                <i class="bi bi-calendar-check"></i>
                            </div>
                            <div>
                                <h5 class="mb-1">Contas Pagas no Mês</h5>
                                <h2 class="text-info mb-0">R$ 8.500,00</h2>
                            </div>
                        </div>
                        <button class="btn btn-info btn-sm" tabindex="8">VER RELATÓRIO DE PAGAMENTOS</button>
                    </div>
                </div>
            </div>

            <div class="row">
                <!-- Gráficos -->
                <div class="col-md-6 mb-4">
                    <div class="card-custom">
                        <h5 class="mb-3">Resultado de Vendas</h5>
                        <div class="chart-container" style="height: 200px; background: #f8f9fa; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                            <canvas id="vendasChart" width="400" height="200"></canvas>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6 mb-4">
                    <div class="card-custom">
                        <h5 class="mb-3">Total Valor Recebido</h5>
                        <div class="chart-container" style="height: 200px; background: #f8f9fa; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                            <canvas id="recebimentosChart" width="400" height="200"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <!-- Gráficos de pizza -->
                <div class="col-md-6 mb-4">
                    <div class="card-custom">
                        <h5 class="mb-3">Demonstrativo de Despesas Pagas</h5>
                        <div class="chart-container" style="height: 250px; background: #f8f9fa; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                            <canvas id="despesasChart" width="300" height="250"></canvas>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6 mb-4">
                    <div class="card-custom">
                        <h5 class="mb-3">Demonstrativo Vendas por Canal</h5>
                        <div class="chart-container" style="height: 250px; background: #f8f9fa; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                            <canvas id="canaisChart" width="300" height="250"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Filtro de período -->
            <div class="position-fixed" style="top: 20px; right: 20px;">
                <button class="btn btn-outline-primary" tabindex="9">
                    <i class="bi bi-funnel"></i> Filtrar Período
                    <small class="d-block">01/01/2020 a 01/01/2021</small>
                </button>
            </div>
        `
    },

    'lancamento-despesas': {
        title: 'Lançamento Despesas',
        content: `
            <!-- Botões de ação -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="d-flex gap-3 flex-wrap">
                        <button class="btn btn-info btn-custom" data-action="inserir-despesa" tabindex="7">
                            <i class="bi bi-plus-circle"></i> Inserir Despesa
                        </button>
                        <button class="btn btn-secondary btn-custom" data-action="categoria-despesas" tabindex="8">
                            <i class="bi bi-tags"></i> Categoria de Despesas
                        </button>
                        <button class="btn btn-success btn-custom" data-action="cadastrar-fornecedor" tabindex="9">
                            <i class="bi bi-person-plus"></i> Cadastrar Fornecedor
                        </button>
                        <button class="btn btn-warning btn-custom" data-action="formas-pagamento" tabindex="10">
                            <i class="bi bi-credit-card"></i> Formas de Pagamento
                        </button>
                    </div>
                </div>
            </div>

            <!-- Filtros de pesquisa -->
            <div class="card-custom mb-4">
                <h5 class="mb-3">Pesquisar:</h5>
                <div class="row">
                    <div class="col-md-3 mb-3">
                        <label class="form-label">Descrição</label>
                        <input type="text" class="form-control form-control-custom" placeholder="Luz/ Aluguel / Água" tabindex="11">
                    </div>
                    <div class="col-md-2 mb-3">
                        <label class="form-label">Status</label>
                        <select class="form-control form-control-custom" tabindex="12">
                            <option>Pago / A Pagar / Todas</option>
                        </select>
                    </div>
                    <div class="col-md-3 mb-3">
                        <label class="form-label">Período</label>
                        <input type="text" class="form-control form-control-custom" value="01/01/2020 à 01/01/2021" tabindex="13">
                    </div>
                    <div class="col-md-2 mb-3">
                        <label class="form-label">Categoria</label>
                        <select class="form-control form-control-custom" tabindex="14">
                            <option>Selecione...</option>
                        </select>
                    </div>
                    <div class="col-md-2 mb-3">
                        <label class="form-label">Fornecedor</label>
                        <select class="form-control form-control-custom" tabindex="15">
                            <option>Selecione...</option>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-2 mb-3">
                        <label class="form-label">Forma de Pagamento</label>
                        <select class="form-control form-control-custom" tabindex="16">
                            <option>Selecione...</option>
                        </select>
                    </div>
                    <div class="col-md-2 mb-3 d-flex align-items-end">
                        <button class="btn btn-primary btn-custom" tabindex="17">
                            <i class="bi bi-funnel"></i> Filtrar
                        </button>
                    </div>
                    <div class="col-md-2 mb-3 d-flex align-items-end">
                        <button class="btn btn-outline-secondary" tabindex="18">Limpar Filtros</button>
                    </div>
                </div>
            </div>

            <!-- Lista de Despesas -->
            <div class="card-custom">
                <h5 class="mb-3 text-center">Lista de Despesas</h5>
                <div class="table-responsive">
                    <table class="table table-custom">
                        <thead>
                            <tr>
                                <th>Descrição</th>
                                <th>Observações</th>
                                <th>Valor</th>
                                <th>Data da Compra</th>
                                <th>Data do Vencimento</th>
                                <th>Data do Pagamento</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <strong>Aluguel</strong><br>
                                    <small class="text-muted">Categoria: Administrativo</small>
                                </td>
                                <td><i class="bi bi-chat-square-text text-primary"></i></td>
                                <td><strong>R$ 2.500,00</strong></td>
                                <td>01/01/2020</td>
                                <td>01/01/2020</td>
                                <td><span class="text-danger">Não Pago</span></td>
                                <td>
                                    <button class="btn btn-sm btn-outline-primary me-1" tabindex="19">
                                        <i class="bi bi-pencil"></i> Editar
                                    </button>
                                    <button class="btn btn-sm btn-warning me-1" tabindex="20">
                                        <i class="bi bi-currency-dollar"></i> Pagar
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" tabindex="21">
                                        <i class="bi bi-trash"></i> Excluir
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>Energia</strong><br>
                                    <small class="text-muted">Categoria: Administrativo</small>
                                </td>
                                <td><i class="bi bi-chat-square-text text-primary"></i></td>
                                <td><strong>R$ 500,00</strong></td>
                                <td>01/01/2020</td>
                                <td>01/01/2020</td>
                                <td>01/01/2020</td>
                                <td>
                                    <button class="btn btn-sm btn-outline-primary me-1" tabindex="22">
                                        <i class="bi bi-pencil"></i> Editar
                                    </button>
                                    <button class="btn btn-sm btn-success me-1" tabindex="23">
                                        <i class="bi bi-check-circle"></i> Pago
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" tabindex="24">
                                        <i class="bi bi-trash"></i> Excluir
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>Água</strong><br>
                                    <small class="text-muted">Categoria: Administrativo</small>
                                </td>
                                <td></td>
                                <td><strong>R$ 200,00</strong></td>
                                <td>01/01/2020</td>
                                <td>01/01/2020</td>
                                <td><span class="text-danger">Não Pago</span></td>
                                <td>
                                    <button class="btn btn-sm btn-outline-primary me-1" tabindex="25">
                                        <i class="bi bi-pencil"></i> Editar
                                    </button>
                                    <button class="btn btn-sm btn-warning me-1" tabindex="26">
                                        <i class="bi bi-currency-dollar"></i> Pagar
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" tabindex="27">
                                        <i class="bi bi-trash"></i> Excluir
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `
    },

    'lancamento-recebimentos': {
        title: 'Lançamento de Recebimentos',
        content: `
            <!-- Botões de ação -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="d-flex gap-3 flex-wrap">
                        <button class="btn btn-info btn-custom" data-action="inserir-recebimento" tabindex="7">
                            <i class="bi bi-plus-circle"></i> Inserir Valor Recebido
                        </button>
                        <button class="btn btn-success btn-custom" data-action="formas-recebimento" tabindex="8">
                            <i class="bi bi-credit-card"></i> Formas de Recebimentos
                        </button>
                    </div>
                </div>
            </div>

            <!-- Filtros de pesquisa -->
            <div class="card-custom mb-4">
                <h5 class="mb-3">Pesquisar:</h5>
                <div class="row">
                    <div class="col-md-3 mb-3">
                        <label class="form-label">Descrição</label>
                        <input type="text" class="form-control form-control-custom" placeholder="Vendas / Transferências" tabindex="9">
                    </div>
                    <div class="col-md-3 mb-3">
                        <label class="form-label">Valor</label>
                        <input type="text" class="form-control form-control-custom" placeholder="R$ 0,00" tabindex="10">
                    </div>
                    <div class="col-md-3 mb-3">
                        <label class="form-label">Forma de Recebimento</label>
                        <select class="form-control form-control-custom" tabindex="11">
                            <option>Selecione...</option>
                        </select>
                    </div>
                    <div class="col-md-3 mb-3">
                        <label class="form-label">Período</label>
                        <input type="text" class="form-control form-control-custom" value="01/01/2020 à 01/01/2021" tabindex="12">
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-2 mb-3 d-flex align-items-end">
                        <button class="btn btn-primary btn-custom" tabindex="13">
                            <i class="bi bi-funnel"></i> Filtrar
                        </button>
                    </div>
                    <div class="col-md-2 mb-3 d-flex align-items-end">
                        <button class="btn btn-outline-secondary" tabindex="14">Limpar Filtros</button>
                    </div>
                </div>
            </div>

            <!-- Lista de Valores Recebidos -->
            <div class="card-custom">
                <h5 class="mb-3 text-center">Lista de Valores Recebidos</h5>
                <div class="table-responsive">
                    <table class="table table-custom">
                        <thead>
                            <tr>
                                <th>Descrição</th>
                                <th>Observações</th>
                                <th>Valor</th>
                                <th>Data do Recebimento</th>
                                <th>Forma de Recebimento</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Venda Produtos</strong></td>
                                <td><i class="bi bi-chat-square-text text-primary"></i></td>
                                <td><strong>R$ 2.500,00</strong></td>
                                <td>01/01/2020</td>
                                <td>Dinheiro</td>
                                <td>
                                    <button class="btn btn-sm btn-outline-primary me-1" tabindex="15">
                                        <i class="bi bi-pencil"></i> Editar
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" tabindex="16">
                                        <i class="bi bi-trash"></i> Excluir
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Transferência</strong></td>
                                <td><i class="bi bi-chat-square-text text-primary"></i></td>
                                <td><strong>R$ 500,00</strong></td>
                                <td>01/01/2020</td>
                                <td>Banco Amer</td>
                                <td>
                                    <button class="btn btn-sm btn-outline-primary me-1" tabindex="17">
                                        <i class="bi bi-pencil"></i> Editar
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" tabindex="18">
                                        <i class="bi bi-trash"></i> Excluir
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Venda Produtos</strong></td>
                                <td></td>
                                <td><strong>R$ 200,00</strong></td>
                                <td>01/01/2020</td>
                                <td>Banco San</td>
                                <td>
                                    <button class="btn btn-sm btn-outline-primary me-1" tabindex="19">
                                        <i class="bi bi-pencil"></i> Editar
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" tabindex="20">
                                        <i class="bi bi-trash"></i> Excluir
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `
    },

    'lancamento-vendas': {
        title: 'Lançamento de Vendas',
        content: `
            <!-- Botões de ação -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="d-flex gap-3 flex-wrap">
                        <button class="btn btn-info btn-custom" data-action="inserir-vendas" tabindex="7">
                            <i class="bi bi-plus-circle"></i> Inserir Vendas
                        </button>
                        <button class="btn btn-secondary btn-custom" data-action="cadastrar-canais" tabindex="8">
                            <i class="bi bi-laptop"></i> Cadastrar Canais de Vendas
                        </button>
                    </div>
                </div>
            </div>

            <!-- Filtros de pesquisa -->
            <div class="card-custom mb-4">
                <h5 class="mb-3">Pesquisar:</h5>
                <div class="row">
                    <div class="col-md-3 mb-3">
                        <label class="form-label">Descrição</label>
                        <input type="text" class="form-control form-control-custom" tabindex="9">
                    </div>
                    <div class="col-md-3 mb-3">
                        <label class="form-label">Valor</label>
                        <input type="text" class="form-control form-control-custom" placeholder="R$ 0,00" tabindex="10">
                    </div>
                    <div class="col-md-3 mb-3">
                        <label class="form-label">Canal de Venda</label>
                        <select class="form-control form-control-custom" tabindex="11">
                            <option>Selecione...</option>
                        </select>
                    </div>
                    <div class="col-md-3 mb-3">
                        <label class="form-label">Período</label>
                        <input type="text" class="form-control form-control-custom" value="01/01/2020 à 01/01/2021" tabindex="12">
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-2 mb-3 d-flex align-items-end">
                        <button class="btn btn-primary btn-custom" tabindex="13">
                            <i class="bi bi-funnel"></i> Filtrar
                        </button>
                    </div>
                    <div class="col-md-2 mb-3 d-flex align-items-end">
                        <button class="btn btn-outline-secondary" tabindex="14">Limpar Filtros</button>
                    </div>
                </div>
            </div>

            <!-- Lista de Vendas -->
            <div class="card-custom">
                <h5 class="mb-3 text-center">Lista de Vendas</h5>
                <div class="table-responsive">
                    <table class="table table-custom">
                        <thead>
                            <tr>
                                <th>Descrição</th>
                                <th>Observações</th>
                                <th>Valor</th>
                                <th>Data da Venda</th>
                                <th>Canal de Venda</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Venda Produtos</strong></td>
                                <td><i class="bi bi-chat-square-text text-primary"></i></td>
                                <td><strong>R$ 2.500,00</strong></td>
                                <td>01/01/2020</td>
                                <td>Loja Física</td>
                                <td>
                                    <button class="btn btn-sm btn-outline-primary me-1" tabindex="15">
                                        <i class="bi bi-pencil"></i> Editar
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" tabindex="16">
                                        <i class="bi bi-trash"></i> Excluir
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Venda Instagram</strong></td>
                                <td><i class="bi bi-chat-square-text text-primary"></i></td>
                                <td><strong>R$ 500,00</strong></td>
                                <td>01/01/2020</td>
                                <td>Instagram</td>
                                <td>
                                    <button class="btn btn-sm btn-outline-primary me-1" tabindex="17">
                                        <i class="bi bi-pencil"></i> Editar
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" tabindex="18">
                                        <i class="bi bi-trash"></i> Excluir
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Venda Site</strong></td>
                                <td></td>
                                <td><strong>R$ 200,00</strong></td>
                                <td>01/01/2020</td>
                                <td>E-commerce</td>
                                <td>
                                    <button class="btn btn-sm btn-outline-primary me-1" tabindex="19">
                                        <i class="bi bi-pencil"></i> Editar
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" tabindex="20">
                                        <i class="bi bi-trash"></i> Excluir
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `
    },

    'relatorios': {
        title: 'Relatórios',
        content: `
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <!-- DRE -->
                    <div class="card-custom mb-4 text-center">
                        <h4 class="mb-3">DRE - Demonstrativo de Resultado do Exercício</h4>
                        <p class="text-muted mb-4">DRE é o resultado das operações da sua empresa como: Despesas, Vendas, Lucros e Prejuízos.</p>
                        <button class="btn btn-success btn-custom btn-lg" data-action="ver-dre" tabindex="7">
                            VER RESULTADO
                        </button>
                    </div>

                    <hr class="my-5">

                    <!-- Fluxo de Caixa -->
                    <div class="card-custom text-center">
                        <h4 class="mb-3">Fluxo de Caixa</h4>
                        <p class="text-muted mb-4">Fluxo de Caixa é a Movimentação Financeira: Pagamentos Efetuados e Recebimento de Valores</p>
                        <button class="btn btn-success btn-custom btn-lg" data-action="ver-fluxo-caixa" tabindex="8">
                            VER RESULTADO
                        </button>
                    </div>
                </div>
            </div>
        `
    },

    'saldo-conta': {
        title: 'Saldo em Conta',
        content: `
            <div class="row">
                <!-- Total Bancos/Dinheiro -->
                <div class="col-md-6 mb-4">
                    <div class="card-custom">
                        <h5 class="mb-3 text-center">Total Bancos/Dinheiro</h5>
                        <div class="table-responsive">
                            <table class="table table-custom">
                                <thead>
                                    <tr>
                                        <th>Mês</th>
                                        <th>Saldo Inicial</th>
                                        <th>Entrada</th>
                                        <th>Saída</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td>janeiro</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>fevereiro</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>março</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>abril</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>maio</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>junho</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>julho</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>agosto</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>setembro</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>outubro</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>novembro</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>dezembro</td><td>515,43</td><td>-</td><td>-</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Banco Amer -->
                <div class="col-md-6 mb-4">
                    <div class="card-custom">
                        <h5 class="mb-3 text-center">Banco Amer</h5>
                        <div class="table-responsive">
                            <table class="table table-custom">
                                <thead>
                                    <tr>
                                        <th>Mês</th>
                                        <th>Saldo Inicial</th>
                                        <th>Entrada</th>
                                        <th>Saída</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td>janeiro</td><td>515,43</td><td>100,00</td><td class="text-danger">250,00</td></tr>
                                    <tr><td>fevereiro</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>março</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>abril</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>maio</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>junho</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>julho</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>agosto</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>setembro</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>outubro</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>novembro</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>dezembro</td><td>515,43</td><td>-</td><td>-</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <!-- Dinheiro -->
                <div class="col-md-6 mb-4">
                    <div class="card-custom">
                        <h5 class="mb-3 text-center">Dinheiro</h5>
                        <div class="table-responsive">
                            <table class="table table-custom">
                                <thead>
                                    <tr>
                                        <th>Mês</th>
                                        <th>Saldo Inicial</th>
                                        <th>Entrada</th>
                                        <th>Saída</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td>janeiro</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>fevereiro</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>março</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>abril</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>maio</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>junho</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>julho</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>agosto</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>setembro</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>outubro</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>novembro</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>dezembro</td><td>515,43</td><td>-</td><td>-</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Banco Master -->
                <div class="col-md-6 mb-4">
                    <div class="card-custom">
                        <h5 class="mb-3 text-center">Banco Master</h5>
                        <div class="table-responsive">
                            <table class="table table-custom">
                                <thead>
                                    <tr>
                                        <th>Mês</th>
                                        <th>Saldo Inicial</th>
                                        <th>Entrada</th>
                                        <th>Saída</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td>janeiro</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>fevereiro</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>março</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>abril</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>maio</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>junho</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>julho</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>agosto</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>setembro</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>outubro</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>novembro</td><td>515,43</td><td>-</td><td>-</td></tr>
                                    <tr><td>dezembro</td><td>515,43</td><td>-</td><td>-</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `
    }
};

// Telas de formulários e cadastros
const formScreens = {
    'inserir-despesa': {
        title: 'Inserir Despesas',
        content: `
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <div class="card-custom">
                        <h5 class="mb-4">Dados da Despesa</h5>
                        <form>
                            <div class="row">
                                <div class="col-md-12 mb-3">
                                    <label class="form-label">Descrição:</label>
                                    <input type="text" class="form-control form-control-custom" tabindex="7">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Data da Compra:</label>
                                    <input type="date" class="form-control form-control-custom" value="2020-01-01" tabindex="8">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Data Vencimento:</label>
                                    <input type="date" class="form-control form-control-custom" value="2020-01-01" tabindex="9">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Valor:</label>
                                    <input type="text" class="form-control form-control-custom" placeholder="R$ 0,00" tabindex="10">
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Parcelado:</label>
                                    <select class="form-control form-control-custom" tabindex="11">
                                        <option>5x</option>
                                    </select>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Despesa Fixa:</label>
                                    <select class="form-control form-control-custom" tabindex="12">
                                        <option>12x</option>
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Categoria:</label>
                                    <select class="form-control form-control-custom" tabindex="13">
                                        <option>Selecione...</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Fornecedor:</label>
                                    <select class="form-control form-control-custom" tabindex="14">
                                        <option>Selecione...</option>
                                    </select>
                                </div>
                            </div>
                            <small class="text-muted">*A despesa Fixa será lança automaticamente nos próximos meses</small>
                        </form>
                    </div>

                    <div class="card-custom mt-4">
                        <h5 class="mb-4">Dados do Pagamento</h5>
                        <form>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" checked tabindex="15">
                                        <label class="form-check-label">Pagamento Realizado:</label>
                                    </div>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Data do Pagamento:</label>
                                    <input type="date" class="form-control form-control-custom" value="2020-01-01" tabindex="16">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" tabindex="17">
                                        <label class="form-check-label">Pagamento Não Realizado:</label>
                                    </div>
                                </div>
                                <div class="col-md-3 mb-3">
                                    <label class="form-label">Valor Pago:</label>
                                    <input type="text" class="form-control form-control-custom" placeholder="R$ 0,00" tabindex="18">
                                </div>
                                <div class="col-md-3 mb-3">
                                    <label class="form-label">Forma de Pagamento:</label>
                                    <select class="form-control form-control-custom" tabindex="19">
                                        <option>Selecione...</option>
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div class="card-custom mt-4">
                        <h5 class="mb-3">Observações:</h5>
                        <textarea class="form-control form-control-custom" rows="4" placeholder="Escreva..." tabindex="20"></textarea>
                    </div>

                    <div class="text-center mt-4">
                        <button class="btn btn-success btn-custom btn-lg me-3" tabindex="21">
                            <i class="bi bi-check-circle"></i> Salvar
                        </button>
                        <button class="btn btn-secondary btn-custom btn-lg" tabindex="22">
                            <i class="bi bi-x-circle"></i> Cancelar
                        </button>
                    </div>
                </div>
            </div>
        `
    },

    'inserir-recebimento': {
        title: 'Inserir Recebimentos',
        content: `
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <div class="card-custom">
                        <h5 class="mb-4">Inserir Valor Recebido</h5>
                        <form>
                            <div class="row">
                                <div class="col-md-12 mb-3">
                                    <label class="form-label">Descrição:</label>
                                    <input type="text" class="form-control form-control-custom" tabindex="7">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Data do Recebimento:</label>
                                    <input type="date" class="form-control form-control-custom" value="2020-01-01" tabindex="8">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Valor:</label>
                                    <input type="text" class="form-control form-control-custom" placeholder="R$ 0,00" tabindex="9">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12 mb-3">
                                    <label class="form-label">Forma de Recebimento:</label>
                                    <select class="form-control form-control-custom" tabindex="10">
                                        <option>Selecione...</option>
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div class="card-custom mt-4">
                        <h5 class="mb-3">Observações:</h5>
                        <textarea class="form-control form-control-custom" rows="4" placeholder="Escreva..." tabindex="11"></textarea>
                    </div>

                    <div class="text-center mt-4">
                        <button class="btn btn-success btn-custom btn-lg me-3" tabindex="12">
                            <i class="bi bi-check-circle"></i> Salvar
                        </button>
                        <button class="btn btn-secondary btn-custom btn-lg" tabindex="13">
                            <i class="bi bi-x-circle"></i> Cancelar
                        </button>
                    </div>
                </div>
            </div>
        `
    },

    'inserir-vendas': {
        title: 'Inserir Vendas',
        content: `
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <div class="card-custom">
                        <h5 class="mb-4">Dados da Vendas</h5>
                        <form>
                            <div class="row">
                                <div class="col-md-12 mb-3">
                                    <label class="form-label">Descrição:</label>
                                    <input type="text" class="form-control form-control-custom" tabindex="7">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Data da Venda:</label>
                                    <input type="date" class="form-control form-control-custom" value="2020-01-01" tabindex="8">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Valor:</label>
                                    <input type="text" class="form-control form-control-custom" placeholder="R$ 0,00" tabindex="9">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12 mb-3">
                                    <label class="form-label">Canal de Venda:</label>
                                    <select class="form-control form-control-custom" tabindex="10">
                                        <option>Selecione...</option>
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div class="card-custom mt-4">
                        <h5 class="mb-3">Observações:</h5>
                        <textarea class="form-control form-control-custom" rows="4" placeholder="Escreva..." tabindex="11"></textarea>
                    </div>

                    <div class="text-center mt-4">
                        <button class="btn btn-success btn-custom btn-lg me-3" tabindex="12">
                            <i class="bi bi-check-circle"></i> Salvar
                        </button>
                        <button class="btn btn-secondary btn-custom btn-lg" tabindex="13">
                            <i class="bi bi-x-circle"></i> Cancelar
                        </button>
                    </div>
                </div>
            </div>
        `
    }
};

// Combina todas as telas
Object.assign(screens, formScreens);

