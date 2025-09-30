// Utilitário central de persistência e normalização
(function(){
  const utils = {};

  utils.safeParse = function(raw, fallback){
    if(raw === undefined || raw === null) return fallback;
    try { return JSON.parse(raw); } catch { return fallback; }
  };

  utils.loadJSON = function(key, fallback){
    return utils.safeParse(localStorage.getItem(key), fallback);
  };

  utils.saveJSON = function(key, value){
    localStorage.setItem(key, JSON.stringify(value));
  };

  utils.generateId = function(prefix){
    return prefix + '_' + Math.random().toString(36).slice(2,10);
  };

  // Normaliza valores monetários para inteiro (centavos)
  utils.toCents = function(value){
    if(value === null || value === undefined || value === '') return 0;
    const num = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.,-]/g,'').replace(',', '.'));
    if(isNaN(num)) return 0;
    return Math.round(num * 100);
  };

  utils.centsToNumber = function(cents){
    return (cents || 0) / 100;
  };

  utils.isValidDate = function(iso){
    return /^\d{4}-\d{2}-\d{2}$/.test(iso);
  };

  utils.today = function(){
    return new Date().toISOString().substring(0,10);
  };

  utils.schemaVersion = 1;

  // Controle de seeds aplicados para não re-semearem após exclusões do usuário
  const SEED_FLAG_KEY = 'sf__seeds_applied';
  function loadSeedFlags(){ return utils.loadJSON(SEED_FLAG_KEY, {}); }
  function saveSeedFlags(obj){ utils.saveJSON(SEED_FLAG_KEY, obj); }
  utils.hasSeed = function(name){ const flags = loadSeedFlags(); return !!flags[name]; };
  utils.markSeed = function(name){ const flags = loadSeedFlags(); flags[name] = true; saveSeedFlags(flags); };

  window.storageUtils = utils;
})();
