// Service de categorias de despesas
(function(){
  const STORAGE_KEY = 'sf_categorias';
  function load(){ try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; } }
  function save(list){ localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }
  function genId(){ return 'cat_' + Math.random().toString(36).slice(2,9); }
  const service = {
    list(){ return load().sort((a,b)=> a.nome.localeCompare(b.nome)); },
    create(nome){
      const name = (nome||'').trim();
      if(!name) return null;
      const list = load();
      if(list.some(c=> c.nome.toLowerCase() === name.toLowerCase())) return null;
      const item = { id: genId(), nome: name, createdAt: new Date().toISOString() };
      list.push(item); save(list); return item;
    },
    remove(id){ save(load().filter(c=> c.id !== id)); },
    seedIfEmpty(){
      if(window.storageUtils && storageUtils.hasSeed('categorias')) return;
      const list = load();
      if(list.length===0){ ['Administrativo','Operacional','Marketing','Impostos','Logística'].forEach(n=> this.create(n)); }
      if(window.storageUtils) storageUtils.markSeed('categorias');
    }
  };
  window.categoryService = service;
})();
