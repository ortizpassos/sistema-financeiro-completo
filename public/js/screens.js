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
                                <h2 id="home-contas-pagar-mes" class="text-danger mb-0">R$ 0,00</h2>
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
                                <h2 id="home-contas-pagas-mes" class="text-info mb-0">R$ 0,00</h2>
                            </div>
                        </div>
                        <button class="btn btn-info btn-sm" tabindex="8">VER RELATÓRIO DE PAGAMENTOS</button>
                    </div>
                </div>
            </div>

            <!-- Filtros serão exibidos inline no header -->

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
                        <input id="filtro-descricao" type="text" class="form-control form-control-custom" placeholder="Luz / Aluguel / Água" tabindex="11">
                    </div>
                    <div class="col-md-2 mb-3">
                        <label class="form-label">Status</label>
                        <select id="filtro-status" class="form-control form-control-custom" tabindex="12">
                            <option value="">Todas</option>
                            <option value="pago">Pago</option>
                            <option value="aberto">A Pagar</option>
                        </select>
                    </div>
                    <div class="col-md-3 mb-3">
                        <label class="form-label">Período</label>
                        <input id="filtro-periodo" type="text" class="form-control form-control-custom" placeholder="dd/mm/aaaa à dd/mm/aaaa" tabindex="13">
                    </div>
                    <div class="col-md-2 mb-3">
                        <label class="form-label">Categoria</label>
                        <select id="filtro-categoria" class="form-control form-control-custom" tabindex="14">
                            <option value="">Todas</option>
                        </select>
                    </div>
                    <div class="col-md-2 mb-3">
                        <label class="form-label">Fornecedor</label>
                        <select id="filtro-fornecedor" class="form-control form-control-custom" tabindex="15">
                            <option value="">Todos</option>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-2 mb-3">
                        <label class="form-label">Forma de Pagamento</label>
                        <select id="filtro-forma-pagamento" class="form-control form-control-custom" tabindex="16">
                            <option value="">Todas</option>
                        </select>
                    </div>
                    <div class="col-md-2 mb-3 d-flex align-items-end">
                        <button id="btn-filtrar-despesas" class="btn btn-primary btn-custom" tabindex="17">
                            <i class="bi bi-funnel"></i> Filtrar
                        </button>
                    </div>
                    <div class="col-md-2 mb-3 d-flex align-items-end">
                        <button id="btn-limpar-filtros-despesas" class="btn btn-outline-secondary" tabindex="18">Limpar Filtros</button>
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
                        <tbody id="despesas-tbody">
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
                        <input id="filtro-receb-descricao" type="text" class="form-control form-control-custom" placeholder="Vendas / Transferências" tabindex="9">
                    </div>
                    <div class="col-md-3 mb-3">
                        <label class="form-label">Valor</label>
                        <input id="filtro-receb-valor" type="text" class="form-control form-control-custom" placeholder="R$ 0,00" tabindex="10">
                    </div>
                    <div class="col-md-3 mb-3">
                        <label class="form-label">Forma de Recebimento</label>
                        <select id="filtro-receb-forma" class="form-control form-control-custom" tabindex="11">
                            <option value="">Todas</option>
                        </select>
                    </div>
                    <div class="col-md-3 mb-3">
                        <label class="form-label">Período</label>
                        <input id="filtro-receb-periodo" type="text" class="form-control form-control-custom" placeholder="dd/mm/aaaa à dd/mm/aaaa" tabindex="12">
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-2 mb-3 d-flex align-items-end">
                        <button id="btn-filtrar-recebimentos" class="btn btn-primary btn-custom" tabindex="13">
                            <i class="bi bi-funnel"></i> Filtrar
                        </button>
                    </div>
                    <div class="col-md-2 mb-3 d-flex align-items-end">
                        <button id="btn-limpar-filtros-recebimentos" class="btn btn-outline-secondary" tabindex="14">Limpar Filtros</button>
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
                        <tbody id="recebimentos-tbody"></tbody>
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
                        <input id="filtro-venda-descricao" type="text" class="form-control form-control-custom" tabindex="9">
                    </div>
                    <div class="col-md-3 mb-3">
                        <label class="form-label">Valor</label>
                        <input id="filtro-venda-valor" type="text" class="form-control form-control-custom" placeholder="R$ 0,00" tabindex="10">
                    </div>
                    <div class="col-md-3 mb-3">
                        <label class="form-label">Canal de Venda</label>
                        <select id="filtro-venda-canal" class="form-control form-control-custom" tabindex="11">
                            <option value="">Todos</option>
                        </select>
                    </div>
                    <div class="col-md-3 mb-3">
                        <label class="form-label">Período</label>
                        <input id="filtro-venda-periodo" type="text" class="form-control form-control-custom" placeholder="dd/mm/aaaa à dd/mm/aaaa" tabindex="12">
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-2 mb-3 d-flex align-items-end">
                        <button id="btn-filtrar-vendas" class="btn btn-primary btn-custom" tabindex="13">
                            <i class="bi bi-funnel"></i> Filtrar
                        </button>
                    </div>
                    <div class="col-md-2 mb-3 d-flex align-items-end">
                        <button id="btn-limpar-filtros-vendas" class="btn btn-outline-secondary" tabindex="14">Limpar Filtros</button>
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
                        <tbody id="vendas-tbody"></tbody>
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
                        <form id="form-despesa">
                            <div class="row">
                                <div class="col-md-12 mb-3">
                                    <label class="form-label">Descrição:</label>
                                    <input id="despesa-descricao" type="text" class="form-control form-control-custom" tabindex="7" placeholder="Digite a descrição">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Data da Compra:</label>
                                    <input id="despesa-data-compra" type="date" class="form-control form-control-custom" tabindex="8">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Data Vencimento:</label>
                                    <input id="despesa-data-vencimento" type="date" class="form-control form-control-custom" tabindex="9">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Valor:</label>
                                    <input id="despesa-valor" type="text" class="form-control form-control-custom" placeholder="R$ 0,00" tabindex="10">
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Parcelado:</label>
                                    <select id="despesa-parcelado" class="form-control form-control-custom" tabindex="11">
                                        <option value="">Não</option>
                                        <option value="2">2x</option>
                                        <option value="3">3x</option>
                                        <option value="5">5x</option>
                                        <option value="6">6x</option>
                                        <option value="12">12x</option>
                                    </select>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Despesa Fixa:</label>
                                    <select id="despesa-fixa" class="form-control form-control-custom" tabindex="12">
                                        <option value="nao">Não</option>
                                        <option value="sim">Sim</option>
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Categoria:</label>
                                    <select id="despesa-categoria" class="form-control form-control-custom" tabindex="13">
                                        <option value="">Selecione...</option>
                                        <option value="Administrativo">Administrativo</option>
                                        <option value="Operacional">Operacional</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="Impostos">Impostos</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Fornecedor:</label>
                                    <select id="despesa-fornecedor" class="form-control form-control-custom" tabindex="14">
                                        <option value="">Selecione...</option>
                                        <option value="Imobiliária">Imobiliária</option>
                                        <option value="Concessionária">Concessionária</option>
                                        <option value="Prestador Serviços">Prestador Serviços</option>
                                    </select>
                                </div>
                            </div>
                            <small class="text-muted">*A despesa Fixa será lança automaticamente nos próximos meses</small>
                        </form>
                    </div>

                    <div class="card-custom mt-4">
                        <h5 class="mb-4">Dados do Pagamento</h5>
                        <form id="form-despesa-pagamento">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <div class="form-check form-switch">
                                        <input id="despesa-pagamento-realizado" class="form-check-input" type="checkbox" checked tabindex="15">
                                        <label class="form-check-label">Pagamento Realizado:</label>
                                    </div>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Data do Pagamento:</label>
                                    <input id="despesa-data-pagamento" type="date" class="form-control form-control-custom" tabindex="16">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <div class="form-check form-switch">
                                        <input id="despesa-pagamento-nao-realizado" class="form-check-input" type="checkbox" tabindex="17">
                                        <label class="form-check-label">Pagamento Não Realizado:</label>
                                    </div>
                                </div>
                                <div class="col-md-3 mb-3">
                                    <label class="form-label">Valor Pago:</label>
                                    <input id="despesa-valor-pago" type="text" class="form-control form-control-custom" placeholder="R$ 0,00" tabindex="18">
                                </div>
                                <div class="col-md-3 mb-3">
                                    <label class="form-label">Forma de Pagamento:</label>
                                    <select id="despesa-forma-pagamento" class="form-control form-control-custom" tabindex="19">
                                        <option value="">Selecione...</option>
                                        <option value="Dinheiro">Dinheiro</option>
                                        <option value="PIX">PIX</option>
                                        <option value="Cartão Crédito">Cartão Crédito</option>
                                        <option value="Cartão Débito">Cartão Débito</option>
                                        <option value="Boleto">Boleto</option>
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div class="card-custom mt-4">
                        <h5 class="mb-3">Observações:</h5>
                        <textarea id="despesa-observacoes" class="form-control form-control-custom" rows="4" placeholder="Escreva..." tabindex="20"></textarea>
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
                        <form id="form-recebimento">
                            <div class="row">
                                <div class="col-md-12 mb-3">
                                    <label class="form-label">Descrição:</label>
                                    <input id="receb-descricao" type="text" class="form-control form-control-custom" tabindex="7">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Data do Recebimento:</label>
                                    <input id="receb-data-recebimento" type="date" class="form-control form-control-custom" tabindex="8">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Valor:</label>
                                    <input id="receb-valor" type="text" class="form-control form-control-custom" placeholder="R$ 0,00" tabindex="9">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12 mb-3">
                                    <label class="form-label">Forma de Recebimento:</label>
                                    <select id="receb-forma" class="form-control form-control-custom" tabindex="10">
                                        <option value="">Selecione...</option>
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div class="card-custom mt-4">
                        <h5 class="mb-3">Observações:</h5>
                        <textarea id="receb-observacoes" class="form-control form-control-custom" rows="4" placeholder="Escreva..." tabindex="11"></textarea>
                    </div>

                    <div class="text-center mt-4">
                        <button id="btn-salvar-recebimento" class="btn btn-success btn-custom btn-lg me-3" tabindex="12">
                            <i class="bi bi-check-circle"></i> Salvar
                        </button>
                        <button id="btn-cancelar-recebimento" class="btn btn-secondary btn-custom btn-lg" tabindex="13">
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
                        <form id="form-venda">
                            <div class="row">
                                <div class="col-md-12 mb-3">
                                    <label class="form-label">Descrição:</label>
                                    <input id="venda-descricao" type="text" class="form-control form-control-custom" tabindex="7">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Data da Venda:</label>
                                    <input id="venda-data" type="date" class="form-control form-control-custom" tabindex="8">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Valor:</label>
                                    <input id="venda-valor" type="text" class="form-control form-control-custom" placeholder="R$ 0,00" tabindex="9">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12 mb-3">
                                    <label class="form-label">Canal de Venda:</label>
                                    <select id="venda-canal" class="form-control form-control-custom" tabindex="10">
                                        <option value="">Selecione...</option>
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div class="card-custom mt-4">
                        <h5 class="mb-3">Observações:</h5>
                        <textarea id="venda-observacoes" class="form-control form-control-custom" rows="4" placeholder="Escreva..." tabindex="11"></textarea>
                    </div>

                    <div class="text-center mt-4">
                        <button id="btn-salvar-venda" class="btn btn-success btn-custom btn-lg me-3" tabindex="12">
                            <i class="bi bi-check-circle"></i> Salvar
                        </button>
                        <button id="btn-cancelar-venda" class="btn btn-secondary btn-custom btn-lg" tabindex="13">
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

