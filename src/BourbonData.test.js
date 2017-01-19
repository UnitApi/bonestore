import BourbonData from './BourbonData';
import Data from './dataTypes/Data';
import MemoryAdapter from './adapters/MemoryAdapter';

describe('BourbonData', () => {
    it('should define store', () => {
        const memoryAdapter = new MemoryAdapter();
        const store = new BourbonData();
        const data = new Data({
            adapter: memoryAdapter,
        });
        store.define('user', data);
        expect(store.get('user')).toBe(data);
    });
    it('should use default adapter store', () => {
        const memoryAdapter = new MemoryAdapter();
        const store = new BourbonData({
            defaultAdapter: memoryAdapter,
        });
        store.define('user', new Data());
        expect(store.get('user').adapter).toBe(memoryAdapter);
    });
    it('should create and find data', () => {
        const memoryAdapter = new MemoryAdapter();
        const store = new BourbonData();
        store.define('user', new Data({
            adapter: memoryAdapter,
        }));
        return store.get('user')
            .create({ name: 'Test' })
            .then(() =>
                store.get('user').find().then((data) => {
                    expect(data.name).toBe('Test');
                })
            );
    });

    describe('events', () => {
        let store;
        beforeEach(() => {
            store = new BourbonData({
                defaultAdapter: new MemoryAdapter(),
            });
            store.define('user', new Data({}));
        });
        it('should emit create event', () =>
            new Promise((resolve) => {
                store.on('user', (event, data) => {
                    expect(event).toBe('create');
                    expect(data.name).toBe('Test');
                    resolve();
                });
                store.get('user').create({ name: 'Test' });
            })
        );
        it('should emit update event', () =>
            new Promise((resolve) => {
                store.on('user', (event, data) => {
                    expect(event).toBe('update');
                    expect(data.name).toBe('Test');
                    resolve();
                });
                store.get('user').update({ name: 'Test' });
            })
        );
        it('should emit delete event', () =>
            new Promise((resolve) => {
                store.on('user', (event) => {
                    expect(event).toBe('delete');
                    resolve();
                });
                store.get('user').delete();
            })
        );
        it('should not emit event', () =>
            new Promise((resolve) => {
                let emited = false;
                const listener = () => {
                    emited = true;
                };
                store.on('user', listener);
                store.off('user', listener);
                store.get('user').delete();
                setTimeout(() => {
                    expect(emited).toBe(false);
                    resolve();
                }, 1);
            })
        );
    });
});
