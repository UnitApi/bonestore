import BourbonData from './BourbonData';
import Store from './stores/Store';
import MemoryAdapter from './adapters/MemoryAdapter';

describe('BourbonData', () => {
    it('should define store', () => {
        const memoryAdapter = new MemoryAdapter();
        const data = new BourbonData();
        const store = new Store({
            adapter: memoryAdapter,
        });
        data.defineStore('user', store);
        expect(data.getStore('user')).toBe(store);
    });
    it('should use default adapter', () => {
        const memoryAdapter = new MemoryAdapter();
        const data = new BourbonData({
            defaultAdapter: memoryAdapter,
        });
        data.defineStore('user', new Store());
        expect(data.getStore('user').adapter).toBe(memoryAdapter);
    });
    it('should create and find data', () => {
        const memoryAdapter = new MemoryAdapter();
        const data = new BourbonData();
        data.defineStore('user', new Store({
            adapter: memoryAdapter,
        }));
        return data.getStore('user')
            .create({ name: 'Test' })
            .then(() =>
                data.getStore('user').find().then((user) => {
                    expect(user.name).toBe('Test');
                })
            );
    });

    describe('events', () => {
        let data;
        beforeEach(() => {
            data = new BourbonData({
                defaultAdapter: new MemoryAdapter(),
            });
            data.defineStore('user', new Store({}));
        });
        it('should emit create event', () =>
            new Promise((resolve) => {
                data.onStoreChange('user', (storeName, changeType, payload) => {
                    expect(storeName).toBe('user');
                    expect(changeType).toBe('create');
                    expect(payload.name).toBe('Test');
                    resolve();
                });
                data.getStore('user').create({ name: 'Test' });
            })
        );
        it('should emit update event', () =>
            new Promise((resolve) => {
                data.onStoreChange('user', (storeName, changeType, payload) => {
                    expect(changeType).toBe('update');
                    expect(payload.name).toBe('Test');
                    resolve();
                });
                data.getStore('user').update({ name: 'Test' });
            })
        );
        it('should emit delete event', () =>
            new Promise((resolve) => {
                data.onStoreChange('user', (storeName, changeType) => {
                    expect(changeType).toBe('delete');
                    resolve();
                });
                data.getStore('user').delete();
            })
        );
        it('should not emit event', () =>
            new Promise((resolve) => {
                let emited = false;
                const listener = () => {
                    emited = true;
                };
                data.onStoreChange('user', listener);
                data.offStoreChange('user', listener);
                data.getStore('user').delete();
                setTimeout(() => {
                    expect(emited).toBe(false);
                    resolve();
                }, 1);
            })
        );
    });
});
