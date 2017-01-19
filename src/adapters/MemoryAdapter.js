import uuid from 'uuid';

class MemoryAdapter {
    constructor(config = {}) {
        this.config = config;
        this.data = {};
    }
    _getKey(key) {
        if (this.data[key]) {
            return this.data[key];
        }
        this.data[key] = {};
        return this.data[key];
    }
    find(key) {
        const data = this._getKey(key);
        return Promise.resolve(data.value);
    }
    create(key, obj) {
        const data = this._getKey(key);
        data.value = Object.assign({}, obj);
        return Promise.resolve(data.value);
    }
    update(key, obj) {
        const data = this._getKey(key);
        data.value = Object.assign({}, data.value, obj);
        return Promise.resolve(data.value);
    }
    delete(key) {
        const data = this._getKey(key);
        delete data.value;
        return Promise.resolve();
    }
    findItem(key, id) {
        const data = this._getKey(key);
        const list = data.list || [];
        return Promise.resolve(
            list.find(item => item.id === id)
        );
    }
    findAllItems(key) {
        const data = this._getKey(key);
        return Promise.resolve(data.list);
    }
    createItem(key, obj) {
        const data = this._getKey(key);
        data.list = data.list || [];
        const item = Object.assign({ id: uuid() }, obj);
        data.list.push(item);
        return Promise.resolve(item);
    }
    updateItem(key, id, obj) {
        const data = this._getKey(key);
        const item = data.list.find(e => e.id === id);
        const index = data.list.indexOf(item);
        const newItem = Object.assign({}, item, obj);
        data.list[index] = newItem;
        return Promise.resolve(newItem);
    }
    deleteItem(key, id) {
        const data = this._getKey(key);
        const index = data.list.findIndex(e => e.id === id);
        data.list.splice(index, 1);
        return Promise.resolve();
    }
}

export default MemoryAdapter;
