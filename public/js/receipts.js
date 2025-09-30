// Serviço de Recebimentos (Valores Recebidos) usando localStorage
(function(){
    const STORAGE_KEY = 'sf_recebimentos';

    function load(){
        try{
            const raw = localStorage.getItem(STORAGE_KEY);
            if(!raw) return [];
            const arr = JSON.parse(raw);
            return Array.isArray(arr) ? arr : [];
        }catch(e){
            console.warn('Erro ao carregar recebimentos', e);
            return [];
        }
    }

    function save(list){
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }

    function generateId(){
        return 'rc_' + Date.now().toString(36) + Math.random().toString(36).substring(2,8);
    }

    function list(){
        return load().sort((a,b)=> (a.dataRecebimento||'').localeCompare(b.dataRecebimento||''));
    }

    function create(data){
        const listData = load();
        const item = {
            id: generateId(),
            descricao: data.descricao?.trim() || 'Sem Descrição',
            observacoes: data.observacoes || '',
            valor: typeof data.valor === 'number' ? data.valor : 0,
            dataRecebimento: data.dataRecebimento || new Date().toISOString().substring(0,10),
            formaRecebimento: data.formaRecebimento || '',
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
        if(window.storageUtils && storageUtils.hasSeed('recebimentos')) return;
        const listData = load();
        if(listData.length === 0){
            create({descricao:'Venda Produtos', valor:2500, dataRecebimento:'2025-01-01', formaRecebimento:'Dinheiro'});
            create({descricao:'Transferência', valor:500, dataRecebimento:'2025-01-01', formaRecebimento:'Banco Amer'});
            create({descricao:'Venda Produtos', valor:200, dataRecebimento:'2025-01-01', formaRecebimento:'Banco San'});
        }
        if(window.storageUtils) storageUtils.markSeed('recebimentos');
    }

    window.receiptService = { list, create, update, remove, seedIfEmpty };
})();
