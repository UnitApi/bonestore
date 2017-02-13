class Bonestore {
    constructor(config) {
        this.config = config;
        this.stores = [];
        this.listeners = [];
    }

    defineStore(storeName, store) {
        store.onDefine(storeName, this);
        this.stores[storeName] = store;
    }

    getStore(storeName) {
        return this.stores[storeName];
    }

    getDefaultAdapter() {
        return this.config.defaultAdapter;
    }

    onStoreChange(storeName, callback) {
        this.listeners.push({
            storeName, callback,
        });
    }

    offStoreChange(storeName, callback) {
        this.listeners = this.listeners
            .filter(listener =>
                !(
                    listener.storeName === storeName &&
                    listener.callback === callback
                )
            );
    }

    emitChange(storeName, changeType, payload) {
        this.listeners
            .filter(listener => listener.storeName === storeName)
            .forEach((listener) => {
                listener.callback(storeName, changeType, payload);
            });
    }
}

export default Bonestore;
