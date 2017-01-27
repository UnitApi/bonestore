class CollectionStore {
    constructor(config = {}) {
        this.adapter = config.adapter;
        this.config = {
            id: 'id',
            ...config,
        };
    }
    onDefine(key, container) {
        this.key = key;
        this.container = container;
        if (!this.adapter) {
            this.adapter = this.container.getDefaultAdapter();
        }
    }
    find(id) {
        return this.adapter.findItem(this.key, id);
    }
    findAll() {
        return this.adapter.findAllItems(this.key);
    }
    create(obj) {
        return this.adapter.createItem(this.key, obj).then((item) => {
            this.container.emitChange(this.key, 'create', item);
        });
    }
    update(obj) {
        const id = obj[this.config.id];
        return this.adapter.updateItem(this.key, id, obj).then((item) => {
            this.container.emitChange(this.key, 'update', item);
        });
    }
    delete(id) {
        const idKey = this.config.id;
        return this.adapter.deleteItem(this.key, id).then(() => {
            this.container.emitChange(this.key, 'delete', { [idKey]: id });
        });
    }
    defaultFind() {
        return this.findAll();
    }
}

export default CollectionStore;