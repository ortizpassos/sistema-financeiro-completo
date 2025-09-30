// Botão de suporte abrindo WhatsApp do desenvolvedor
(function(){
  const PHONE = '5547999876298'; // DDI + DDD + número
  const MESSAGE = 'preciso de suporte para seu aplicativo de gestão financeira';
  function buildUrl(){
    const encoded = encodeURIComponent(MESSAGE);
    return `https://wa.me/${PHONE}?text=${encoded}`;
  }
  function init(){
    const btn = document.getElementById('support-btn');
    if(!btn) return;
    btn.addEventListener('click', () => {
      window.open(buildUrl(), '_blank');
    });
    // Acesso via teclado: Enter já funciona pois é button; opcionalmente poderia adicionar aria-describedby
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
