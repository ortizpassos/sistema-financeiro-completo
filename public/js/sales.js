// Serviço de Vendas
(function(){
  const STORAGE_KEY = 'sf_vendas';
  function load(){
    try{ const raw = localStorage.getItem(STORAGE_KEY); if(!raw) return []; const arr = JSON.parse(raw); return Array.isArray(arr)?arr:[]; }catch(e){ return []; }
  }
  function save(list){ localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }
  function generateId(){ return 'sv_' + Date.now().toString(36) + Math.random().toString(36).substring(2,8); }
  function list(){ return load().sort((a,b)=> (a.dataVenda||'').localeCompare(b.dataVenda||'')); }
  function create(data){
    const listData = load();
    const item = {
      id: generateId(),
      descricao: data.descricao?.trim() || 'Sem Descrição',
      observacoes: data.observacoes || '',
      valor: typeof data.valor === 'number' ? data.valor : 0,
      dataVenda: data.dataVenda || new Date().toISOString().substring(0,10),
      canal: data.canal || '',
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    };
    listData.push(item);
    save(listData);
    return item;
  }
  function update(id, patch){
    const listData = load();
    const idx = listData.findIndex(i=>i.id===id);
    if(idx===-1) return false;
    listData[idx] = { ...listData[idx], ...patch, atualizadoEm: new Date().toISOString() };
    save(listData);
    return true;
  }
  function remove(id){
    const listData = load();
    const newList = listData.filter(i=>i.id!==id);
    save(newList);
    return newList.length !== listData.length;
  }
  function seedIfEmpty(){
    if(window.storageUtils && storageUtils.hasSeed('vendas')) return;
    const listData = load();
    if(listData.length===0){
      create({descricao:'Venda Produtos', valor:2500, dataVenda:'2025-01-01', canal:'Loja Física'});
      create({descricao:'Venda Instagram', valor:500, dataVenda:'2025-01-01', canal:'Instagram'});
      create({descricao:'Venda Site', valor:200, dataVenda:'2025-01-01', canal:'E-commerce'});
    }
    if(window.storageUtils) storageUtils.markSeed('vendas');
  }
  window.salesService = { list, create, update, remove, seedIfEmpty };
})();
