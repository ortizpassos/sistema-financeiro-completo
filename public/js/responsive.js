// Controle de responsividade (sidebar mobile)
(function(){
  function ensureOverlay(){
    let ov = document.getElementById('sidebar-overlay');
    if(!ov){
      ov = document.createElement('div');
      ov.id = 'sidebar-overlay';
      ov.className = 'sidebar-overlay';
      document.body.appendChild(ov);
    }
    return ov;
  }

  function openSidebar(){
    const sidebar = document.querySelector('.sidebar');
    if(!sidebar) return;
    sidebar.classList.add('show');
    ensureOverlay().classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar(){
    const sidebar = document.querySelector('.sidebar');
    if(!sidebar) return;
    sidebar.classList.remove('show');
    ensureOverlay().classList.remove('show');
    document.body.style.overflow = '';
  }

  function bind(){
    const toggle = document.getElementById('menu-toggle');
    if(toggle){
      toggle.addEventListener('click', ()=>{
        const sidebar = document.querySelector('.sidebar');
        if(sidebar.classList.contains('show')) closeSidebar(); else openSidebar();
      });
    }
    const ov = ensureOverlay();
    ov.addEventListener('click', closeSidebar);
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape'){ closeSidebar(); }
    });
    window.addEventListener('resize', ()=>{
      if(window.innerWidth > 768){
        closeSidebar();
      }
    });
  }

  if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', bind); } else { bind(); }
})();
