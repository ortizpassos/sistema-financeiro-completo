// Sistema principal de gestão financeira
class FinancialSystem {
    constructor() {
        this.currentScreen = 'home';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadScreen('home');
        this.initCharts();
    }

    bindEvents() {
        // Navegação do menu lateral
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const screen = e.currentTarget.getAttribute('data-screen');
                if (screen) {
                    this.loadScreen(screen);
                }
            });
        });

        // Delegação de eventos para botões dinâmicos
        document.addEventListener('click', (e) => {
            if (e.target.hasAttribute('data-action')) {
                const action = e.target.getAttribute('data-action');
                this.handleAction(action);
            }
        });
    }

    loadScreen(screenName) {
        const contentArea = document.getElementById('content-area');
        const screen = screens[screenName];
        
        if (screen) {
            this.currentScreen = screenName;
            
            // Atualiza o conteúdo
            contentArea.innerHTML = `
                <div class="fade-in">
                    <h2 class="screen-title">${screen.title}</h2>
                    ${screen.content}
                </div>
            `;

            // Atualiza a navegação visual
            this.updateNavigation(screenName);
            
            // Reinicializa a navegação por teclado
            if (window.keyboardNav) {
                setTimeout(() => {
                    window.keyboardNav.updateFocusableElements();
                    window.keyboardNav.setInitialFocus();
                }, 100);
            }

            // Inicializa gráficos se necessário
            if (screenName === 'home') {
                setTimeout(() => this.initCharts(), 200);
            }
        }
    }

    updateNavigation(screenName) {
        // Remove classe ativa de todos os itens
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Adiciona classe ativa ao item atual
        const activeItem = document.querySelector(`[data-screen="${screenName}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    handleAction(action) {
        switch(action) {
            case 'inserir-despesa':
                this.loadScreen('inserir-despesa');
                break;
            case 'inserir-recebimento':
                this.loadScreen('inserir-recebimento');
                break;
            case 'inserir-vendas':
                this.loadScreen('inserir-vendas');
                break;
            case 'categoria-despesas':
                this.showCategoriasDespesas();
                break;
            case 'cadastrar-fornecedor':
                this.showCadastroFornecedor();
                break;
            case 'formas-pagamento':
                this.showFormasPagamento();
                break;
            case 'formas-recebimento':
                this.showFormasRecebimento();
                break;
            case 'cadastrar-canais':
                this.showCadastroCanais();
                break;
            case 'ver-dre':
                this.showDRE();
                break;
            case 'ver-fluxo-caixa':
                this.showFluxoCaixa();
                break;
            default:
                console.log('Ação não implementada:', action);
        }
    }

    showCategoriasDespesas() {
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = `
            <div class="fade-in">
                <h2 class="screen-title">Cadastrar Categoria de Despesas</h2>
                <div class="row justify-content-center">
                    <div class="col-md-8">
                        <div class="card-custom">
                            <h5 class="mb-4">Inserir Categoria de Despesas:</h5>
                            <div class="category-list">
                                <div class="category-item mb-3 p-3 bg-light rounded d-flex justify-content-between align-items-center">
                                    <span>Administrativo</span>
                                    <button class="btn btn-sm btn-outline-danger" tabindex="7">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                                <div class="category-item mb-3 p-3 bg-light rounded d-flex justify-content-between align-items-center">
                                    <span>Contabilidade</span>
                                    <button class="btn btn-sm btn-outline-danger" tabindex="8">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                                <div class="category-item mb-3 p-3 bg-light rounded d-flex justify-content-between align-items-center">
                                    <span>Seguros</span>
                                    <button class="btn btn-sm btn-outline-danger" tabindex="9">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                                <div class="category-item mb-3 p-3 bg-light rounded d-flex justify-content-between align-items-center">
                                    <span>Salários</span>
                                    <button class="btn btn-sm btn-outline-danger" tabindex="10">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                                <div class="category-item mb-3 p-3 bg-light rounded d-flex justify-content-between align-items-center">
                                    <span>Impostos</span>
                                    <button class="btn btn-sm btn-outline-danger" tabindex="11">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="add-category mt-4">
                                <button class="btn btn-info btn-custom" tabindex="12">
                                    <i class="bi bi-plus-circle"></i> Adicionar Nova Categoria
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.updateKeyboardNav();
    }

    showCadastroFornecedor() {
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = `
            <div class="fade-in">
                <h2 class="screen-title">Cadastrar Fornecedor</h2>
                <div class="row justify-content-center">
                    <div class="col-md-8">
                        <div class="card-custom">
                            <h5 class="mb-4">Inserir Fornecedores:</h5>
                            <div class="supplier-list">
                                <div class="supplier-item mb-3 p-3 bg-light rounded d-flex justify-content-between align-items-center">
                                    <span>Água</span>
                                    <button class="btn btn-sm btn-outline-danger" tabindex="7">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                                <div class="supplier-item mb-3 p-3 bg-light rounded d-flex justify-content-between align-items-center">
                                    <span>Energia</span>
                                    <button class="btn btn-sm btn-outline-danger" tabindex="8">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                                <div class="supplier-item mb-3 p-3 bg-light rounded d-flex justify-content-between align-items-center">
                                    <span>Internet</span>
                                    <button class="btn btn-sm btn-outline-danger" tabindex="9">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                                <div class="supplier-item mb-3 p-3 bg-light rounded d-flex justify-content-between align-items-center">
                                    <span>Fornecedor 1</span>
                                    <button class="btn btn-sm btn-outline-danger" tabindex="10">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                                <div class="supplier-item mb-3 p-3 bg-light rounded d-flex justify-content-between align-items-center">
                                    <span>Fornecedor 2</span>
                                    <button class="btn btn-sm btn-outline-danger" tabindex="11">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="add-supplier mt-4">
                                <button class="btn btn-info btn-custom" tabindex="12">
                                    <i class="bi bi-plus-circle"></i> Adicionar Novo Fornecedor
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.updateKeyboardNav();
    }

    showDRE() {
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = `
            <div class="fade-in">
                <h2 class="screen-title">DRE - Demonstrativo de Resultado do Exercício</h2>
                <div class="card-custom">
                    <h5 class="mb-3">Resultado DRE</h5>
                    <div class="table-responsive">
                        <table class="table table-custom">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Junho</th>
                                    <th>Julho</th>
                                    <th>Agosto</th>
                                    <th>Setembro</th>
                                    <th>Outubro</th>
                                    <th>Novembro</th>
                                    <th>Dezembro</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="table-secondary">
                                    <td><strong>Saldo Inicial</strong></td>
                                    <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>
                                </tr>
                                <tr class="table-success">
                                    <td><strong>Receita Operacional</strong></td>
                                    <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>
                                </tr>
                                <tr>
                                    <td>Ecommerce</td>
                                    <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>
                                </tr>
                                <tr>
                                    <td>Loja Física</td>
                                    <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>
                                </tr>
                                <tr>
                                    <td>Whatsapp</td>
                                    <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>
                                </tr>
                                <tr>
                                    <td>Instagram</td>
                                    <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>
                                </tr>
                                <tr class="table-warning">
                                    <td><strong>Devoluções</strong></td>
                                    <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>
                                </tr>
                                <tr>
                                    <td>Impostos</td>
                                    <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>
                                </tr>
                                <tr class="table-success">
                                    <td><strong>Receita Líquida</strong></td>
                                    <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>
                                </tr>
                                <tr class="table-danger">
                                    <td><strong>Despesas Oper,Geral e Adm</strong></td>
                                    <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td><strong>4.223,09</strong></td>
                                </tr>
                                <tr>
                                    <td>Administrativo</td>
                                    <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>3.289,09</td>
                                </tr>
                                <tr>
                                    <td>Contabilidade</td>
                                    <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>
                                </tr>
                                <tr>
                                    <td>Logística</td>
                                    <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>522,75</td>
                                </tr>
                                <tr>
                                    <td>Salários</td>
                                    <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>
                                </tr>
                                <tr>
                                    <td>Taxas</td>
                                    <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>40,10</td>
                                </tr>
                                <tr class="table-info">
                                    <td><strong>Lucro Líquido</strong></td>
                                    <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td><strong>7.074,15</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        this.updateKeyboardNav();
    }

    showFluxoCaixa() {
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = `
            <div class="fade-in">
                <h2 class="screen-title">Fluxo de Caixa</h2>
                <div class="card-custom">
                    <h5 class="mb-3">Resultado Fluxo de Caixa</h5>
                    <div class="table-responsive">
                        <table class="table table-custom">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Junho</th>
                                    <th>Julho</th>
                                    <th>Agosto</th>
                                    <th>Setembro</th>
                                    <th>Outubro</th>
                                    <th>Novembro</th>
                                    <th>Dezembro</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="table-secondary">
                                    <td><strong>Saldo Inicial</strong></td>
                                    <td>50.659,31</td><td>50.659,31</td><td>50.659,31</td><td>50.659,31</td><td>50.659,31</td><td>50.659,31</td><td>50.659,31</td><td>28.324,70</td>
                                </tr>
                                <tr class="table-success">
                                    <td><strong>Recebimentos</strong></td>
                                    <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>56.642,16</td>
                                </tr>
                                <tr>
                                    <td>Dinheiro</td>
                                    <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>2.671,10</td>
                                </tr>
                                <tr>
                                    <td>Stone</td>
                                    <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>26.771,06</td>
                                </tr>
                                <tr>
                                    <td>Sicoob PJ</td>
                                    <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>9.500,00</td>
                                </tr>
                                <tr>
                                    <td>Sicoob PF</td>
                                    <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>11.200,00</td>
                                </tr>
                                <tr>
                                    <td>Santander</td>
                                    <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>6.500,00</td>
                                </tr>
                                <tr class="table-danger">
                                    <td><strong>Custos e Despesas</strong></td>
                                    <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>34.304,55</td>
                                </tr>
                                <tr>
                                    <td>Administrativo</td>
                                    <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>3.636,15</td>
                                </tr>
                                <tr>
                                    <td>Contabilidade</td>
                                    <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>270,35</td>
                                </tr>
                                <tr>
                                    <td>Manutenção Loja/Carro</td>
                                    <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>274,33</td>
                                </tr>
                                <tr>
                                    <td>Equipamentos</td>
                                    <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>240,76</td>
                                </tr>
                                <tr>
                                    <td>Logística</td>
                                    <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>522,75</td>
                                </tr>
                                <tr>
                                    <td>Material de escritório</td>
                                    <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>169,70</td>
                                </tr>
                                <tr>
                                    <td>Salários</td>
                                    <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>3.500,00</td>
                                </tr>
                                <tr>
                                    <td>Taxas</td>
                                    <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>195,60</td>
                                </tr>
                                <tr>
                                    <td>Outros Projetos</td>
                                    <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>1.506,40</td>
                                </tr>
                                <tr class="table-info">
                                    <td><strong>Saldo Final</strong></td>
                                    <td>50.659,31</td><td>50.659,31</td><td>50.659,31</td><td>50.659,31</td><td>50.659,31</td><td>50.659,31</td><td>50.659,31</td><td>50.659,31</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        this.updateKeyboardNav();
    }

    updateKeyboardNav() {
        if (window.keyboardNav) {
            setTimeout(() => {
                window.keyboardNav.updateFocusableElements();
                window.keyboardNav.setInitialFocus();
            }, 100);
        }
    }

    initCharts() {
        // Simula gráficos com Canvas (implementação básica)
        this.drawBarChart('vendasChart', [400, 450, 500, 550, 600, 650, 700, 750]);
        this.drawBarChart('recebimentosChart', [350, 400, 450, 500, 550, 600, 650, 700]);
        this.drawPieChart('despesasChart', [
            {label: 'Salário', value: 50, color: '#17a2b8'},
            {label: 'Estoque', value: 20, color: '#007bff'},
            {label: 'Aluguel', value: 15, color: '#6c757d'},
            {label: 'Sistemas', value: 10, color: '#28a745'},
            {label: 'Impostos', value: 5, color: '#ffc107'}
        ]);
        this.drawPieChart('canaisChart', [
            {label: 'Loja Física', value: 50, color: '#17a2b8'},
            {label: 'Instagram', value: 20, color: '#007bff'},
            {label: 'E-commerce', value: 13, color: '#6c757d'},
            {label: 'WhatsApp', value: 10, color: '#28a745'},
            {label: 'Marketplace', value: 7, color: '#ffc107'}
        ]);
    }

    drawBarChart(canvasId, data) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Limpa o canvas
        ctx.clearRect(0, 0, width, height);
        
        // Configurações
        const barWidth = width / data.length * 0.8;
        const maxValue = Math.max(...data);
        const barSpacing = width / data.length * 0.2;
        
        // Desenha as barras
        data.forEach((value, index) => {
            const barHeight = (value / maxValue) * (height - 40);
            const x = index * (barWidth + barSpacing) + barSpacing / 2;
            const y = height - barHeight - 20;
            
            ctx.fillStyle = '#17a2b8';
            ctx.fillRect(x, y, barWidth, barHeight);
        });
        
        // Adiciona labels dos meses
        const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO'];
        ctx.fillStyle = '#333';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        
        months.forEach((month, index) => {
            const x = index * (barWidth + barSpacing) + barSpacing / 2 + barWidth / 2;
            ctx.fillText(month, x, height - 5);
        });
    }

    drawPieChart(canvasId, data) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 20;
        
        // Limpa o canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let currentAngle = 0;
        const total = data.reduce((sum, item) => sum + item.value, 0);
        
        data.forEach(item => {
            const sliceAngle = (item.value / total) * 2 * Math.PI;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = item.color;
            ctx.fill();
            
            // Adiciona texto
            const textAngle = currentAngle + sliceAngle / 2;
            const textX = centerX + Math.cos(textAngle) * (radius * 0.7);
            const textY = centerY + Math.sin(textAngle) * (radius * 0.7);
            
            ctx.fillStyle = 'white';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${item.value}%`, textX, textY);
            
            currentAngle += sliceAngle;
        });
        
        // Círculo central
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.4, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
        
        // Texto central
        ctx.fillStyle = '#333';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Total', centerX, centerY - 5);
        ctx.font = '10px Arial';
        ctx.fillText('R$ 4.500,00', centerX, centerY + 10);
    }
}

// Função global para voltar à tela inicial
function voltarTela() {
    if (window.financialSystem) {
        window.financialSystem.loadScreen('home');
    }
}

// Função global para carregar telas (usada pela navegação por teclado)
function loadScreen(screenName) {
    if (window.financialSystem) {
        window.financialSystem.loadScreen(screenName);
    }
}

// Inicializa o sistema quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.financialSystem = new FinancialSystem();
});

