import uuid from 'uuid';

class MemoryAdapter {
    constructor(config = {}, localStorage = window.localStorage) {
        this.config = config;
        this.localStorage = localStorage;
    }
    _getKey(keyName) {
        return this.config.prefix ? this.config.prefix + keyName : keyName;
    }
    _getData(keyName) {
        const key = this._getKey(keyName);
        const item = this.localStorage.getItem(key);
        if (item) return JSON.parse(item);
        const emptyItem = {};
        this.localStorage.setItem(key, JSON.stringify(emptyItem));
        return emptyItem;
    }
    _saveData(keyName, value) {
        const key = this._getKey(keyName);
        this.localStorage.setItem(key, JSON.stringify(value));
    }
    find(key) {
        const data = this._getData(key);
        return Promise.resolve(data.value);
    }
    create(key, obj) {
        const data = this._getData(key);
        data.value = Object.assign({}, obj);
        this._saveData(key, data);
        return Promise.resolve(data.value);
    }
    update(key, obj) {
        const data = this._getData(key);
        data.value = Object.assign({}, data.value, obj);
        this._saveData(key, data);
        return Promise.resolve(data.value);
    }
    delete(key) {
        const data = this._getData(key);
        delete data.value;
        this._saveData(key, data);
        return Promise.resolve();
    }
    findItem(key, id) {
        const data = this._getData(key);
        const list = data.list || [];
        return Promise.resolve(
            list.find(item => item.id === id)
        );
    }
    findAllItems(key) {
        const data = this._getData(key);
        return Promise.resolve(data.list);
    }
    createItem(key, obj) {
        const data = this._getData(key);
        data.list = data.list || [];
        const item = Object.assign({ id: uuid() }, obj);
        data.list.push(item);
        this._saveData(key, data);
        return Promise.resolve(item);
    }
    updateItem(key, id, obj) {
        const data = this._getData(key);
        const item = data.list.find(e => e.id === id);
        const index = data.list.indexOf(item);
        const newItem = Object.assign({}, item, obj);
        data.list[index] = newItem;
        this._saveData(key, data);
        return Promise.resolve(newItem);
    }
    deleteItem(key, id) {
        const data = this._getData(key);
        const list = data.list || [];
        const index = list.findIndex(e => e.id === id);
        list.splice(index, 1);
        data.list = list;
        this._saveData(key, data);
        return Promise.resolve();
    }
}

export default MemoryAdapter;
