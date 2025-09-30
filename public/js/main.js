// Sistema principal de gestão financeira
class FinancialSystem {
    constructor() {
        this.currentScreen = 'home';
        this.editingExpenseId = null;
        // Estado de filtros da Home (período aplicado aos gráficos e cartões)
        this.homeFilterInicio = null; // Date ou null
        this.homeFilterFim = null; // Date ou null
        this.expenseFilters = {
            descricao: '',
            status: '',
            periodo: '',
            categoria: '',
            fornecedor: '',
            formaPagamento: ''
        };
        this.receiptFilters = {
            descricao: '',
            valor: '',
            periodo: '',
            forma: ''
        };
        this.editingReceiptId = null;
        this.salesFilters = { descricao:'', valor:'', periodo:'', canal:'' };
        this.editingSaleId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadScreen('home');
        this.initCharts();
        this.updateSidebarSaldo();
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

        // Se não é a Home, remove botão e filtros caso existam
        if(screenName !== 'home'){
            const header = document.querySelector('.header-section');
            if(header){
                const btn = header.querySelector('#home-filter-toggle');
                const inline = header.querySelector('#home-inline-filters');
                if(btn) btn.remove();
                if(inline) inline.remove();
                // Se não houver mais que o botão Voltar, remove classes extras
                if(header.querySelectorAll('button').length === 1){
                    header.classList.remove('d-flex','align-items-center');
                }
            }
        }
        
        // Tela Saldo em Conta será construída dinamicamente ignorando template estático de screens.js
        if(screenName === 'saldo-conta'){
            this.currentScreen = screenName;
            this.showSaldoContas();
            return;
        }

        if (screen) {
            this.currentScreen = screenName;
            
            // Atualiza o conteúdo
            contentArea.innerHTML = `
                <div class="fade-in">
                    <div id="home-header-bar" class="d-flex justify-content-between align-items-start flex-wrap gap-2">
                        <h2 class="screen-title mb-0">${screen.title}</h2>
                    </div>
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
                setTimeout(() => { 
                    this.initCharts(); 
                    this.renderHomeSaldo();
                    // Se filtros já estavam definidos (navegação de volta) reaplica
                    if(this.homeFilterInicio || this.homeFilterFim){
                        this.refreshHomeData();
                    }
                    // Injeta botão de filtros na barra superior global (mesma linha do Voltar)
                    const header = document.querySelector('.header-section');
                    if(header && !header.querySelector('#home-filter-toggle')){
                        header.classList.add('d-flex','align-items-center');
                        // Cria container inline (inicialmente oculto) ANTES do botão
                        const inline = document.createElement('div');
                        inline.id = 'home-inline-filters';
                        inline.className = 'home-inline-filters d-none flex-wrap align-items-end gap-2 ms-3';
                        inline.innerHTML = `
                            <div class="d-flex flex-wrap align-items-end gap-2">
                                <div class="d-flex flex-column">
                                    <label class="form-label small mb-0">Data Inicial</label>
                                    <input type="date" id="home-filter-inicio" class="form-control form-control-custom form-control-sm" style="min-width:140px" tabindex="31" />
                                </div>
                                <div class="d-flex flex-column">
                                    <label class="form-label small mb-0">Data Final</label>
                                    <input type="date" id="home-filter-fim" class="form-control form-control-custom form-control-sm" style="min-width:140px" tabindex="32" />
                                </div>
                                <div class="d-flex gap-1 pb-1">
                                    <button id="home-filter-aplicar" class="btn btn-success btn-sm" tabindex="33" title="Aplicar"><i class="bi bi-check2"></i></button>
                                    <button id="home-filter-limpar" class="btn btn-outline-secondary btn-sm" tabindex="34" title="Limpar"><i class="bi bi-x"></i></button>
                                </div>
                                <small class="text-muted">Vazio = últimos 8 meses.</small>
                            </div>`;
                        // Botão de filtros (apenas exibe/oculta inline)
                        const btn = document.createElement('button');
                        btn.id = 'home-filter-toggle';
                        btn.className = 'btn btn-outline-primary btn-sm ms-auto';
                        btn.setAttribute('tabindex','30');
                        btn.innerHTML = '<i class="bi bi-funnel"></i> Filtros';
                        // Inserções: primeiro inline depois botão ao final (ms-auto empurra inline para esquerda quando visível)
                        header.appendChild(inline);
                        header.appendChild(btn);
                        // Força rebind para novo layout
                        this._homeFiltersBound = false;
                        this.bindHomeFilters();
                    }
                }, 200);
            }

            if (screenName === 'lancamento-despesas') {
                // garante seed e renderiza
                if (window.expenseService) {
                    expenseService.seedIfEmpty();
                }
                this.populateFilterSelects();
                this.bindExpenseFilterEvents();
                this.renderExpenseList();
            }
            if (screenName === 'inserir-despesa') {
                this.prepareExpenseForm();
            }
            if (screenName === 'lancamento-recebimentos') {
                if(window.receiptService){ receiptService.seedIfEmpty(); }
                this.populateReceiptFilterSelects();
                this.bindReceiptFilterEvents();
                this.renderReceiptList();
            }
            if (screenName === 'inserir-recebimento') {
                this.prepareReceiptForm();
            }
            if (screenName === 'lancamento-vendas') {
                if(window.salesService){ salesService.seedIfEmpty(); }
                this.populateSalesFilterSelects();
                this.bindSalesFilterEvents();
                this.renderSalesList();
            }
            if (screenName === 'inserir-vendas') {
                this.prepareSaleForm();
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
            case 'ver-saldo-conta':
                this.loadScreen('saldo-conta');
                break;
            default:
                console.log('Ação não implementada:', action);
        }
    }

    showDRE(){
        // Coleta dados dos serviços existentes
        const expenses = window.expenseService ? expenseService.list() : [];
        const receipts = window.receiptService ? receiptService.list() : [];
        const sales = window.salesService ? salesService.list() : [];

        const contentArea = document.getElementById('content-area');
        const periodFilterHtml = `
            <div class="card-custom mb-4">
                <h5 class="mb-3">Filtro de Período</h5>
                <div class="row g-3 align-items-end">
                    <div class="col-md-3">
                        <label class="form-label">Data Inicial</label>
                        <input id="dre-data-inicial" type="date" class="form-control form-control-custom" />
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Data Final</label>
                        <input id="dre-data-final" type="date" class="form-control form-control-custom" />
                    </div>
                    <div class="col-md-2">
                        <button id="dre-aplicar" class="btn btn-success btn-custom w-100"><i class="bi bi-funnel"></i> Aplicar</button>
                    </div>
                    <div class="col-md-2">
                        <button id="dre-limpar" class="btn btn-outline-secondary w-100">Limpar</button>
                    </div>
                </div>
            </div>`;

        contentArea.innerHTML = `
            <div class="fade-in">
                <h2 class="screen-title">DRE - Demonstrativo de Resultado</h2>
                ${periodFilterHtml}
                <div id="dre-resultado"></div>
            </div>`;

        const render = () => {
            const diVal = document.getElementById('dre-data-inicial').value;
            const dfVal = document.getElementById('dre-data-final').value;
            const di = diVal? new Date(diVal): null;
            const df = dfVal? new Date(dfVal): null;
            const inRange = (dateStr) => {
                if(!dateStr) return true;
                const d = new Date(dateStr);
                if(di && d < di) return false;
                if(df && d > df) return false;
                return true;
            };

            // Receitas = vendas + recebimentos
            const receitasList = [...sales.map(s=> ({tipo:'Venda', categoria:'Vendas', data:s.dataVenda, valor:s.valor, origem:s})),
                                   ...receipts.map(r=> ({tipo:'Recebimento', categoria:'Outras Receitas', data:r.dataRecebimento, valor:r.valor, origem:r}))]
                                   .filter(r=> inRange(r.data));
            const totalReceitas = receitasList.reduce((sum,r)=> sum + r.valor, 0);
            // Despesas (considera valor pago se pago, senão valor previsto?) Aqui usaremos sempre d.valor
            const despesasList = expenses.filter(d=> inRange(d.dataVencimento||d.dataCompra)).map(d=> ({
                tipo:'Despesa',
                categoria: d.categoria || 'Outras',
                data: d.dataVencimento || d.dataCompra,
                valor: d.valor,
                origem: d
            }));
            const totalDespesas = despesasList.reduce((s,d)=> s + d.valor, 0);
            const lucroBruto = totalReceitas - totalDespesas;

            // Breakdown por categoria (despesas)
            const mapCatDesp = {};
            despesasList.forEach(d=> { mapCatDesp[d.categoria] = (mapCatDesp[d.categoria]||0)+d.valor; });
            const catRows = Object.entries(mapCatDesp).sort((a,b)=> b[1]-a[1]).map(([cat,val])=>`<tr><td>${cat}</td><td class="text-end">${val.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</td></tr>`).join('') || '<tr><td colspan="2" class="text-muted">Sem despesas no período</td></tr>';

            // Breakdown receitas (por tipo)
            const mapTipoRec = {};
            receitasList.forEach(r=> { mapTipoRec[r.categoria] = (mapTipoRec[r.categoria]||0)+r.valor; });
            const recRows = Object.entries(mapTipoRec).sort((a,b)=> b[1]-a[1]).map(([cat,val])=>`<tr><td>${cat}</td><td class="text-end">${val.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</td></tr>`).join('') || '<tr><td colspan="2" class="text-muted">Sem receitas no período</td></tr>';

            // Margens
            const margemPercent = totalReceitas>0 ? (lucroBruto/totalReceitas*100) : 0;

            const dreEl = document.getElementById('dre-resultado');
            dreEl.innerHTML = `
                <div class="row">
                    <div class="col-md-4 mb-4">
                        <div class="card-custom h-100">
                            <h5 class="mb-3">Receitas</h5>
                            <table class="table table-custom table-sm">
                                <tbody>${recRows}</tbody>
                                <tfoot><tr><th>Total</th><th class="text-end">${totalReceitas.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</th></tr></tfoot>
                            </table>
                        </div>
                    </div>
                    <div class="col-md-4 mb-4">
                        <div class="card-custom h-100">
                            <h5 class="mb-3">Despesas</h5>
                            <table class="table table-custom table-sm">
                                <tbody>${catRows}</tbody>
                                <tfoot><tr><th>Total</th><th class="text-end">${totalDespesas.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</th></tr></tfoot>
                            </table>
                        </div>
                    </div>
                    <div class="col-md-4 mb-4">
                        <div class="card-custom h-100 d-flex flex-column">
                            <h5 class="mb-3">Resultado</h5>
                            <div class="mb-2 d-flex justify-content-between"><span>Lucro Bruto:</span><strong>${lucroBruto.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</strong></div>
                            <div class="mb-2 d-flex justify-content-between"><span>Margem (%):</span><strong>${margemPercent.toFixed(2)}%</strong></div>
                            <hr>
                            <h6>Resumo</h6>
                            <small class="text-muted">Receitas incluem Vendas e Recebimentos. Despesas incluem todas as despesas cadastradas no período filtrado.</small>
                        </div>
                    </div>
                </div>`;
        };

        // Bind filtros
        document.getElementById('dre-aplicar').addEventListener('click', (e)=>{ e.preventDefault(); render(); });
        document.getElementById('dre-limpar').addEventListener('click', (e)=>{ e.preventDefault(); document.getElementById('dre-data-inicial').value=''; document.getElementById('dre-data-final').value=''; render(); });

        render();
        this.updateKeyboardNav();
        this.updateSidebarSaldo();
    }

    /* ================= RECEBIMENTOS DINÂMICOS ================= */
    populateReceiptFilterSelects(){
        const formaSel = document.getElementById('filtro-receb-forma');
        if(formaSel && window.receiptMethodService){
            receiptMethodService.seedIfEmpty();
            const list = receiptMethodService.list();
            const current = formaSel.value;
            formaSel.innerHTML = '<option value="">Todas</option>' + list.map(f=>`<option value="${f.nome}">${f.nome}</option>`).join('');
            if(current) formaSel.value = current;
        }
    }
    collectReceiptFilters(){
        this.receiptFilters.descricao = document.getElementById('filtro-receb-descricao')?.value || '';
        this.receiptFilters.valor = document.getElementById('filtro-receb-valor')?.value || '';
        this.receiptFilters.forma = document.getElementById('filtro-receb-forma')?.value || '';
        this.receiptFilters.periodo = document.getElementById('filtro-receb-periodo')?.value || '';
    }
    clearReceiptFilters(){
        this.receiptFilters = {descricao:'', valor:'', periodo:'', forma:''};
        ['filtro-receb-descricao','filtro-receb-valor','filtro-receb-periodo','filtro-receb-forma'].forEach(id=>{const el=document.getElementById(id); if(el) el.value='';});
        this.renderReceiptList();
    }
    applyReceiptFilters(list){
        const f = this.receiptFilters;
        let filtered = [...list];
        if(f.descricao){ filtered = filtered.filter(r => r.descricao.toLowerCase().includes(f.descricao.toLowerCase())); }
        if(f.valor){
            const target = this.parseValorBR(f.valor);
            if(target>0){ filtered = filtered.filter(r => Math.abs(r.valor - target) < 0.005); }
        }
        if(f.forma){ filtered = filtered.filter(r => (r.formaRecebimento||'') === f.forma); }
        if(f.periodo){
            const parts = f.periodo.split('à').map(p=>p.trim());
            if(parts.length===2){
                const [ini, fim] = parts;
                const parseDateBR = (d)=>{ const m=d.match(/(\d{2})\/(\d{2})\/(\d{4})/); if(!m) return null; return new Date(+m[3], +m[2]-1, +m[1]); };
                const di = parseDateBR(ini); const df = parseDateBR(fim);
                if(di && df){
                    filtered = filtered.filter(r=>{ const d = new Date(r.dataRecebimento); return d>=di && d<=df; });
                }
            }
        }
        return filtered;
    }
    bindReceiptFilterEvents(){
        const btnFiltrar = document.getElementById('btn-filtrar-recebimentos');
        const btnLimpar = document.getElementById('btn-limpar-filtros-recebimentos');
        if(btnFiltrar){ btnFiltrar.addEventListener('click',(e)=>{ e.preventDefault(); this.collectReceiptFilters(); this.renderReceiptList(); }); }
        if(btnLimpar){ btnLimpar.addEventListener('click',(e)=>{ e.preventDefault(); this.clearReceiptFilters(); }); }
    }
    renderReceiptList(){
        const tbody = document.getElementById('recebimentos-tbody');
        if(!tbody || !window.receiptService) return;
        const list = this.applyReceiptFilters(receiptService.list());
        if(list.length===0){ tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Nenhum recebimento cadastrado</td></tr>'; return; }
        tbody.innerHTML = list.map((r,idx)=>{
            const valorFormat = r.valor.toLocaleString('pt-BR',{style:'currency', currency:'BRL'});
            return `<tr data-id="${r.id}">
                <td><strong>${r.descricao}</strong></td>
                <td>${r.observacoes ? '<i class="bi bi-chat-square-text text-primary"></i>':''}</td>
                <td><strong>${valorFormat}</strong></td>
                <td>${this.formatDate(r.dataRecebimento)}</td>
                <td>${r.formaRecebimento||'-'}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" data-receb-edit tabindex="${30+idx*3}"><i class="bi bi-pencil"></i> Editar</button>
                    <button class="btn btn-sm btn-outline-danger" data-receb-delete tabindex="${31+idx*3}"><i class="bi bi-trash"></i> Excluir</button>
                </td>
            </tr>`;
        }).join('');
        tbody.querySelectorAll('[data-receb-edit]').forEach(btn=>{
            btn.addEventListener('click',(e)=>{
                const id = e.currentTarget.closest('tr').dataset.id;
                this.openEditReceipt(id);
            });
        });
        tbody.querySelectorAll('[data-receb-delete]').forEach(btn=>{
            btn.addEventListener('click',(e)=>{
                const id = e.currentTarget.closest('tr').dataset.id;
                if(confirm('Excluir recebimento?')){ receiptService.remove(id); this.renderReceiptList(); }
            });
        });
    }
    openEditReceipt(id){
        this.editingReceiptId = id;
        this.loadScreen('inserir-recebimento');
    }
    prepareReceiptForm(){
        if(window.receiptMethodService){ receiptMethodService.seedIfEmpty(); }
        const setVal = (id,val)=>{ const el=document.getElementById(id); if(el) el.value = val??''; };
        // popular formas
        const formaSel = document.getElementById('receb-forma');
        if(formaSel && window.receiptMethodService){
            const list = receiptMethodService.list();
            const current = formaSel.value;
            formaSel.innerHTML = '<option value="">Selecione...</option>' + list.map(f=>`<option value="${f.nome}">${f.nome}</option>`).join('');
            if(current) formaSel.value = current;
        }
        // datas default
        const today = new Date().toISOString().substring(0,10);
        setVal('receb-data-recebimento', today);
        if(this.editingReceiptId){
            const item = receiptService.list().find(r=>r.id===this.editingReceiptId);
            if(item){
                setVal('receb-descricao', item.descricao);
                setVal('receb-data-recebimento', item.dataRecebimento);
                const valorEl = document.getElementById('receb-valor'); if(valorEl) valorEl.value = item.valor.toLocaleString('pt-BR',{minimumFractionDigits:2});
                setVal('receb-forma', item.formaRecebimento||'');
                setVal('receb-observacoes', item.observacoes||'');
            }
        }
        // máscara simples valor
        const valorEl = document.getElementById('receb-valor');
        if(valorEl){
            valorEl.addEventListener('blur', ()=>{
                const n = this.parseValorBR(valorEl.value);
                valorEl.value = n.toLocaleString('pt-BR',{minimumFractionDigits:2});
            });
            valorEl.addEventListener('focus', ()=>{
                const n = this.parseValorBR(valorEl.value);
                if(n) valorEl.value = n.toFixed(2).replace('.',',');
            });
        }
        const btnSalvar = document.getElementById('btn-salvar-recebimento');
        const btnCancelar = document.getElementById('btn-cancelar-recebimento');
        if(btnSalvar){ btnSalvar.addEventListener('click',(e)=>{ e.preventDefault(); this.saveReceiptFromForm(); }); }
        if(btnCancelar){ btnCancelar.addEventListener('click',(e)=>{ e.preventDefault(); this.loadScreen('lancamento-recebimentos'); }); }
    }
    saveReceiptFromForm(){
        const get = id => document.getElementById(id);
        const descricao = get('receb-descricao')?.value.trim();
        if(!descricao){ alert('Informe a descrição'); get('receb-descricao').focus(); return; }
        const valor = this.parseValorBR(get('receb-valor')?.value);
        if(valor<=0){ alert('Valor inválido'); get('receb-valor').focus(); return; }
        const dataRecebimento = get('receb-data-recebimento')?.value || new Date().toISOString().substring(0,10);
        const formaRecebimento = get('receb-forma')?.value || '';
        const observacoes = get('receb-observacoes')?.value || '';
        const payload = {descricao, valor, dataRecebimento, formaRecebimento, observacoes};
        if(this.editingReceiptId){ receiptService.update(this.editingReceiptId, payload); }
        else { receiptService.create(payload); }
        this.editingReceiptId = null;
        this.loadScreen('lancamento-recebimentos');
        this.updateSidebarSaldo();
    }

    showFormasRecebimento(){
        if(window.receiptMethodService){ receiptMethodService.seedIfEmpty(); }
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = `
            <div class="fade-in">
                <h2 class="screen-title">Formas de Recebimento</h2>
                <div class="row justify-content-center">
                    <div class="col-md-8">
                        <div class="card-custom">
                            <h5 class="mb-4">Gerenciar Formas</h5>
                            <div class="mb-3 d-flex gap-2">
                                <input id="nova-forma-recebimento" type="text" class="form-control form-control-custom" placeholder="Ex: Depósito" tabindex="7" />
                                <button id="btn-add-forma-receb" class="btn btn-info btn-custom" tabindex="8"><i class="bi bi-plus-circle"></i> Adicionar</button>
                            </div>
                            <div id="lista-formas-recebimento"></div>
                        </div>
                    </div>
                </div>
            </div>`;
        this.renderFormasRecebimento();
        const addBtn = document.getElementById('btn-add-forma-receb');
        if(addBtn){
            addBtn.addEventListener('click',(e)=>{
                e.preventDefault();
                const inp = document.getElementById('nova-forma-recebimento');
                const nome = inp.value.trim();
                if(!nome){ alert('Informe o nome'); inp.focus(); return; }
                if(!receiptMethodService.create(nome)){ alert('Forma já existe ou inválida'); return; }
                inp.value='';
                this.renderFormasRecebimento();
                this.refreshFormasRecebimentoSelects();
            });
        }
        this.updateKeyboardNav();
    }
    renderFormasRecebimento(){
        const container = document.getElementById('lista-formas-recebimento');
        if(!container || !window.receiptMethodService) return;
        const list = receiptMethodService.list();
        if(list.length===0){ container.innerHTML = '<p class="text-muted">Nenhuma forma cadastrada.</p>'; return; }
        container.innerHTML = list.map((f,idx)=>`
            <div class="mb-2 p-3 bg-light rounded d-flex justify-content-between align-items-center" data-id="${f.id}">
                <span>${f.nome}</span>
                <button class="btn btn-sm btn-outline-danger" data-remove-forma-receb tabindex="${9+idx}"><i class="bi bi-trash"></i></button>
            </div>`).join('');
        container.querySelectorAll('[data-remove-forma-receb]').forEach(btn=>{
            btn.addEventListener('click',(e)=>{
                const id = e.currentTarget.closest('[data-id]').dataset.id;
                if(confirm('Remover forma de recebimento?')){
                    receiptMethodService.remove(id);
                    this.renderFormasRecebimento();
                    this.refreshFormasRecebimentoSelects();
                }
            });
        });
        this.refreshFormasRecebimentoSelects();
    }
    refreshFormasRecebimentoSelects(){
        const selects = document.querySelectorAll('#receb-forma');
        if(!window.receiptMethodService || selects.length===0) return;
        const list = receiptMethodService.list();
        selects.forEach(sel=>{
            const current = sel.value;
            sel.innerHTML = '<option value="">Selecione...</option>' + list.map(f=>`<option value="${f.nome}">${f.nome}</option>`).join('');
            if(current) sel.value = current;
        });
    }

    /* ================= VENDAS DINÂMICAS ================= */
    populateSalesFilterSelects(){
        const canalSel = document.getElementById('filtro-venda-canal');
        if(canalSel && window.salesChannelService){
            salesChannelService.seedIfEmpty();
            const list = salesChannelService.list();
            const current = canalSel.value;
            canalSel.innerHTML = '<option value="">Todos</option>' + list.map(c=>`<option value="${c.nome}">${c.nome}</option>`).join('');
            if(current) canalSel.value = current;
        }
    }
    collectSalesFilters(){
        this.salesFilters.descricao = document.getElementById('filtro-venda-descricao')?.value || '';
        this.salesFilters.valor = document.getElementById('filtro-venda-valor')?.value || '';
        this.salesFilters.canal = document.getElementById('filtro-venda-canal')?.value || '';
        this.salesFilters.periodo = document.getElementById('filtro-venda-periodo')?.value || '';
    }
    clearSalesFilters(){
        this.salesFilters = {descricao:'', valor:'', periodo:'', canal:''};
        ['filtro-venda-descricao','filtro-venda-valor','filtro-venda-periodo','filtro-venda-canal'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; });
        this.renderSalesList();
    }
    applySalesFilters(list){
        const f = this.salesFilters; let filtered=[...list];
        if(f.descricao){ filtered = filtered.filter(s=> s.descricao.toLowerCase().includes(f.descricao.toLowerCase())); }
        if(f.valor){ const target = this.parseValorBR(f.valor); if(target>0){ filtered = filtered.filter(s=> Math.abs(s.valor - target) < 0.005); } }
        if(f.canal){ filtered = filtered.filter(s=> (s.canal||'') === f.canal); }
        if(f.periodo){
            const parts = f.periodo.split('à').map(p=>p.trim());
            if(parts.length===2){
                const [ini,fim] = parts;
                const parseDateBR = (d)=>{ const m=d.match(/(\d{2})\/(\d{2})\/(\d{4})/); if(!m) return null; return new Date(+m[3], +m[2]-1, +m[1]); };
                const di=parseDateBR(ini); const df=parseDateBR(fim);
                if(di && df){ filtered = filtered.filter(s=> { const d=new Date(s.dataVenda); return d>=di && d<=df; }); }
            }
        }
        return filtered;
    }
    bindSalesFilterEvents(){
        const btnFiltrar = document.getElementById('btn-filtrar-vendas');
        const btnLimpar = document.getElementById('btn-limpar-filtros-vendas');
        if(btnFiltrar){ btnFiltrar.addEventListener('click',(e)=>{ e.preventDefault(); this.collectSalesFilters(); this.renderSalesList(); }); }
        if(btnLimpar){ btnLimpar.addEventListener('click',(e)=>{ e.preventDefault(); this.clearSalesFilters(); }); }
    }
    renderSalesList(){
        const tbody = document.getElementById('vendas-tbody');
        if(!tbody || !window.salesService) return;
        const list = this.applySalesFilters(salesService.list());
        if(list.length===0){ tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Nenhuma venda cadastrada</td></tr>'; return; }
        tbody.innerHTML = list.map((s,idx)=>{
            const valorFormat = s.valor.toLocaleString('pt-BR',{style:'currency', currency:'BRL'});
            return `<tr data-id="${s.id}">
                <td><strong>${s.descricao}</strong></td>
                <td>${s.observacoes? '<i class=\"bi bi-chat-square-text text-primary\"></i>':''}</td>
                <td><strong>${valorFormat}</strong></td>
                <td>${this.formatDate(s.dataVenda)}</td>
                <td>${s.canal||'-'}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" data-sale-edit tabindex="${60+idx*3}"><i class="bi bi-pencil"></i> Editar</button>
                    <button class="btn btn-sm btn-outline-danger" data-sale-delete tabindex="${61+idx*3}"><i class="bi bi-trash"></i> Excluir</button>
                </td>
            </tr>`;
        }).join('');
        tbody.querySelectorAll('[data-sale-edit]').forEach(btn=>{
            btn.addEventListener('click',(e)=>{ const id = e.currentTarget.closest('tr').dataset.id; this.openEditSale(id); });
        });
        tbody.querySelectorAll('[data-sale-delete]').forEach(btn=>{
            btn.addEventListener('click',(e)=>{ const id = e.currentTarget.closest('tr').dataset.id; if(confirm('Excluir venda?')){ salesService.remove(id); this.renderSalesList(); } });
        });
    }
    openEditSale(id){ this.editingSaleId = id; this.loadScreen('inserir-vendas'); }
    prepareSaleForm(){
        if(window.salesChannelService){ salesChannelService.seedIfEmpty(); }
        const setVal=(id,val)=>{ const el=document.getElementById(id); if(el) el.value=val??''; };
        const canalSel = document.getElementById('venda-canal');
        if(canalSel && window.salesChannelService){
            const list = salesChannelService.list();
            const current = canalSel.value;
            canalSel.innerHTML = '<option value="">Selecione...</option>' + list.map(c=>`<option value="${c.nome}">${c.nome}</option>`).join('');
            if(current) canalSel.value=current;
        }
        const today = new Date().toISOString().substring(0,10);
        setVal('venda-data', today);
        if(this.editingSaleId){
            const item = salesService.list().find(s=>s.id===this.editingSaleId);
            if(item){
                setVal('venda-descricao', item.descricao);
                setVal('venda-data', item.dataVenda);
                const valorEl = document.getElementById('venda-valor'); if(valorEl) valorEl.value = item.valor.toLocaleString('pt-BR',{minimumFractionDigits:2});
                setVal('venda-canal', item.canal||'');
                setVal('venda-observacoes', item.observacoes||'');
            }
        }
        const valorEl = document.getElementById('venda-valor');
        if(valorEl){
            valorEl.addEventListener('blur', ()=>{ const n=this.parseValorBR(valorEl.value); valorEl.value = n.toLocaleString('pt-BR',{minimumFractionDigits:2}); });
            valorEl.addEventListener('focus', ()=>{ const n=this.parseValorBR(valorEl.value); if(n) valorEl.value = n.toFixed(2).replace('.',','); });
        }
        const btnSalvar = document.getElementById('btn-salvar-venda');
        const btnCancelar = document.getElementById('btn-cancelar-venda');
        if(btnSalvar){ btnSalvar.addEventListener('click',(e)=>{ e.preventDefault(); this.saveSaleFromForm(); }); }
        if(btnCancelar){ btnCancelar.addEventListener('click',(e)=>{ e.preventDefault(); this.loadScreen('lancamento-vendas'); }); }
    }
    saveSaleFromForm(){
        const get=id=>document.getElementById(id);
        const descricao = get('venda-descricao')?.value.trim(); if(!descricao){ alert('Informe a descrição'); get('venda-descricao').focus(); return; }
        const valor = this.parseValorBR(get('venda-valor')?.value); if(valor<=0){ alert('Valor inválido'); get('venda-valor').focus(); return; }
        const dataVenda = get('venda-data')?.value || new Date().toISOString().substring(0,10);
        const canal = get('venda-canal')?.value || '';
        const observacoes = get('venda-observacoes')?.value || '';
        const payload = {descricao, valor, dataVenda, canal, observacoes};
        if(this.editingSaleId){ salesService.update(this.editingSaleId, payload); }
        else { salesService.create(payload); }
        this.editingSaleId = null;
        this.loadScreen('lancamento-vendas');
        this.updateSidebarSaldo();
    }
    showCadastroCanais(){
        if(window.salesChannelService){ salesChannelService.seedIfEmpty(); }
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = `
            <div class="fade-in">
                <h2 class="screen-title">Canais de Venda</h2>
                <div class="row justify-content-center">
                    <div class="col-md-8">
                        <div class="card-custom">
                            <h5 class="mb-4">Gerenciar Canais</h5>
                            <div class="mb-3 d-flex gap-2">
                                <input id="novo-canal-venda" type="text" class="form-control form-control-custom" placeholder="Ex: Marketplace" tabindex="7" />
                                <button id="btn-add-canal" class="btn btn-info btn-custom" tabindex="8"><i class="bi bi-plus-circle"></i> Adicionar</button>
                            </div>
                            <div id="lista-canais-venda"></div>
                        </div>
                    </div>
                </div>
            </div>`;
        this.renderCanaisVenda();
        const addBtn = document.getElementById('btn-add-canal');
        if(addBtn){
            addBtn.addEventListener('click',(e)=>{
                e.preventDefault();
                const inp = document.getElementById('novo-canal-venda');
                const nome = inp.value.trim();
                if(!nome){ alert('Informe o nome'); inp.focus(); return; }
                if(!salesChannelService.create(nome)){ alert('Canal já existe ou inválido'); return; }
                inp.value='';
                this.renderCanaisVenda();
                this.refreshCanaisVendaSelects();
            });
        }
        this.updateKeyboardNav();
    }
    renderCanaisVenda(){
        const container = document.getElementById('lista-canais-venda');
        if(!container || !window.salesChannelService) return;
        const list = salesChannelService.list();
        if(list.length===0){ container.innerHTML = '<p class="text-muted">Nenhum canal cadastrado.</p>'; return; }
        container.innerHTML = list.map((c,idx)=>`
            <div class="mb-2 p-3 bg-light rounded d-flex justify-content-between align-items-center" data-id="${c.id}">
                <span>${c.nome}</span>
                <button class="btn btn-sm btn-outline-danger" data-remove-canal tabindex="${9+idx}"><i class="bi bi-trash"></i></button>
            </div>`).join('');
        container.querySelectorAll('[data-remove-canal]').forEach(btn=>{
            btn.addEventListener('click',(e)=>{
                const id = e.currentTarget.closest('[data-id]').dataset.id;
                if(confirm('Remover canal?')){ salesChannelService.remove(id); this.renderCanaisVenda(); this.refreshCanaisVendaSelects(); }
            });
        });
        this.refreshCanaisVendaSelects();
    }
    refreshCanaisVendaSelects(){
        const selects = document.querySelectorAll('#venda-canal');
        if(!window.salesChannelService || selects.length===0) return;
        const list = salesChannelService.list();
        selects.forEach(sel=>{
            const current = sel.value;
            sel.innerHTML = '<option value="">Selecione...</option>' + list.map(c=>`<option value="${c.nome}">${c.nome}</option>`).join('');
            if(current) sel.value = current;
        });
    }

        showFormasPagamento(){
                if(window.paymentMethodService){ paymentMethodService.seedIfEmpty(); }
                const contentArea = document.getElementById('content-area');
                contentArea.innerHTML = `
                        <div class="fade-in">
                            <h2 class="screen-title">Formas de Pagamento</h2>
                            <div class="row justify-content-center">
                                <div class="col-md-8">
                                    <div class="card-custom">
                                        <h5 class="mb-4">Gerenciar Formas</h5>
                                        <div class="mb-3 d-flex gap-2">
                                            <input id="nova-forma-pagamento" type="text" class="form-control form-control-custom" placeholder="Ex: Cartão Loja" tabindex="7" />
                                            <button id="btn-add-forma" class="btn btn-info btn-custom" tabindex="8"><i class="bi bi-plus-circle"></i> Adicionar</button>
                                        </div>
                                        <div id="lista-formas-pagamento"></div>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                this.renderFormasPagamento();
                const addBtn = document.getElementById('btn-add-forma');
                if(addBtn){
                        addBtn.addEventListener('click', (e)=>{
                                e.preventDefault();
                                const inp = document.getElementById('nova-forma-pagamento');
                                const nome = inp.value.trim();
                                if(!nome){ alert('Informe o nome'); inp.focus(); return; }
                                if(!paymentMethodService.create(nome)){ alert('Forma já existe ou inválida'); return; }
                                inp.value='';
                                this.renderFormasPagamento();
                        });
                }
                this.updateKeyboardNav();
        }

        renderFormasPagamento(){
                const container = document.getElementById('lista-formas-pagamento');
                if(!container || !window.paymentMethodService) return;
                const list = paymentMethodService.list();
                if(list.length===0){ container.innerHTML = '<p class="text-muted">Nenhuma forma cadastrada.</p>'; return; }
                container.innerHTML = list.map((f, idx)=> `
                    <div class="mb-2 p-3 bg-light rounded d-flex justify-content-between align-items-center" data-id="${f.id}">
                        <span>${f.nome}</span>
                        <button class="btn btn-sm btn-outline-danger" data-remove-forma tabindex="${9+idx}"><i class="bi bi-trash"></i></button>
                    </div>`).join('');
                container.querySelectorAll('[data-remove-forma]').forEach(btn => {
                        btn.addEventListener('click',(e)=>{
                                const id = e.currentTarget.closest('[data-id]').dataset.id;
                                if(confirm('Remover forma de pagamento?')){
                                        paymentMethodService.remove(id);
                                        this.renderFormasPagamento();
                                        this.refreshFormasPagamentoSelects();
                                }
                        });
                });
                this.refreshFormasPagamentoSelects();
        }

        refreshFormasPagamentoSelects(){
                const selects = document.querySelectorAll('#despesa-forma-pagamento');
                if(!window.paymentMethodService || selects.length===0) return;
                const list = paymentMethodService.list();
                selects.forEach(sel => {
                        const current = sel.value;
                        sel.innerHTML = '<option value="">Selecione...</option>' + list.map(f=> `<option value="${f.nome}">${f.nome}</option>`).join('');
                        if(current) sel.value = current;
                });
        }

    // --------- DESPESAS DINÂMICAS ---------
    renderExpenseList() {
        const tbody = document.getElementById('despesas-tbody');
        if(!tbody || !window.expenseService) return;
        const list = this.applyExpenseFilters(expenseService.list());
        if(list.length === 0){
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Nenhuma despesa cadastrada</td></tr>';
            return;
        }
        tbody.innerHTML = list.map((d, idx) => {
            const pagoStatus = d.pago ? `<span class="text-success">${d.dataPagamento || 'Pago'}</span>` : '<span class="text-danger">Não Pago</span>';
            const valorFormat = d.valor.toLocaleString('pt-BR',{style:'currency', currency:'BRL'});
            return `<tr data-id="${d.id}">
                <td><strong>${d.descricao}</strong><br><small class="text-muted">Categoria: ${d.categoria||'-'}</small></td>
                <td>${d.observacoes ? '<i class="bi bi-chat-square-text text-primary"></i>': ''}</td>
                <td><strong>${valorFormat}</strong></td>
                <td>${this.formatDate(d.dataCompra)}</td>
                <td>${this.formatDate(d.dataVencimento)}</td>
                <td>${d.pago ? this.formatDate(d.dataPagamento) : pagoStatus}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" data-expense-edit tabindex="${19+idx*3}"><i class="bi bi-pencil"></i> Editar</button>
                    <button class="btn btn-sm ${d.pago? 'btn-success':'btn-warning'} me-1" data-expense-toggle tabindex="${20+idx*3}">
                        <i class="bi ${d.pago? 'bi-check-circle':'bi-currency-dollar'}"></i> ${d.pago? 'Pago':'Pagar'}
                    </button>
                    <button class="btn btn-sm btn-outline-danger" data-expense-delete tabindex="${21+idx*3}"><i class="bi bi-trash"></i> Excluir</button>
                </td>
            </tr>`;
        }).join('');

        // bind row actions via event delegation
        tbody.querySelectorAll('[data-expense-edit]').forEach(btn => {
            btn.addEventListener('click', (e)=>{
                const id = e.currentTarget.closest('tr').dataset.id;
                this.openEditExpense(id);
            });
        });
        tbody.querySelectorAll('[data-expense-toggle]').forEach(btn => {
            btn.addEventListener('click', (e)=>{
                const id = e.currentTarget.closest('tr').dataset.id;
                expenseService.togglePago(id);
                this.renderExpenseList();
            });
        });
        tbody.querySelectorAll('[data-expense-delete]').forEach(btn => {
            btn.addEventListener('click', (e)=>{
                const id = e.currentTarget.closest('tr').dataset.id;
                if(confirm('Excluir despesa?')){
                    expenseService.remove(id);
                    this.renderExpenseList();
                }
            });
        });
    }

    populateFilterSelects(){
        // categoria, fornecedor, forma pagamento
        if(window.categoryService){
            const sel = document.getElementById('filtro-categoria');
            if(sel){
                const list = categoryService.list();
                sel.innerHTML = '<option value="">Todas</option>' + list.map(c=> `<option value="${c.nome}">${c.nome}</option>`).join('');
            }
        }
        if(window.supplierService){
            const sel = document.getElementById('filtro-fornecedor');
            if(sel){
                const list = supplierService.list();
                sel.innerHTML = '<option value="">Todos</option>' + list.map(f=> `<option value="${f.nome}">${f.nome}</option>`).join('');
            }
        }
        if(window.paymentMethodService){
            const sel = document.getElementById('filtro-forma-pagamento');
            if(sel){
                const list = paymentMethodService.list();
                sel.innerHTML = '<option value="">Todas</option>' + list.map(p=> `<option value="${p.nome}">${p.nome}</option>`).join('');
            }
        }
    }

    bindExpenseFilterEvents(){
        const btnFilter = document.getElementById('btn-filtrar-despesas');
        const btnClear = document.getElementById('btn-limpar-filtros-despesas');
        if(btnFilter){
            btnFilter.addEventListener('click', (e)=> {
                e.preventDefault();
                this.collectExpenseFilters();
                this.renderExpenseList();
            });
        }
        if(btnClear){
            btnClear.addEventListener('click', (e)=> {
                e.preventDefault();
                this.clearExpenseFilters();
                this.renderExpenseList();
            });
        }
    }

    collectExpenseFilters(){
        this.expenseFilters.descricao = (document.getElementById('filtro-descricao')?.value || '').trim().toLowerCase();
        this.expenseFilters.status = document.getElementById('filtro-status')?.value || '';
        this.expenseFilters.periodo = document.getElementById('filtro-periodo')?.value || '';
        this.expenseFilters.categoria = document.getElementById('filtro-categoria')?.value || '';
        this.expenseFilters.fornecedor = document.getElementById('filtro-fornecedor')?.value || '';
        this.expenseFilters.formaPagamento = document.getElementById('filtro-forma-pagamento')?.value || '';
    }

    clearExpenseFilters(){
        this.expenseFilters = { descricao:'', status:'', periodo:'', categoria:'', fornecedor:'', formaPagamento:'' };
        ['filtro-descricao','filtro-status','filtro-periodo','filtro-categoria','filtro-fornecedor','filtro-forma-pagamento']
            .forEach(id => { const el = document.getElementById(id); if(el) el.value = ''; });
    }

    applyExpenseFilters(list){
        let filtered = list.slice();
        const f = this.expenseFilters;
        if(f.descricao){
            filtered = filtered.filter(d => d.descricao.toLowerCase().includes(f.descricao));
        }
        if(f.status){
            if(f.status === 'pago') filtered = filtered.filter(d => d.pago);
            if(f.status === 'aberto') filtered = filtered.filter(d => !d.pago);
        }
        if(f.categoria){
            filtered = filtered.filter(d => (d.categoria||'') === f.categoria);
        }
        if(f.fornecedor){
            filtered = filtered.filter(d => (d.fornecedor||'') === f.fornecedor);
        }
        if(f.formaPagamento){
            filtered = filtered.filter(d => (d.formaPagamento||'') === f.formaPagamento);
        }
        if(f.periodo){
            // Formato esperado: dd/mm/aaaa à dd/mm/aaaa
            const parts = f.periodo.split(/à|-/).map(p=> p.trim());
            if(parts.length >= 2){
                const inicio = this.parseDateBR(parts[0]);
                const fim = this.parseDateBR(parts[1]);
                if(inicio || fim){
                    filtered = filtered.filter(d => {
                        const venc = new Date(d.dataVencimento + 'T00:00:00');
                        if(inicio && venc < inicio) return false;
                        if(fim && venc > fim) return false;
                        return true;
                    });
                }
            }
        }
        return filtered;
    }

    parseDateBR(str){
        if(!str) return null;
        const m = str.match(/(\d{2})\/(\d{2})\/(\d{4})/);
        if(!m) return null;
        const [_, d, mo, y] = m;
        return new Date(`${y}-${mo}-${d}T00:00:00`);
    }

    openEditExpense(id){
        this.editingExpenseId = id;
        this.loadScreen('inserir-despesa');
    }

    prepareExpenseForm(){
        if(!window.expenseService) return;
        const formRoot = document.querySelector('#content-area form');
        if(!formRoot) return;
        const saveBtn = document.querySelector('#content-area button.btn-success');
        if(saveBtn){
            saveBtn.addEventListener('click', (e)=>{
                e.preventDefault();
                this.saveExpenseFromForm();
            });
        }
        const cancelBtn = document.querySelector('#content-area button.btn-secondary');
        if(cancelBtn){
            cancelBtn.addEventListener('click', (e)=>{
                e.preventDefault();
                this.loadScreen('lancamento-despesas');
            });
        }
        const valorEl = document.querySelector('#despesa-valor');
        const valorPagoEl = document.querySelector('#despesa-valor-pago');
            const formatOnBlur = (e) => {
                const num = this.parseValorBR(e.target.value);
                if(num){
                    e.target.value = num.toLocaleString('pt-BR',{minimumFractionDigits:2});
                } else {
                    e.target.value = '';
                }
            };
            [valorEl, valorPagoEl].forEach(el => {
                if(!el) return;
                el.addEventListener('blur', formatOnBlur);
                el.addEventListener('focus', (e)=>{
                    // Ao focar remove formatação para facilitar edição
                    const num = this.parseValorBR(e.target.value);
                    if(num){
                        // mostra sem separadores (apenas vírgula para decimal)
                        const raw = num.toFixed(2).replace('.', ',');
                        e.target.value = raw;
                    }
                });
            });

            // ---- Lógica solicitada: sincronizar switches e valor pago ----
            const pgRealizado = document.getElementById('despesa-pagamento-realizado');
            const pgNao = document.getElementById('despesa-pagamento-nao-realizado');
            const valorPagoInput = document.getElementById('despesa-valor-pago');
            const dataPagamentoEl = document.getElementById('despesa-data-pagamento');

            const syncPagamento = (ultimoClique) => {
                // Força exclusividade: se clicou em um, desmarca o outro imediatamente.
                if(ultimoClique === 'realizado'){
                    if(pgRealizado && pgRealizado.checked && pgNao && pgNao.checked){
                        pgNao.checked = false;
                    }
                } else if(ultimoClique === 'nao') {
                    if(pgNao && pgNao.checked && pgRealizado && pgRealizado.checked){
                        pgRealizado.checked = false;
                    }
                }

                // Estado após ajuste dos checks
                const marcadoRealizado = pgRealizado?.checked;
                const marcadoNao = pgNao?.checked;

                if(marcadoNao){
                    // Não realizado: limpa campos relacionados a pagamento
                    if(valorPagoInput) valorPagoInput.value = '';
                    if(dataPagamentoEl) dataPagamentoEl.value = '';
                    return;
                }

                if(marcadoRealizado){
                    const principal = this.parseValorBR(valorEl?.value);
                    const atual = this.parseValorBR(valorPagoInput?.value);
                    if(valorPagoInput && (atual === 0 || !valorPagoInput.value.trim())){
                        valorPagoInput.value = principal.toLocaleString('pt-BR',{minimumFractionDigits:2});
                    }
                    if(dataPagamentoEl && !dataPagamentoEl.value){
                        dataPagamentoEl.value = new Date().toISOString().substring(0,10);
                    }
                } else {
                    // Nenhum marcado: deixa como está (estado inicial neutro)
                }
            };
            if(pgRealizado){
                pgRealizado.addEventListener('change', ()=>syncPagamento('realizado'));
                pgRealizado.addEventListener('click', ()=>syncPagamento('realizado'));
            }
            if(pgNao){
                pgNao.addEventListener('change', ()=>syncPagamento('nao'));
                pgNao.addEventListener('click', ()=>syncPagamento('nao'));
            }

            // Chama sincronização inicial para estado default
            syncPagamento();

        // If editing populate fields using IDs
        if(this.editingExpenseId){
            const item = expenseService.list().find(d=>d.id===this.editingExpenseId);
            if(item){
                const setVal = (id, val) => { const el = document.getElementById(id); if(el) el.value = val ?? ''; };
                setVal('despesa-descricao', item.descricao);
                setVal('despesa-data-compra', item.dataCompra);
                setVal('despesa-data-vencimento', item.dataVencimento);
                setVal('despesa-data-pagamento', item.dataPagamento || '');
                // garante fornecedores antes de setar valor
                if(window.supplierService){
                    this.refreshFornecedorSelects();
                }
                if(window.categoryService){
                    this.refreshCategoriaSelects();
                }
                if(window.paymentMethodService){
                    this.refreshFormasPagamentoSelects();
                }
                setVal('despesa-categoria', item.categoria);
                setVal('despesa-fornecedor', item.fornecedor);
                setVal('despesa-parcelado', item.parcelado || '');
                setVal('despesa-fixa', item.fixa ? 'sim' : 'nao');
                setVal('despesa-forma-pagamento', item.formaPagamento || '');
                const obs = document.getElementById('despesa-observacoes'); if(obs) obs.value = item.observacoes || '';
                if(valorEl) valorEl.value = item.valor.toLocaleString('pt-BR',{minimumFractionDigits:2});
                if(valorPagoEl && typeof item.valorPago === 'number') valorPagoEl.value = item.valorPago.toLocaleString('pt-BR',{minimumFractionDigits:2});
                if(pgRealizado) pgRealizado.checked = !!item.pago;
                if(pgNao) pgNao.checked = !item.pago;
                syncPagamento();
            }
        } else {
            // default dates = today
            const today = new Date().toISOString().substring(0,10);
            const setVal = (id,val)=>{const el=document.getElementById(id); if(el && !el.value) el.value = val;};
            setVal('despesa-data-compra', today);
            setVal('despesa-data-vencimento', today);
            if(window.supplierService){
                this.refreshFornecedorSelects();
            }
            if(window.categoryService){
                this.refreshCategoriaSelects();
            }
            if(window.paymentMethodService){
                this.refreshFormasPagamentoSelects();
            }
            const pgRealizado = document.getElementById('despesa-pagamento-realizado');
            if(pgRealizado && pgRealizado.checked) setVal('despesa-data-pagamento', today);
            syncPagamento();
        }
    }

    parseValorBR(text){
        if(!text) return 0;
            // Remove espaços e símbolos
            let cleaned = text.replace(/[^0-9.,-]/g,'');
            // Se houver mais de uma vírgula, mantém só a última como decimal
            const parts = cleaned.split(',');
            if(parts.length > 2){
                const decimal = parts.pop();
                cleaned = parts.join('') + ',' + decimal; // junta tudo antes como parte inteira
            }
            // Remove todos os pontos (milhares)
            cleaned = cleaned.replace(/\.(?=\d{3}(\D|$))/g,'');
            // Troca vírgula por ponto para parse
            cleaned = cleaned.replace(',', '.');
            const n = parseFloat(cleaned);
            return isNaN(n) ? 0 : n;
    }

    saveExpenseFromForm(){
        const root = document.querySelector('#content-area');
        if(!root) return;
        const descricaoEl = root.querySelector('#despesa-descricao');
        const valorEl = root.querySelector('#despesa-valor');
        const dataCompraEl = root.querySelector('#despesa-data-compra');
        const dataVencimentoEl = root.querySelector('#despesa-data-vencimento');
        const dataPagamentoEl = root.querySelector('#despesa-data-pagamento');
        const categoriaEl = root.querySelector('#despesa-categoria');
        const fornecedorEl = root.querySelector('#despesa-fornecedor');
        const parceladoEl = root.querySelector('#despesa-parcelado');
        const fixaEl = root.querySelector('#despesa-fixa');
        const valorPagoEl = root.querySelector('#despesa-valor-pago');
        const formaPagamentoEl = root.querySelector('#despesa-forma-pagamento');
        const obsEl = root.querySelector('#despesa-observacoes');
        const pagamentoRealizadoEl = root.querySelector('#despesa-pagamento-realizado');
        const pagamentoNaoRealizadoEl = root.querySelector('#despesa-pagamento-nao-realizado');

        // Regras simples: se marcar "Pagamento Não Realizado" força desmarcar realizado
        if(pagamentoNaoRealizadoEl && pagamentoNaoRealizadoEl.checked){
            if(pagamentoRealizadoEl) pagamentoRealizadoEl.checked = false;
        }
        if(pagamentoRealizadoEl && pagamentoRealizadoEl.checked) {
            if(!dataPagamentoEl.value) {
                dataPagamentoEl.value = new Date().toISOString().substring(0,10);
            }
        } else {
            dataPagamentoEl.value = '';
        }

        const valor = this.parseValorBR(valorEl?.value);
        const valorPago = this.parseValorBR(valorPagoEl?.value);

        const dados = {
            descricao: descricaoEl?.value?.trim() || '',
            valor,
            dataCompra: dataCompraEl?.value || '',
            dataVencimento: dataVencimentoEl?.value || dataCompraEl?.value || '',
            dataPagamento: dataPagamentoEl?.value || '',
            categoria: categoriaEl?.value || '',
            fornecedor: fornecedorEl?.value || '',
            parcelado: parceladoEl?.value || '',
            fixa: fixaEl?.value === 'sim',
            valorPago,
            formaPagamento: formaPagamentoEl?.value || '',
            observacoes: obsEl?.value || '',
            pago: !!dataPagamentoEl?.value
        };

        // Validações simples
        if(!dados.descricao){
            alert('Informe a descrição');
            descricaoEl?.focus();
            return;
        }
        if(!dados.valor || dados.valor <= 0){
            alert('Informe um valor válido');
            valorEl?.focus();
            return;
        }
        if(!dados.dataCompra){
            alert('Informe a data da compra');
            dataCompraEl?.focus();
            return;
        }
        if(this.editingExpenseId){
            expenseService.update(this.editingExpenseId, dados);
            this.editingExpenseId = null;
        } else {
            expenseService.create(dados);
        }
        this.loadScreen('lancamento-despesas');
        this.updateSidebarSaldo();
    }

    formatDate(dateStr){
        if(!dateStr) return '';
        const [y,m,d] = dateStr.split('-');
        if(!d) return dateStr;
        return `${d}/${m}/${y}`;
    }

    showCategoriasDespesas() {
        if(window.categoryService){
            categoryService.seedIfEmpty();
        }
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = `
            <div class="fade-in">
                <h2 class="screen-title">Categorias de Despesas</h2>
                <div class="row justify-content-center">
                    <div class="col-md-8">
                        <div class="card-custom">
                            <h5 class="mb-4">Gerenciar Categorias</h5>
                            <div class="mb-3 d-flex gap-2">
                                <input id="nova-categoria-nome" type="text" class="form-control form-control-custom" placeholder="Nome da categoria" tabindex="7" />
                                <button id="btn-add-categoria" class="btn btn-info btn-custom" tabindex="8"><i class="bi bi-plus-circle"></i> Adicionar</button>
                            </div>
                            <div id="lista-categorias" class="category-list"></div>
                        </div>
                    </div>
                </div>
            </div>`;
        this.renderCategorias();
        const addBtn = document.getElementById('btn-add-categoria');
        if(addBtn){
            addBtn.addEventListener('click', (e)=>{
                e.preventDefault();
                const inp = document.getElementById('nova-categoria-nome');
                const nome = inp.value.trim();
                if(!nome){ alert('Informe o nome'); inp.focus(); return; }
                if(!categoryService.create(nome)){ alert('Categoria já existe ou inválida'); return; }
                inp.value='';
                this.renderCategorias();
            });
        }
        this.updateKeyboardNav();
    }

    renderCategorias(){
        const container = document.getElementById('lista-categorias');
        if(!container || !window.categoryService) return;
        const list = categoryService.list();
        if(list.length===0){ container.innerHTML = '<p class="text-muted">Nenhuma categoria cadastrada.</p>'; return; }
        container.innerHTML = list.map((c, idx)=> `
            <div class="category-item mb-2 p-3 bg-light rounded d-flex justify-content-between align-items-center" data-id="${c.id}">
                <span>${c.nome}</span>
                <button class="btn btn-sm btn-outline-danger" data-remove-categoria tabindex="${9+idx}"><i class="bi bi-trash"></i></button>
            </div>`).join('');
        container.querySelectorAll('[data-remove-categoria]').forEach(btn => {
            btn.addEventListener('click', (e)=>{
                const id = e.currentTarget.closest('.category-item').dataset.id;
                if(confirm('Remover categoria?')){
                    categoryService.remove(id);
                    this.renderCategorias();
                    this.refreshCategoriaSelects();
                }
            });
        });
        this.refreshCategoriaSelects();
    }

    refreshCategoriaSelects(){
        const selects = document.querySelectorAll('#despesa-categoria');
        if(!window.categoryService || selects.length===0) return;
        const list = categoryService.list();
        selects.forEach(sel => {
            const current = sel.value;
            sel.innerHTML = '<option value="">Selecione...</option>' + list.map(c=> `<option value="${c.nome}">${c.nome}</option>`).join('');
            if(current) sel.value = current;
        });
    }

    showCadastroFornecedor() {
        if(window.supplierService){
            supplierService.seedIfEmpty();
        }
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = `
            <div class="fade-in">
                <h2 class="screen-title">Cadastrar Fornecedor</h2>
                <div class="row justify-content-center">
                    <div class="col-md-8">
                        <div class="card-custom">
                            <h5 class="mb-4">Fornecedores</h5>
                            <div class="mb-3 d-flex gap-2">
                                <input id="novo-fornecedor-nome" type="text" class="form-control form-control-custom" placeholder="Nome do fornecedor" tabindex="7" />
                                <button id="btn-add-fornecedor" class="btn btn-info btn-custom" tabindex="8"><i class="bi bi-plus-circle"></i> Adicionar</button>
                            </div>
                            <div id="lista-fornecedores" class="supplier-list"></div>
                        </div>
                    </div>
                </div>
            </div>`;
        this.renderSuppliers();
        const addBtn = document.getElementById('btn-add-fornecedor');
        if(addBtn){
            addBtn.addEventListener('click', (e)=>{
                e.preventDefault();
                const inp = document.getElementById('novo-fornecedor-nome');
                const nome = inp.value.trim();
                if(!nome){
                    alert('Informe o nome');
                    inp.focus();
                    return;
                }
                if(!supplierService.create(nome)){
                    alert('Fornecedor já existe ou inválido');
                    return;
                }
                inp.value='';
                this.renderSuppliers();
            });
        }
        this.updateKeyboardNav();
    }

    renderSuppliers(){
        const container = document.getElementById('lista-fornecedores');
        if(!container || !window.supplierService) return;
        const list = supplierService.list();
        if(list.length === 0){
            container.innerHTML = '<p class="text-muted">Nenhum fornecedor cadastrado.</p>';
            return;
        }
        container.innerHTML = list.map((f, idx)=> `
            <div class="supplier-item mb-2 p-3 bg-light rounded d-flex justify-content-between align-items-center" data-id="${f.id}">
                <span>${f.nome}</span>
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-outline-danger" data-remove-fornecedor tabindex="${9+idx}"><i class="bi bi-trash"></i></button>
                </div>
            </div>`).join('');
        container.querySelectorAll('[data-remove-fornecedor]').forEach(btn => {
            btn.addEventListener('click', (e)=>{
                const id = e.currentTarget.closest('.supplier-item').dataset.id;
                if(confirm('Remover fornecedor?')){
                    supplierService.remove(id);
                    this.renderSuppliers();
                    this.refreshFornecedorSelects();
                }
            });
        });
        // Atualiza selects em outras telas
        this.refreshFornecedorSelects();
    }

    refreshFornecedorSelects(){
        const selects = document.querySelectorAll('#despesa-fornecedor');
        if(!window.supplierService || selects.length===0) return;
        const list = supplierService.list();
        selects.forEach(sel => {
            const current = sel.value;
            sel.innerHTML = '<option value="">Selecione...</option>' + list.map(f=> `<option value="${f.nome}">${f.nome}</option>`).join('');
            if(current) sel.value = current;
        });
    }

    showFluxoCaixa() {
        const expenses = window.expenseService ? expenseService.list() : [];
        const receipts = window.receiptService ? receiptService.list() : [];
        const sales = window.salesService ? salesService.list() : [];

        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = `
            <div class="fade-in">
                <h2 class="screen-title">Fluxo de Caixa</h2>
                <div class="card-custom mb-4">
                    <h5 class="mb-3">Filtros</h5>
                    <div class="row g-3 align-items-end">
                        <div class="col-md-2">
                            <label class="form-label">Data Inicial</label>
                            <input id="fc-data-inicial" type="date" class="form-control form-control-custom" />
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">Data Final</label>
                            <input id="fc-data-final" type="date" class="form-control form-control-custom" />
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">Saldo Inicial (R$)</label>
                            <input id="fc-saldo-inicial" type="text" class="form-control form-control-custom" placeholder="0,00" />
                        </div>
                        <div class="col-md-3 d-flex align-items-center pt-2">
                            <div class="form-check me-3">
                                <input class="form-check-input" type="checkbox" id="fc-incluir-nao-pagas" checked />
                                <label class="form-check-label" for="fc-incluir-nao-pagas">Incluir Despesas Não Pagas</label>
                            </div>
                        </div>
                        <div class="col-md-3 d-flex gap-2">
                            <button id="fc-aplicar" class="btn btn-success btn-custom flex-fill"><i class="bi bi-funnel"></i> Aplicar</button>
                            <button id="fc-limpar" class="btn btn-outline-secondary flex-fill">Limpar</button>
                        </div>
                    </div>
                </div>
                <div class="card-custom">
                    <h5 class="mb-3">Movimentações</h5>
                    <div class="table-responsive">
                        <table class="table table-custom table-sm" id="fc-tabela">
                            <thead>
                                <tr>
                                    <th>Data</th>
                                    <th>Tipo</th>
                                    <th>Descrição</th>
                                    <th>Categoria/Canal/Forma</th>
                                    <th class="text-end">Entrada</th>
                                    <th class="text-end">Saída</th>
                                    <th class="text-end">Saldo</th>
                                </tr>
                            </thead>
                            <tbody id="fc-tbody"></tbody>
                            <tfoot id="fc-tfoot"></tfoot>
                        </table>
                    </div>
                    <div class="mt-2 small text-muted">Entradas: Vendas (data da venda) e Recebimentos (data do recebimento). Saídas: Despesas (data pagamento se pago, senão vencimento). Valor pago usado quando disponível.</div>
                </div>
            </div>`;

        const saldoInicialEl = document.getElementById('fc-saldo-inicial');
        if(saldoInicialEl){
            saldoInicialEl.addEventListener('blur', ()=>{
                const n = this.parseValorBR(saldoInicialEl.value);
                saldoInicialEl.value = n.toLocaleString('pt-BR',{minimumFractionDigits:2});
            });
            saldoInicialEl.addEventListener('focus', ()=>{
                const n = this.parseValorBR(saldoInicialEl.value);
                if(n) saldoInicialEl.value = n.toFixed(2).replace('.', ',');
            });
        }

        const render = () => {
            const diVal = document.getElementById('fc-data-inicial').value;
            const dfVal = document.getElementById('fc-data-final').value;
            const incluirNaoPagas = document.getElementById('fc-incluir-nao-pagas').checked;
            const saldoInicial = this.parseValorBR(document.getElementById('fc-saldo-inicial').value);
            const di = diVal ? new Date(diVal) : null;
            const df = dfVal ? new Date(dfVal) : null;
            const inRange = (dt) => {
                if(di && dt < di) return false;
                if(df && dt > df) return false;
                return true;
            };

            // Monta lista unificada
            const transacoes = [];

            // Entradas: Sales
            sales.forEach(s => {
                const d = new Date(s.dataVenda);
                if(!inRange(d)) return;
                transacoes.push({
                    data: d,
                    tipo: 'Entrada',
                    subtipo: 'Venda',
                    descricao: s.descricao,
                    categoria: s.canal || '-',
                    entrada: s.valor,
                    saida: 0
                });
            });
            // Entradas: Receipts
            receipts.forEach(r => {
                const d = new Date(r.dataRecebimento);
                if(!inRange(d)) return;
                transacoes.push({
                    data: d,
                    tipo: 'Entrada',
                    subtipo: 'Recebimento',
                    descricao: r.descricao,
                    categoria: r.formaRecebimento || '-',
                    entrada: r.valor,
                    saida: 0
                });
            });
            // Saídas: Expenses
            expenses.forEach(e => {
                const dataBase = e.pago ? (e.dataPagamento || e.dataVencimento || e.dataCompra) : (e.dataVencimento || e.dataCompra);
                if(!dataBase) return;
                const d = new Date(dataBase);
                if(!inRange(d)) return;
                if(!e.pago && !incluirNaoPagas) return; // ignora não pagas se opção desmarcada
                const valorSaida = e.pago && e.valorPago > 0 ? e.valorPago : e.valor;
                transacoes.push({
                    data: d,
                    tipo: 'Saída',
                    subtipo: 'Despesa' + (e.pago ? '' : ' (Prevista)'),
                    descricao: e.descricao,
                    categoria: e.categoria || '-',
                    entrada: 0,
                    saida: valorSaida
                });
            });

            // Ordena por data ASC e depois por tipo (entradas antes de saídas no mesmo dia para visualizar melhor saldo)
            transacoes.sort((a,b)=> a.data - b.data || (a.tipo < b.tipo ? -1:1));

            // Calcula saldo acumulado
            let saldo = saldoInicial;
            const tbody = document.getElementById('fc-tbody');
            const tfoot = document.getElementById('fc-tfoot');
            let totalEntradas = 0; let totalSaidas = 0;
            if(transacoes.length === 0){
                tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Nenhuma movimentação no período</td></tr>';
                tfoot.innerHTML = '';
                return;
            }
            tbody.innerHTML = transacoes.map(tr => {
                saldo += tr.entrada - tr.saida;
                totalEntradas += tr.entrada;
                totalSaidas += tr.saida;
                return `<tr>
                    <td>${tr.data.toISOString().substring(0,10).split('-').reverse().join('/')}</td>
                    <td>${tr.subtipo}</td>
                    <td>${tr.descricao}</td>
                    <td>${tr.categoria}</td>
                    <td class="text-end ${tr.entrada? 'text-success fw-semibold':''}">${tr.entrada? tr.entrada.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}): ''}</td>
                    <td class="text-end ${tr.saida? 'text-danger fw-semibold':''}">${tr.saida? tr.saida.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}): ''}</td>
                    <td class="text-end ${saldo>=0? 'text-success':'text-danger'}">${saldo.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</td>
                </tr>`;
            }).join('');
            const saldoFinal = saldo;
            tfoot.innerHTML = `<tr class="table-light">
                <th colspan="4" class="text-end">Totais</th>
                <th class="text-end text-success">${totalEntradas.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</th>
                <th class="text-end text-danger">${totalSaidas.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</th>
                <th class="text-end ${saldoFinal>=0? 'text-success':'text-danger'}">${saldoFinal.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</th>
            </tr>`;
        };

        document.getElementById('fc-aplicar').addEventListener('click', (e)=>{ e.preventDefault(); render(); });
        document.getElementById('fc-limpar').addEventListener('click', (e)=>{ e.preventDefault();
            ['fc-data-inicial','fc-data-final','fc-saldo-inicial'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; });
            const chk = document.getElementById('fc-incluir-nao-pagas'); if(chk) chk.checked = true;
            render();
        });

        render();
        this.updateKeyboardNav();
        this.updateSidebarSaldo();
    }

    /* ================= SALDO EM CONTA DINÂMICO ================= */
    showSaldoContas(){
        // Garante seeds para termos formas de pagamento e recebimento
        if(window.paymentMethodService) paymentMethodService.seedIfEmpty();
        if(window.receiptMethodService) receiptMethodService.seedIfEmpty();
        if(window.expenseService) expenseService.seedIfEmpty?.();
        if(window.receiptService) receiptService.seedIfEmpty();
        if(window.salesService) salesService.seedIfEmpty();

        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = `
            <div class="fade-in">
                <h2 class="screen-title">Saldo em Conta</h2>
                <div class="card-custom mb-4">
                    <h5 class="mb-3">Filtros</h5>
                    <div class="row g-3 align-items-end">
                        <div class="col-md-3">
                            <label class="form-label">Data Inicial</label>
                            <input id="sc-data-inicial" type="date" class="form-control form-control-custom" />
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Data Final</label>
                            <input id="sc-data-final" type="date" class="form-control form-control-custom" />
                        </div>
                        <div class="col-md-3 d-flex align-items-center pt-2">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="sc-incluir-nao-pagas" checked />
                                <label class="form-check-label" for="sc-incluir-nao-pagas">Incluir Despesas Não Pagas</label>
                            </div>
                        </div>
                        <div class="col-md-3 d-flex gap-2">
                            <button id="sc-aplicar" class="btn btn-success btn-custom flex-fill"><i class="bi bi-funnel"></i> Aplicar</button>
                            <button id="sc-limpar" class="btn btn-outline-secondary flex-fill">Limpar</button>
                        </div>
                    </div>
                </div>
                <div class="card-custom mb-4">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h5 class="mb-0">Saldos por Conta</h5>
                        <div class="d-flex gap-2">
                            <button id="sc-exportar" class="btn btn-sm btn-primary"><i class="bi bi-download"></i> Exportar CSV</button>
                        </div>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-custom table-sm" id="sc-tabela">
                            <thead>
                                <tr>
                                    <th>Conta</th>
                                    <th class="text-end">Saldo Inicial</th>
                                    <th class="text-end text-success">Entradas</th>
                                    <th class="text-end text-danger">Saídas</th>
                                    <th class="text-end">Saldo Final</th>
                                </tr>
                            </thead>
                            <tbody id="sc-tbody"></tbody>
                            <tfoot id="sc-tfoot"></tfoot>
                        </table>
                    </div>
                    <div class="small text-muted">Entradas: Recebimentos por forma. Saídas: Despesas por forma de pagamento (valor pago se pago, senão valor). Não pagas podem ser incluídas/ignoradas via filtro.</div>
                </div>
                <div class="card-custom">
                    <h5 class="mb-3">Configurar Saldos Iniciais</h5>
                    <p class="text-muted small">Defina o saldo inicial de cada conta. Esses valores são usados apenas para cálculo exibido e podem ser ajustados a qualquer momento.</p>
                    <div id="sc-editor-saldos" class="row g-3"></div>
                    <div class="text-end mt-3">
                        <button id="sc-salvar-saldos" class="btn btn-success btn-custom"><i class="bi bi-save"></i> Salvar Saldos Iniciais</button>
                    </div>
                </div>
            </div>`;

        const STORAGE_KEY = 'sf_saldos_iniciais';
        const loadSaldos = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; } };
        const saveSaldos = (obj) => localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));

        const getAccounts = () => {
            const nomes = new Set();
            if(window.paymentMethodService){ paymentMethodService.list().forEach(f=> nomes.add(f.nome)); }
            if(window.receiptMethodService){ receiptMethodService.list().forEach(f=> nomes.add(f.nome)); }
            // Remove vazios
            return Array.from(nomes).filter(n=> n && n.trim()).sort((a,b)=> a.localeCompare(b));
        };

        const parseNumber = (txt)=> this.parseValorBR(txt);
        const formatNumber = (n)=> n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});

