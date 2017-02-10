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
    find(id, params) {
        return this.adapter.findItem(this.key, id, params);
    }
    findAll(params) {
        return this.adapter.findAllItems(this.key, params);
    }
    create(obj, params) {
        return this.adapter.createItem(this.key, obj, params)
            .then((item) => {
                this.container.emitChange(this.key, 'create', item);
                return item;
            });
    }
    update(obj, params) {
        const id = obj[this.config.id];
        return this.adapter.updateItem(this.key, id, obj, params)
            .then((item) => {
                this.container.emitChange(this.key, 'update', item);
                return item;
            });
    }
    delete(id, params) {
        const idKey = this.config.id;
        return this.adapter.deleteItem(this.key, id, params).then(() => {
            this.container.emitChange(this.key, 'delete', { [idKey]: id });
        });
    }
    defaultFind() {
        return this.findAll();
    }
}

export default CollectionStore;
