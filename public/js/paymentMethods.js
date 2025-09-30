// Service de formas de pagamento
(function(){
  const STORAGE_KEY = 'sf_formas_pagamento';
  function load(){ try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; } }
  function save(list){ localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }
  function genId(){ return 'fp_' + Math.random().toString(36).slice(2,9); }
  const service = {
    list(){ return load().sort((a,b)=> a.nome.localeCompare(b.nome)); },
    create(nome){
      const name = (nome||'').trim();
      if(!name) return null;
      const list = load();
      if(list.some(f=> f.nome.toLowerCase() === name.toLowerCase())) return null;
      const item = { id: genId(), nome: name, createdAt: new Date().toISOString() };
      list.push(item); save(list); return item;
    },
    remove(id){ save(load().filter(f=> f.id !== id)); },
    seedIfEmpty(){
      const list = load();
      if(list.length===0){ ['Dinheiro','PIX','Cartão Crédito','Cartão Débito','Boleto','Transferência'].forEach(n=> this.create(n)); }
    }
  };
  window.paymentMethodService = service;
})();
