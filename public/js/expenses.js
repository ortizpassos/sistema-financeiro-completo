// Serviço de gerenciamento de despesas (refatorado para usar storageUtils)
(function(){
  const STORAGE_KEY = 'sf_despesas';
  const SCHEMA_VERSION = window.storageUtils ? window.storageUtils.schemaVersion : 1;

  function loadRaw(){
    if(!window.storageUtils) return [];
    const arr = storageUtils.loadJSON(STORAGE_KEY, []);
    if(!Array.isArray(arr)) return [];
    return arr.map(normalizeLoaded);
  }

  function save(list){
    storageUtils.saveJSON(STORAGE_KEY, list);
  }

  function normalizeLoaded(item){
    // Migrações futuras podem ser aplicadas aqui
    if(!item.schemaVersion) item.schemaVersion = 1; // baseline
    return item;
  }

  function validate(input){
    const errors = [];
    if(!input.descricao || !input.descricao.trim()) errors.push('descricao obrigatoria');
    if(isNaN(storageUtils.toCents(input.valor || 0))) errors.push('valor invalido');
    const hoje = storageUtils.today();
    const dataCompra = input.dataCompra || hoje;
    const dataVenc = input.dataVencimento || dataCompra;
    if(!storageUtils.isValidDate(dataCompra)) errors.push('dataCompra invalida');
    if(!storageUtils.isValidDate(dataVenc)) errors.push('dataVencimento invalida');
    return { valid: errors.length===0, errors };
  }

  function findIndex(list, id){
    return list.findIndex(d => d.id === id);
  }

  function toPublic(item){
    // Caso futuramente valores sejam armazenados em centavos, aqui converteríamos
    return { ...item };
  }

  const service = {
    list(){
      return loadRaw()
        .sort((a,b)=> new Date(a.dataVencimento) - new Date(b.dataVencimento))
        .map(toPublic);
    },
    create(despesa){
      const now = new Date().toISOString();
      const base = { ...despesa };
      const { valid, errors } = validate(base);
      if(!valid){
        console.warn('Despesa inválida não criada', errors, base);
        return null;
      }
      const list = loadRaw();
      const item = {
        id: storageUtils.generateId('dsp'),
        schemaVersion: SCHEMA_VERSION,
        descricao: String(base.descricao).trim(),
        observacoes: (base.observacoes || '').trim(),
        valor: Number(base.valor || 0), // manter em número simples por enquanto (migração p/ centavos depois)
        dataCompra: base.dataCompra || storageUtils.today(),
        dataVencimento: base.dataVencimento || base.dataCompra || storageUtils.today(),
        dataPagamento: base.dataPagamento || '',
        categoria: base.categoria || '',
        fornecedor: base.fornecedor || '',
        formaPagamento: base.formaPagamento || '',
        valorPago: Number(base.valorPago || 0),
        pago: !!base.pago,
        createdAt: now,
        updatedAt: now
      };
      list.push(item);
      save(list);
      return toPublic(item);
    },
    update(id, patch){
      const list = loadRaw();
      const idx = findIndex(list, id);
      if(idx === -1) return null;
      const merged = { ...list[idx], ...patch, updatedAt: new Date().toISOString() };
      // validar somente campos principais se alterados
      const { valid, errors } = validate(merged);
      if(!valid){
        console.warn('Atualização inválida ignorada', errors, patch);
        return null;
      }
      list[idx] = merged;
      save(list);
      return toPublic(list[idx]);
    },
    remove(id){
      const list = loadRaw().filter(d => d.id !== id);
      save(list);
    },
    togglePago(id){
      const list = loadRaw();
      const idx = findIndex(list, id);
      if(idx === -1) return null;
      if(!list[idx].pago){
        list[idx].pago = true;
        list[idx].dataPagamento = list[idx].dataPagamento || storageUtils.today();
      } else {
        list[idx].pago = false;
        list[idx].dataPagamento = '';
      }
      list[idx].updatedAt = new Date().toISOString();
      save(list);
      return toPublic(list[idx]);
    },
    seedIfEmpty(){
      if(storageUtils.hasSeed('despesas')) return; // já aplicado em algum momento
      const list = loadRaw();
      if(list.length === 0){
        this.create({descricao:'Aluguel', valor:2500, dataCompra:'2025-01-01', dataVencimento:'2025-01-01', categoria:'Administrativo', fornecedor:'Imobiliária', pago:false});
        this.create({descricao:'Energia', valor:500, dataCompra:'2025-01-01', dataVencimento:'2025-01-01', categoria:'Administrativo', fornecedor:'Concessionária', pago:true, dataPagamento:'2025-01-01'});
        this.create({descricao:'Água', valor:200, dataCompra:'2025-01-01', dataVencimento:'2025-01-01', categoria:'Administrativo', fornecedor:'Concessionária', pago:false});
      }
      storageUtils.markSeed('despesas');
    }
  };

  window.expenseService = service;
})();
