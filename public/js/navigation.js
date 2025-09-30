// Sistema de navegação por teclas
class KeyboardNavigation {
    constructor() {
        this.currentFocusIndex = 0;
        this.focusableElements = [];
        this.init();
    }

    init() {
        this.updateFocusableElements();
        this.bindEvents();
        this.setInitialFocus();
    }

    updateFocusableElements() {
        // Seleciona todos os elementos focáveis
        const selectors = [
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            'a[href]',
            '[tabindex]:not([tabindex="-1"])'
        ];
        
        this.focusableElements = Array.from(
            document.querySelectorAll(selectors.join(', '))
        ).filter(el => {
            // Filtra elementos visíveis
            const style = window.getComputedStyle(el);
            return style.display !== 'none' && style.visibility !== 'hidden';
        });

        // Ordena por tabindex
        this.focusableElements.sort((a, b) => {
            const aIndex = parseInt(a.getAttribute('tabindex')) || 0;
            const bIndex = parseInt(b.getAttribute('tabindex')) || 0;
            return aIndex - bIndex;
        });
    }

    bindEvents() {
        document.addEventListener('keydown', (e) => {
            this.handleKeyDown(e);
        });

        // Atualiza elementos focáveis quando o DOM muda
        const observer = new MutationObserver(() => {
            this.updateFocusableElements();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['disabled', 'tabindex', 'style']
        });
    }

    handleKeyDown(e) {
        const active = document.activeElement;
        const isFormField = active && (
            active.tagName === 'INPUT' ||
            active.tagName === 'TEXTAREA' ||
            active.tagName === 'SELECT' ||
            active.isContentEditable
        );
        switch(e.key) {
            case 'Tab':
                e.preventDefault();
                if (e.shiftKey) {
                    this.focusPrevious();
                } else {
                    this.focusNext();
                }
                break;
            
            case 'ArrowDown':
                e.preventDefault();
                this.focusNext();
                break;
            
            case 'ArrowUp':
                e.preventDefault();
                this.focusPrevious();
                break;
            
            case 'ArrowLeft':
                if (this.isInSidebar()) {
                    e.preventDefault();
                    this.focusPrevious();
                }
                break;
            
            case 'ArrowRight':
                if (this.isInSidebar()) {
                    e.preventDefault();
                    this.focusNext();
                }
                break;
            
            case 'Enter':
            case ' ':
                const focused = document.activeElement;
                if (focused && (focused.tagName === 'BUTTON' || focused.tagName === 'A')) {
                    e.preventDefault();
                    focused.click();
                }
                break;
            
            case 'Escape':
                e.preventDefault();
                this.handleEscape();
                break;
            
            // Teclas numéricas para navegação rápida no menu
            case '1':
                if(!isFormField){
                    e.preventDefault();
                    this.focusMenuItem(0);
                }
                break;
            case '2':
                if(!isFormField){
                    e.preventDefault();
                    this.focusMenuItem(1);
                }
                break;
            case '3':
                if(!isFormField){
                    e.preventDefault();
                    this.focusMenuItem(2);
                }
                break;
            case '4':
                if(!isFormField){
                    e.preventDefault();
                    this.focusMenuItem(3);
                }
                break;
            case '5':
                if(!isFormField){
                    e.preventDefault();
                    this.focusMenuItem(4);
                }
                break;
            
            // Tecla Home para voltar ao início
            case 'Home':
                e.preventDefault();
                this.goHome();
                break;
        }
    }

    focusNext() {
        this.updateFocusableElements();
        if (this.focusableElements.length === 0) return;
        
        this.currentFocusIndex = (this.currentFocusIndex + 1) % this.focusableElements.length;
        this.setFocus();
    }

    focusPrevious() {
        this.updateFocusableElements();
        if (this.focusableElements.length === 0) return;
        
        this.currentFocusIndex = this.currentFocusIndex === 0 
            ? this.focusableElements.length - 1 
            : this.currentFocusIndex - 1;
        this.setFocus();
    }

    setFocus() {
        if (this.focusableElements[this.currentFocusIndex]) {
            this.focusableElements[this.currentFocusIndex].focus();
        }
    }

    setInitialFocus() {
        this.updateFocusableElements();
        if (this.focusableElements.length > 0) {
            this.currentFocusIndex = 0;
            this.setFocus();
        }
    }

    isInSidebar() {
        const focused = document.activeElement;
        return focused && focused.closest('.sidebar');
    }

    focusMenuItem(index) {
        const menuItems = document.querySelectorAll('.nav-item');
        if (menuItems[index]) {
            menuItems[index].focus();
            this.currentFocusIndex = this.focusableElements.indexOf(menuItems[index]);
        }
    }

    handleEscape() {
        // Se estiver em um formulário, limpa os campos
        const focused = document.activeElement;
        if (focused && (focused.tagName === 'INPUT' || focused.tagName === 'TEXTAREA')) {
            focused.value = '';
        } else {
            // Volta para a tela inicial
            this.goHome();
        }
    }

    goHome() {
        if (typeof loadScreen === 'function') {
            loadScreen('home');
        }
        this.setInitialFocus();
    }

    // Método para focar em um elemento específico
    focusElement(element) {
        if (element) {
            const index = this.focusableElements.indexOf(element);
            if (index !== -1) {
                this.currentFocusIndex = index;
                this.setFocus();
            }
        }
    }

    // Método para adicionar feedback visual
    addFocusIndicator(element) {
        element.style.outline = '2px solid #007bff';
        element.style.outlineOffset = '2px';
    }

    removeFocusIndicator(element) {
        element.style.outline = '';
        element.style.outlineOffset = '';
    }
}

// Inicializa a navegação por teclado quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.keyboardNav = new KeyboardNavigation();
});

// Função para mostrar dicas de navegação
function showNavigationHelp() {
    const helpText = `
    NAVEGAÇÃO POR TECLADO:
    
    • Tab / Shift+Tab: Navegar entre elementos
    • Setas: Navegar (↑↓ sempre, ←→ no menu lateral)
    • Enter/Espaço: Ativar botão/link
    • Escape: Limpar campo ou voltar ao início
    • 1-5: Acesso rápido aos itens do menu
    • Home: Voltar à tela inicial
    
    Pressione Escape para fechar esta ajuda.
    `;
    
    alert(helpText);
}

// Adiciona listener para F1 (ajuda)
document.addEventListener('keydown', (e) => {
    if (e.key === 'F1') {
        e.preventDefault();
        showNavigationHelp();
    }
});

