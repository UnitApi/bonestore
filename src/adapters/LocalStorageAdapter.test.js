import LocalStorageAdapter from './LocalStorageAdapter';

class LocalStorageMock {
    constructor() {
        this.data = {};
    }
    setItem(key, val) {
        this.data[key] = val.toString();
    }
    getItem(key) {
        return this.data[key] || null;
    }
    removeItem(key) {
        delete this.data[key];
    }
}

describe('LocalStorageAdapter', () => {
    it('should find nothing', () => {
        const adapter = new LocalStorageAdapter({}, new LocalStorageMock());
        return adapter.find('user').then((data) => {
            expect(data).toBeUndefined();
        });
    });
    it('should create and find data', () => {
        const adapter = new LocalStorageAdapter({}, new LocalStorageMock());
        return adapter.create('user', { name: 'Max' }).then((createData) => {
            expect(createData.name).toBe('Max');
            return adapter.find('user').then((findData) => {
                expect(findData.name).toBe('Max');
            });
        });
    });
    it('should delete data', () => {
        const adapter = new LocalStorageAdapter({}, new LocalStorageMock());
        return adapter.create('user', { name: 'Max' }).then(() =>
            adapter.delete('user').then((data) => {
                expect(data).toBeUndefined();
            })
        );
    });
    it('should update data', () => {
        const adapter = new LocalStorageAdapter({}, new LocalStorageMock());
        return adapter.create('user', { name: 'Max', age: 21 }).then(() =>
            adapter.update('user', { name: 'Arnold' }).then((data) => {
                expect(data.name).toBe('Arnold');
                expect(data.age).toBe(21);
            })
        ).then(() =>
            adapter.find('user').then((data) => {
                expect(data.name).toBe('Arnold');
                expect(data.age).toBe(21);
            })
        );
    });

    it('should create and find item in list', () => {
        const adapter = new LocalStorageAdapter({}, new LocalStorageMock());
        const post = { title: 'Hello word' };
        return adapter.createItem('posts', post).then((createData) => {
            expect(createData.id).not.toBeUndefined();
            return adapter.findItem('posts', createData.id).then((findData) => {
                expect(findData.title).toBe('Hello word');
            });
        });
    });

    it('should get list of items', () => {
        const adapter = new LocalStorageAdapter({}, new LocalStorageMock());
        const post1 = { title: 'Hello word' };
        const post2 = { title: 'Hello test' };
        const post3 = { title: 'Hello bugs' };
        return Promise.all([
            adapter.createItem('posts', post1),
            adapter.createItem('posts', post2),
            adapter.createItem('posts', post3),
        ]).then((createdPosts) => {
            expect(createdPosts[0].id).not.toBeUndefined();
            return adapter.findAllItems('posts').then((posts) => {
                expect(posts.length).toBe(3);
                expect(posts[1].title).toBe('Hello test');
            });
        });
    });
    it('should update one of items', () => {
        const adapter = new LocalStorageAdapter({}, new LocalStorageMock());
        const post1 = { title: 'Hello word', body: 'some' };
        const post2 = { title: 'Hello test', body: 'some' };
        const post3 = { title: 'Hello bugs', body: 'some' };
        let id;
        return Promise.all([
            adapter.createItem('posts', post1),
            adapter.createItem('posts', post2),
            adapter.createItem('posts', post3),
        ]).then((createdPosts) => {
            id = createdPosts[1].id;
            adapter.updateItem('posts', id, {
                body: 'test',
            });
        }).then(() =>
            adapter.findItem('posts', id).then((post) => {
                expect(post.body).toBe('test');
                expect(post.title).toBe('Hello test');
            })
        );
    });
    it('should delete one of items', () => {
        const adapter = new LocalStorageAdapter({}, new LocalStorageMock());
        const post1 = { title: 'Hello word', body: 'some' };
        const post2 = { title: 'Hello test', body: 'some' };
        const post3 = { title: 'Hello bugs', body: 'some' };
        let id;
        return Promise.all([
            adapter.createItem('posts', post1),
            adapter.createItem('posts', post2),
            adapter.createItem('posts', post3),
        ]).then((createdPosts) => {
            id = createdPosts[1].id;
            adapter.deleteItem('posts', id);
        }).then(() =>
            adapter.findItem('posts', id).then((post) => {
                expect(post).toBeUndefined();
            })
        );
    });
});
