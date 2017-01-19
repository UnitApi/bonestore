class BourbonData {
    constructor(config) {
        this.config = config;
        this.definitions = [];
        this.listeners = [];
    }

    define(key, instance) {
        instance.onDefine(key, this);
        this.definitions[key] = instance;
    }

    get(key) {
        const data = this.definitions[key];
        return data;
    }

    getDefaultAdapter() {
        return this.config.defaultAdapter;
    }

    on(key, callback) {
        this.listeners.push({
            key, callback,
        });
    }

    off(key, callback) {
        this.listeners = this.listeners
            .filter(listener =>
                !(listener.key === key && listener.callback === callback)
            );
    }

    emit(key, event, data) {
        this.listeners
            .filter(listener => listener.key === key)
            .forEach((listener) => {
                listener.callback(event, data);
            });
    }
}

export default BourbonData;
