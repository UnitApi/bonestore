import { create as axiosCreate } from 'axios';

const defaultConfig = {
    baseURL: '',
    timeout: 10000,
    headers: {},
};

class HttpRestAdpater {
    constructor(config, createAjax = axiosCreate) {
        this.config = Object.assign({}, defaultConfig, config);
        this.ajax = createAjax(this.config);
    }
    find(key, params) {
        return this.ajax
            .get(key, { params })
            .then(({ data }) => data);
    }
    create(key, dataObj, params) {
        return this.ajax
            .post(key, dataObj, { params })
            .then(({ data }) => data);
    }
    update(key, dataObj, params) {
        return this.ajax
            .put(key, dataObj, { params })
            .then(({ data }) => data);
    }
    delete(key, params) {
        return this.ajax
            .delete(key, { params })
            .then(({ data }) => data);
    }

    findAllItems(key, params) {
        return this.find(key, params);
    }
    findItem(key, id, params) {
        return this.ajax
            .get(`${key}/${id}`, { params })
            .then(({ data }) => data);
    }
    createItem(key, dataObj, params) {
        return this.create(key, dataObj, params);
    }
    updateItem(key, id, dataObj, params) {
        return this.ajax
            .put(`${key}/${id}`, dataObj, { params })
            .then(({ data }) => data);
    }
    deleteItem(key, id, params) {
        return this.ajax
            .delete(`${key}/${id}`, { params })
            .then(({ data }) => data);
    }
}

export default HttpRestAdpater;