        const renderEditor = () => {
            const container = document.getElementById('sc-editor-saldos');
            const saldos = loadSaldos();
            const contas = getAccounts();
            if(contas.length===0){
                container.innerHTML = '<div class="col-12 text-muted">Nenhuma conta cadastrada (adicione Formas de Pagamento ou Recebimento).</div>';
                return;
            }
            container.innerHTML = contas.map(c=> `
                <div class="col-md-4 col-lg-3">
                    <label class="form-label small fw-semibold">${c}</label>
                    <input type="text" class="form-control form-control-custom sc-saldo-inicial" data-conta="${c}" value="${(saldos[c]||0).toLocaleString('pt-BR',{minimumFractionDigits:2})}">
                </div>`).join('');
            // Máscara simples on blur/focus
            container.querySelectorAll('.sc-saldo-inicial').forEach(inp=>{
                inp.addEventListener('blur',()=>{
                    const n = parseNumber(inp.value);
                    inp.value = n.toLocaleString('pt-BR',{minimumFractionDigits:2});
                });
                inp.addEventListener('focus',()=>{
                    const n = parseNumber(inp.value);
                    if(n) inp.value = n.toFixed(2).replace('.',',');
                });
            });
        };

        const calcAndRender = () => {
            const contas = getAccounts();
            const saldos = loadSaldos();
            const tbody = document.getElementById('sc-tbody');
            const tfoot = document.getElementById('sc-tfoot');
            const diVal = document.getElementById('sc-data-inicial').value;
            const dfVal = document.getElementById('sc-data-final').value;
            const incluirNaoPagas = document.getElementById('sc-incluir-nao-pagas').checked;
            const di = diVal? new Date(diVal): null;
            const df = dfVal? new Date(dfVal): null;
            const inRange = (dateStr) => {
                if(!dateStr) return true;
                const d = new Date(dateStr);
                if(di && d < di) return false;
                if(df && d > df) return false;
                return true;
            };

            const receipts = window.receiptService ? receiptService.list() : [];
            const expenses = window.expenseService ? expenseService.list() : [];

            const rows = [];
            let totInicial=0, totEntradas=0, totSaidas=0, totFinal=0;
            contas.forEach(conta=> {
                const inicial = Number(saldos[conta]||0);
                const entradas = receipts.filter(r=> r.formaRecebimento === conta && inRange(r.dataRecebimento))
                                         .reduce((s,r)=> s + r.valor, 0);
                const saidas = expenses.filter(e=> e.formaPagamento === conta && (incluirNaoPagas || e.pago) && inRange(e.pago ? e.dataPagamento : (e.dataVencimento||e.dataCompra)))
                                       .reduce((s,e)=> s + (e.pago && e.valorPago>0 ? e.valorPago : e.valor), 0);
                const final = inicial + entradas - saidas;
                totInicial += inicial; totEntradas += entradas; totSaidas += saidas; totFinal += final;
                rows.push({conta, inicial, entradas, saidas, final});
            });

            if(rows.length===0){
                tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Nenhuma conta disponível</td></tr>';
                tfoot.innerHTML = '';
                return;
            }
            tbody.innerHTML = rows.map(r=> `
                <tr>
                    <td>${r.conta}</td>
                    <td class="text-end">${formatNumber(r.inicial)}</td>
                    <td class="text-end text-success fw-semibold">${r.entradas? formatNumber(r.entradas): ''}</td>
                    <td class="text-end text-danger fw-semibold">${r.saidas? formatNumber(r.saidas): ''}</td>
                    <td class="text-end ${r.final>=0? 'text-success':'text-danger'} fw-semibold">${formatNumber(r.final)}</td>
                </tr>`).join('');
            tfoot.innerHTML = `
                <tr class="table-light">
                    <th>Total</th>
                    <th class="text-end">${formatNumber(totInicial)}</th>
                    <th class="text-end text-success">${formatNumber(totEntradas)}</th>
                    <th class="text-end text-danger">${formatNumber(totSaidas)}</th>
                    <th class="text-end ${totFinal>=0? 'text-success':'text-danger'}">${formatNumber(totFinal)}</th>
                </tr>`;
        };

