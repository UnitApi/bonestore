class Data {
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
    find() {
        return this.adapter.find(this.key);
    }
    create(obj) {
        return this.adapter.create(this.key, obj).then((item) => {
            this.container.emit(this.key, 'create', item);
        });
    }
    update(obj) {
        return this.adapter.update(this.key, obj).then((item) => {
            this.container.emit(this.key, 'update', item);
        });
    }
    delete() {
        return this.adapter.delete(this.key).then(() => {
            this.container.emit(this.key, 'delete');
        });
    }
}

export default Data;
