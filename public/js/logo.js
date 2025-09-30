// Gestão dinâmica de logo
(function(){
  const STORAGE_KEY = 'sf_app_logo_base64';
  function loadStoredLogo(){
    try{ const data = localStorage.getItem(STORAGE_KEY); return data || null; }catch{ return null; }
  }
  function saveLogo(base64){
    try{ localStorage.setItem(STORAGE_KEY, base64); }catch(e){ console.warn('Falha ao salvar logo', e); }
  }
  function applyLogo(base64){
    const img = document.getElementById('app-logo-img');
    const fallback = document.getElementById('app-logo-fallback');
    if(!img || !fallback) return;
    if(base64){
      img.src = base64;
      img.style.display = 'block';
      fallback.style.display = 'none';
    } else {
      img.src='';
      img.style.display = 'none';
      fallback.style.display = 'flex';
    }
  }
  function handleFile(file){
    if(!file) return;
    const reader = new FileReader();
    reader.onload = (e)=>{
      const result = e.target.result;
      // Opcional: limitar tamanho convertendo para canvas (não implementado aqui para simplicidade)
      saveLogo(result);
      applyLogo(result);
    };
    reader.readAsDataURL(file);
  }
  function bind(){
    const btn = document.getElementById('app-logo-edit');
    const input = document.getElementById('app-logo-file');
    if(btn && input){
      btn.addEventListener('click', (e)=>{ e.preventDefault(); input.click(); });
      input.addEventListener('change', ()=>{ handleFile(input.files[0]); input.value=''; });
    }
  }
  document.addEventListener('DOMContentLoaded', ()=>{
    applyLogo(loadStoredLogo());
    bind();
  });
})();