        const exportCSV = () => {
            const contas = getAccounts();
            const saldos = loadSaldos();
            const diVal = document.getElementById('sc-data-inicial').value;
            const dfVal = document.getElementById('sc-data-final').value;
            const incluirNaoPagas = document.getElementById('sc-incluir-nao-pagas').checked;
            const di = diVal? new Date(diVal): null;
            const df = dfVal? new Date(dfVal): null;
            const inRange = (dateStr) => {
                if(!dateStr) return true; const d = new Date(dateStr); if(di && d<di) return false; if(df && d>df) return false; return true; };
            const receipts = window.receiptService ? receiptService.list() : [];
            const expenses = window.expenseService ? expenseService.list() : [];
            const linhas = ["Conta;Saldo Inicial;Entradas;Saídas;Saldo Final"];
            contas.forEach(conta => {
                const inicial = Number(saldos[conta]||0);
                const entradas = receipts.filter(r=> r.formaRecebimento === conta && inRange(r.dataRecebimento))
                                         .reduce((s,r)=> s + r.valor, 0);
                const saidas = expenses.filter(e=> e.formaPagamento === conta && (incluirNaoPagas || e.pago) && inRange(e.pago ? e.dataPagamento : (e.dataVencimento||e.dataCompra)))
                                       .reduce((s,e)=> s + (e.pago && e.valorPago>0 ? e.valorPago : e.valor), 0);
                const final = inicial + entradas - saidas;
                linhas.push(`${conta};${inicial.toFixed(2).replace('.',',')};${entradas.toFixed(2).replace('.',',')};${saidas.toFixed(2).replace('.',',')};${final.toFixed(2).replace('.',',')}`);
            });
            const blob = new Blob(["\uFEFF" + linhas.join('\n')], {type:'text/csv;charset=utf-8;'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = 'saldo_em_conta.csv'; a.click();
            URL.revokeObjectURL(url);
        };

        document.getElementById('sc-aplicar').addEventListener('click', (e)=>{ e.preventDefault(); calcAndRender(); });
        document.getElementById('sc-limpar').addEventListener('click', (e)=>{ e.preventDefault(); ['sc-data-inicial','sc-data-final'].forEach(id=>{const el=document.getElementById(id); if(el) el.value='';}); const chk=document.getElementById('sc-incluir-nao-pagas'); if(chk) chk.checked=true; calcAndRender(); });
        document.getElementById('sc-exportar').addEventListener('click', (e)=>{ e.preventDefault(); exportCSV(); });
        document.getElementById('sc-salvar-saldos').addEventListener('click', (e)=>{
            e.preventDefault();
            const inputs = document.querySelectorAll('.sc-saldo-inicial');
            const map = loadSaldos();
            inputs.forEach(inp=>{ const conta = inp.dataset.conta; map[conta] = parseNumber(inp.value); });
            saveSaldos(map);
            calcAndRender();
            alert('Saldos salvos.');
        });

        renderEditor();
        calcAndRender();
        this.updateKeyboardNav();
        this.updateSidebarSaldo();
    }

    /* ============== SALDO GLOBAL (HOME + SIDEBAR) ============== */
    calculateGlobalSaldo(){
        // Usa os mesmos critérios do Saldo em Conta: saldos iniciais + entradas - saídas agregados
        const STORAGE_KEY = 'sf_saldos_iniciais';
        let saldosIniciais = {};
        try { saldosIniciais = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { saldosIniciais = {}; }
        let totalInicial = Object.values(saldosIniciais).reduce((s,v)=> s + Number(v||0), 0);
        const receipts = window.receiptService ? receiptService.list() : [];
        const expenses = window.expenseService ? expenseService.list() : [];
        const totalEntradas = receipts.reduce((s,r)=> s + (r.valor||0), 0);
        const totalSaidas = expenses.reduce((s,e)=> s + (e.pago && e.valorPago>0 ? e.valorPago : e.valor||0), 0);
        const saldoFinal = totalInicial + totalEntradas - totalSaidas;
        return { totalInicial, totalEntradas, totalSaidas, saldoFinal };
    }
    updateSidebarSaldo(){
        const box = document.querySelector('.saldo-value');
        if(!box) return;
        const { saldoFinal } = this.calculateGlobalSaldo();
        box.textContent = saldoFinal.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
    }
    renderHomeSaldo(){
        const container = document.getElementById('content-area');
        if(!container) return;
        const resumoHost = container.querySelector('#resumo-saldo-home');
        const { totalInicial, totalEntradas, totalSaidas, saldoFinal } = this.calculateGlobalSaldo();
        const htmlResumo = `
            <div class="row mb-4" id="resumo-saldo-home">
                <div class="col-lg-3 col-md-6 mb-3">
                    <div class="card-custom py-3 text-center">
                        <h6 class="text-muted mb-1">Saldo Inicial</h6>
                        <h4 class="mb-0">${totalInicial.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</h4>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 mb-3">
                    <div class="card-custom py-3 text-center">
                        <h6 class="text-muted mb-1">Entradas</h6>
                        <h4 class="text-success mb-0">${totalEntradas.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</h4>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 mb-3">
                    <div class="card-custom py-3 text-center">
                        <h6 class="text-muted mb-1">Saídas</h6>
                        <h4 class="text-danger mb-0">${totalSaidas.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</h4>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 mb-3">
                    <div class="card-custom py-3 text-center">
                        <h6 class="text-muted mb-1">Saldo Atual</h6>
                        <h4 class="${saldoFinal>=0?'text-success':'text-danger'} mb-0">${saldoFinal.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</h4>
                    </div>
                </div>
            </div>`;
        // Insere no topo do conteúdo principal após o título se ainda não existir
        if(!resumoHost){
            // Inserir após o header da Home se existir
            const header = container.querySelector('#home-header-bar');
            if(header){
                header.insertAdjacentHTML('afterend', htmlResumo);
            } else {
                const fadeDiv = container.querySelector('.fade-in');
                if(fadeDiv){
                    fadeDiv.insertAdjacentHTML('afterbegin', htmlResumo);
                }
            }
        } else {
            resumoHost.outerHTML = htmlResumo;
        }

        this.updateHomeContasMes();
        // Após renderizar resumo, garantir binding dos filtros (somente na Home)
        this.bindHomeFilters();
    }

    bindHomeFilters(){
        // Evita rebinding múltiplo: se já configurado, apenas retorna
        if(this._homeFiltersBound){ return; }
        const toggleBtn = document.getElementById('home-filter-toggle');
        // Painel pode ser inline (#home-inline-filters) ou card antigo (#home-filtro-periodo)
        const panel = document.getElementById('home-inline-filters') || document.getElementById('home-filtro-periodo');
        if(toggleBtn && panel){
            const isInline = panel.id === 'home-inline-filters';
            if(isInline){
                // força oculto inicial por classes
                panel.classList.add('d-none');
                panel.classList.remove('d-flex');
            }
            toggleBtn.addEventListener('click',(e)=>{
                e.preventDefault();
                if(isInline){
                    const hidden = panel.classList.contains('d-none');
                    if(hidden){
                        panel.classList.remove('d-none');
                        panel.classList.add('d-flex');
                    } else {
                        panel.classList.remove('d-flex');
                        panel.classList.add('d-none');
                    }
                } else {
                    const visible = panel.style.display !== 'none';
                    panel.style.display = visible ? 'none':'block';
                }
            });
        }
        const aplicar = document.getElementById('home-filter-aplicar');
        const limpar = document.getElementById('home-filter-limpar');
        if(aplicar){
            aplicar.addEventListener('click', (e)=>{
                e.preventDefault();
                const iniVal = document.getElementById('home-filter-inicio')?.value || '';
                const fimVal = document.getElementById('home-filter-fim')?.value || '';
                this.homeFilterInicio = iniVal? new Date(iniVal + 'T00:00:00') : null;
                this.homeFilterFim = fimVal? new Date(fimVal + 'T23:59:59') : null; // fim inclusivo
                this.refreshHomeData();
            });
        }
        if(limpar){
            limpar.addEventListener('click', (e)=>{
                e.preventDefault();
                const ini = document.getElementById('home-filter-inicio'); if(ini) ini.value='';
                const fim = document.getElementById('home-filter-fim'); if(fim) fim.value='';
                this.homeFilterInicio = null; this.homeFilterFim = null;
                this.refreshHomeData();
            });
        }
        this._homeFiltersBound = true;
    }

    refreshHomeData(){
        // Recalcula saldo global (não depende de período) e atualiza seção de resumo
        this.renderHomeSaldo(); // re-render resumo e garante filtros

        // Redesenha gráficos considerando período
        this.initCharts(this.homeFilterInicio, this.homeFilterFim);

        // Atualiza cards de contas a pagar / pagas se quiser que respeitem período.
        // Mantemos lógica mensal original (sem filtro), mas se quiser que filtro afete:
        if(this.homeFilterInicio || this.homeFilterFim){
            this.updateHomeContasPeriodo();
        } else {
            this.updateHomeContasMes();
        }
    }

    updateHomeContasPeriodo(){
        if(!window.expenseService) return;
        const despesas = expenseService.list();
        const di = this.homeFilterInicio; const df = this.homeFilterFim;
        const inRange = (dateStr) => {
            if(!dateStr) return true;
            const d = new Date(dateStr + 'T00:00:00');
            if(di && d < di) return false;
            if(df && d > df) return false;
            return true;
        };
        let totalPagar = 0; let totalPagas = 0;
        despesas.forEach(d=>{
            const venc = d.dataVencimento || d.dataCompra || '';
            const pag = d.dataPagamento || '';
            if(!d.pago){
                if(inRange(venc)) totalPagar += d.valor || 0;
            }
            if(d.pago && inRange(pag)){
                totalPagas += (d.valorPago && d.valorPago>0 ? d.valorPago : d.valor)||0;
            }
        });
        const elPagar = document.getElementById('home-contas-pagar-mes');
        const elPagas = document.getElementById('home-contas-pagas-mes');
        if(elPagar) elPagar.textContent = totalPagar.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
        if(elPagas) elPagas.textContent = totalPagas.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
    }

    updateHomeContasMes(){
        if(!window.expenseService) return;
        const now = new Date();
        const ym = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`; // YYYY-MM
        const despesas = expenseService.list();
        let totalPagar = 0;
        let totalPagas = 0;
        despesas.forEach(d => {
            const venc = d.dataVencimento || d.dataCompra || '';
            const pag = d.dataPagamento || '';
            if(venc.startsWith(ym)){
                if(!d.pago){
                    totalPagar += d.valor || 0;
                }
            }
            if(pag.startsWith(ym)){
                // Considera valorPago se >0 senão valor
                totalPagas += (d.valorPago && d.valorPago>0 ? d.valorPago : d.valor)||0;
            }
        });
        const elPagar = document.getElementById('home-contas-pagar-mes');
        const elPagas = document.getElementById('home-contas-pagas-mes');
        if(elPagar) elPagar.textContent = totalPagar.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
        if(elPagas) elPagas.textContent = totalPagas.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
    }

    updateKeyboardNav() {
        if (window.keyboardNav) {
            setTimeout(() => {
                window.keyboardNav.updateFocusableElements();
                window.keyboardNav.setInitialFocus();
            }, 100);
        }
    }

    initCharts(startDate=null, endDate=null) {
        // Dados base
        const vendas = window.salesService ? salesService.list() : [];
        const recebimentos = window.receiptService ? receiptService.list() : [];
        const despesas = window.expenseService ? expenseService.list() : [];

        // Helper inRange
        const inRange = (dateStr) => {
            if(!dateStr) return true;
            const d = new Date(dateStr + 'T00:00:00');
            if(startDate && d < startDate) return false;
            if(endDate && d > endDate) return false;
            return true;
        };

        // Se não há intervalo definido usamos últimos 8 meses como antes
        if(!startDate && !endDate){
            const meses = this.getLastMonths(8);
            const mapVendas = {}; const mapReceb = {};
            meses.forEach(m=> { mapVendas[m.ym]=0; mapReceb[m.ym]=0; });
            vendas.forEach(v=> { const ym = (v.dataVenda||'').slice(0,7); if(ym in mapVendas) mapVendas[ym]+= v.valor||0; });
            recebimentos.forEach(r=> { const ym = (r.dataRecebimento||'').slice(0,7); if(ym in mapReceb) mapReceb[ym]+= r.valor||0; });
            const vendasSeries = meses.map(m=> mapVendas[m.ym]);
            const recebSeries = meses.map(m=> mapReceb[m.ym]);
            this.drawBarChart('vendasChart', vendasSeries, meses.map(m=> m.label));
            this.drawBarChart('recebimentosChart', recebSeries, meses.map(m=> m.label));
        } else {
            // Monta agregação diária ou mensal conforme tamanho do período
            // Se o período > 120 dias, agregamos por mês; senão por dia
            const effectiveStart = startDate || (vendas.concat(recebimentos).map(i=> i.dataVenda || i.dataRecebimento).filter(Boolean).sort()[0] ? new Date(vendas.concat(recebimentos).map(i=> i.dataVenda || i.dataRecebimento).filter(Boolean).sort()[0]) : new Date());
            const effectiveEnd = endDate || new Date();
            const diffDays = Math.ceil((effectiveEnd - effectiveStart)/(1000*60*60*24));
            const isMonthly = diffDays > 120;
            const mapV = {}; const mapR = {};
            if(isMonthly){
                // Preencher meses entre start e end
                const cur = new Date(effectiveStart.getFullYear(), effectiveStart.getMonth(), 1);
                while(cur <= effectiveEnd){
                    const ym = cur.toISOString().slice(0,7);
                    mapV[ym]=0; mapR[ym]=0;
                    cur.setMonth(cur.getMonth()+1);
                }
                vendas.filter(v=> inRange(v.dataVenda)).forEach(v=>{ const ym=(v.dataVenda||'').slice(0,7); if(ym in mapV) mapV[ym]+= v.valor||0; });
                recebimentos.filter(r=> inRange(r.dataRecebimento)).forEach(r=>{ const ym=(r.dataRecebimento||'').slice(0,7); if(ym in mapR) mapR[ym]+= r.valor||0; });
                const labels = Object.keys(mapV);
                this.drawBarChart('vendasChart', labels.map(k=> mapV[k]), labels.map(l=> l.slice(5,7)+'/'+l.slice(2,4)));
                this.drawBarChart('recebimentosChart', labels.map(k=> mapR[k]), labels.map(l=> l.slice(5,7)+'/'+l.slice(2,4)));
            } else {
                // Diário
                const cur = new Date(effectiveStart.getFullYear(), effectiveStart.getMonth(), effectiveStart.getDate());
                while(cur <= effectiveEnd){
                    const ds = cur.toISOString().slice(0,10);
                    mapV[ds]=0; mapR[ds]=0;
                    cur.setDate(cur.getDate()+1);
                }
                vendas.filter(v=> inRange(v.dataVenda)).forEach(v=>{ const ds=(v.dataVenda||''); if(ds in mapV) mapV[ds]+= v.valor||0; });
                recebimentos.filter(r=> inRange(r.dataRecebimento)).forEach(r=>{ const ds=(r.dataRecebimento||''); if(ds in mapR) mapR[ds]+= r.valor||0; });
                const labels = Object.keys(mapV);
                this.drawBarChart('vendasChart', labels.map(k=> mapV[k]), labels.map(l=> l.slice(8,10)+'/'+l.slice(5,7)));
                this.drawBarChart('recebimentosChart', labels.map(k=> mapR[k]), labels.map(l=> l.slice(8,10)+'/'+l.slice(5,7)));
            }
        }

        // Despesas pagas por categoria dentro do período (ou todas se sem filtro)
        const catTotals = {};
        despesas.filter(d=> d.pago && inRange(d.dataPagamento || d.dataVencimento || d.dataCompra)).forEach(d=> {
            const cat = d.categoria || 'Outras';
            const val = (d.valorPago && d.valorPago>0)? d.valorPago : d.valor || 0;
            catTotals[cat] = (catTotals[cat]||0) + val;
        });
        const catData = Object.entries(catTotals).sort((a,b)=> b[1]-a[1]).slice(0,8);
        const pieColors = ['#17a2b8','#007bff','#6c757d','#28a745','#ffc107','#dc3545','#8e44ad','#1abc9c'];
        const despesasPie = catData.map((([label,value],idx)=> ({label, value, color: pieColors[idx % pieColors.length]})));
        if(despesasPie.length>0){ this.drawPieChart('despesasChart', despesasPie); }

        // Vendas por canal dentro do período
        const canalTotals = {};
        vendas.filter(v=> inRange(v.dataVenda)).forEach(v=> { const canal = v.canal || 'Outros'; canalTotals[canal] = (canalTotals[canal]||0) + (v.valor||0); });
        const canalData = Object.entries(canalTotals).sort((a,b)=> b[1]-a[1]).slice(0,8);
        const canaisPie = canalData.map((([label,value],idx)=> ({label, value, color: pieColors[(idx+2) % pieColors.length]})));
        if(canaisPie.length>0){ this.drawPieChart('canaisChart', canaisPie); }
    }

    drawBarChart(canvasId, data, labelsOverride) {
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
    const months = labelsOverride && labelsOverride.length === data.length ? labelsOverride : ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO'];
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
        const totalValue = data.reduce((s,i)=> s+i.value,0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
        ctx.fillText(totalValue, centerX, centerY + 10);
    }

    getLastMonths(n){
        const arr = [];
        const now = new Date();
        for(let i=n-1;i>=0;i--){
            const d = new Date(now.getFullYear(), now.getMonth()-i, 1);
            const ym = d.toISOString().slice(0,7); // YYYY-MM
            const label = d.toLocaleString('pt-BR',{month:'short'}).replace('.','').toUpperCase();
            arr.push({ym, label});
        }
        return arr;
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

