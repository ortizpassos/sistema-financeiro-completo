// Service de fornecedores com persistência localStorage
(function(){
  const STORAGE_KEY = 'sf_fornecedores';

  function load(){
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
  }
  function save(list){ localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }
  function genId(){ return 'forn_' + Math.random().toString(36).slice(2,9); }

  const service = {
    list(){ return load().sort((a,b)=> a.nome.localeCompare(b.nome)); },
    create(nome){
      const name = (nome||'').trim();
      if(!name) return null;
      const list = load();
      if(list.some(f=> f.nome.toLowerCase() === name.toLowerCase())) return null; // evita duplicado simples
      const item = { id: genId(), nome: name, createdAt: new Date().toISOString() };
      list.push(item); save(list); return item;
    },
    remove(id){ save(load().filter(f=> f.id !== id)); },
    seedIfEmpty(){
      const list = load();
      if(list.length===0){
        ['Imobiliária','Concessionária','Internet','Fornecedor 1','Fornecedor 2'].forEach(n=> this.create(n));
      }
    }
  };

  window.supplierService = service;
})();
