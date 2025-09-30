// Serviço de Canais de Venda
(function(){
  const STORAGE_KEY = 'sf_canais_venda';
  function load(){ try{ const raw = localStorage.getItem(STORAGE_KEY); if(!raw) return []; const arr = JSON.parse(raw); return Array.isArray(arr)?arr:[]; }catch(e){ return []; } }
  function save(list){ localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }
  function generateId(){ return 'sc_' + Date.now().toString(36) + Math.random().toString(36).substring(2,6); }
  function list(){ return load().sort((a,b)=> a.nome.localeCompare(b.nome)); }
  function create(nome){ nome=(nome||'').trim(); if(!nome) return false; const listData=load(); if(listData.some(i=> i.nome.toLowerCase()===nome.toLowerCase())) return false; listData.push({id:generateId(), nome}); save(listData); return true; }
  function remove(id){ const listData=load(); const newList=listData.filter(i=>i.id!==id); save(newList); return newList.length!==listData.length; }
  function seedIfEmpty(){ const listData=load(); if(listData.length===0){ ['Loja Física','Instagram','E-commerce'].forEach(n=> create(n)); } }
  window.salesChannelService = { list, create, remove, seedIfEmpty };
})();
