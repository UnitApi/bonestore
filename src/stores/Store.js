class Store {
    constructor(config = {}) {
        this.adapter = config.adapter;
        this.config = config;
    }
    onDefine(key, container) {
        this.key = key;
        this.container = container;
        if (!this.adapter) {
            this.adapter = this.container.getDefaultAdapter();
        }
    }
    find(params) {
        return this.adapter.find(this.key, params);
    }
    create(obj, params) {
        return this.adapter.create(this.key, obj, params).then((item) => {
            this.container.emitChange(this.key, 'create', item);
        });
    }
    update(obj, params) {
        return this.adapter.update(this.key, obj, params).then((item) => {
            this.container.emitChange(this.key, 'update', item);
        });
    }
    delete(params) {
        return this.adapter.delete(this.key, params).then(() => {
            this.container.emitChange(this.key, 'delete');
        });
    }
    defaultFind() {
        return this.find();
    }
}

export default Store;
