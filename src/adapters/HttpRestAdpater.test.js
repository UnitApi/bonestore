import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

import HttpRestAdpater from './HttpRestAdpater';

const sampleConfig = {
    baseURL: 'https://api.example.com/v1/',
    headers: {
        Authorization: 'auth-token-here',
    },
};

const data = {
    settings: {
        color: 'red',
    },
    users: [
        { id: 1, name: 'Adam' },
        { id: 2, name: 'Jack' },
    ],
};

const ajaxMock = (config) => {
    const axiosObj = axios.create(config);
    const mock = new AxiosMockAdapter(axiosObj);
    mock.onGet('settings').reply(200, data.settings);
    mock.onPost('settings', { timeout: 5 }).reply(200, { type: 'post' });
    mock.onPut('settings', { timeout: 5 }).reply(200, { type: 'put' });
    mock.onDelete('settings').reply(200, { type: 'delete' });
    mock.onGet('users').reply(200, data.users);
    mock.onGet('users/1').reply(200, data.users[0]);
    mock.onGet('users/2').reply(200, data.users[1]);
    mock.onPost('users', { name: 'Donald' }).reply(200, { type: 'post' });
    mock.onPut('users/1', { name: 'Aleksander' }).reply(200, { type: 'put' });
    mock.onDelete('users/1').reply(200, { type: 'delete' });
    return axiosObj;
};

describe('HttpRestAdpater', () => {
    it('should find data using GET method', () => {
        const adapter = new HttpRestAdpater(sampleConfig, ajaxMock);
        return adapter.find('settings')
            .then((settings) => {
                expect(settings).toEqual(data.settings);
            });
    });
    it('should create data using POST method', () => {
        const adapter = new HttpRestAdpater(sampleConfig, ajaxMock);
        return adapter.create('settings', { timeout: 5 })
            .then((response) => {
                expect(response).toEqual({ type: 'post' });
            });
    });
    it('should update data using PUT method', () => {
        const adapter = new HttpRestAdpater(sampleConfig, ajaxMock);
        return adapter.update('settings', { timeout: 5 })
            .then((response) => {
                expect(response).toEqual({ type: 'put' });
            });
    });
    it('should delete data using DELETE method', () => {
        const adapter = new HttpRestAdpater(sampleConfig, ajaxMock);
        return adapter.delete('settings')
            .then((response) => {
                expect(response).toEqual({ type: 'delete' });
            });
    });

    it('should find all items using GET method', () => {
        const adapter = new HttpRestAdpater(sampleConfig, ajaxMock);
        return adapter.findAllItems('users')
            .then((users) => {
                expect(users).toEqual(data.users);
            });
    });
    it('should find one items using GET method', () => {
        const adapter = new HttpRestAdpater(sampleConfig, ajaxMock);
        return adapter.findItem('users', 2)
            .then((users) => {
                expect(users).toEqual(data.users[1]);
            });
    });
    it('should create items using POST method', () => {
        const adapter = new HttpRestAdpater(sampleConfig, ajaxMock);
        return adapter.createItem('users', { name: 'Donald' })
            .then((response) => {
                expect(response).toEqual({ type: 'post' });
            });
    });
    it('should update item using PUT method', () => {
        const adapter = new HttpRestAdpater(sampleConfig, ajaxMock);
        return adapter.updateItem('users', 1, { name: 'Aleksander' })
            .then((response) => {
                expect(response).toEqual({ type: 'put' });
            });
    });
    it('should delete item using DELETE method', () => {
        const adapter = new HttpRestAdpater(sampleConfig, ajaxMock);
        return adapter.deleteItem('users', 1)
            .then((response) => {
                expect(response).toEqual({ type: 'delete' });
            });
    });
    it('should use axios by default', () => {
        const adapter = new HttpRestAdpater(sampleConfig);
        expect(adapter.ajax).toBeInstanceOf(Object);
        expect(adapter.ajax.get).toBeInstanceOf(Function);
        expect(adapter.ajax.post).toBeInstanceOf(Function);
        expect(adapter.ajax.put).toBeInstanceOf(Function);
        expect(adapter.ajax.delete).toBeInstanceOf(Function);
    });
});
