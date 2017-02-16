# Bonestore
[![npm version](https://img.shields.io/npm/v/bonestore.svg)](https://www.npmjs.com/package/bonestore) [![Build Status](https://travis-ci.org/Bonestore/bonestore.svg?branch=master)](https://travis-ci.org/Bonestore/bonestore) [![Dependency Status](https://david-dm.org/Bonestore/bonestore.svg)](https://david-dm.org/Bonestore/bonestore) [![devDependencies Status](https://david-dm.org/Bonestore/bonestore/dev-status.svg)](https://david-dm.org/Bonestore/bonestore?type=dev) [![codecov](https://codecov.io/gh/Bonestore/bonestore/branch/master/graph/badge.svg)](https://codecov.io/gh/Bonestore/bonestore)


Simple app data management.

## Installing

Using npm:

```
$ npm install bonestore
```

## Example

First create `Bonestore` instance.
It will be used to hold stores and provide default adapter.

```js
import Bonestore, { Store, CollectionStore, HttpRestAdapter } from 'bonestore';

const data = new Bonestore({
    defaultAdapter: new HttpRestAdapter({
        baseURL: 'https://api.example.com/v1/',
    }),
});
```

Next define stores

```js
// Simple data object { key: value }
data.defineStore('permissions', new Store());

// Collection of objects [{key: value}, …]
data.defineStore('posts', new CollectionStore());
```

Finally you can read/create/update/delete

```js
data.getStore('permissions')
    .find() // GET https://api.example.com/v1/permissions
    .then((permissions) => {
        permissions.roles;
    });

data.getStore('posts')
    .findAll() // GET https://api.example.com/v1/posts
    .then((postsArray) => {
        postsArray;
    });

data.getStore('posts')
    .find(321) // GET https://api.example.com/v1/posts/321
    .then((post) => {
        post;
    });

data.getStore('posts')
    .create({ title: 'Lorem' }) // POST https://api.example.com/v1/posts
    .then((post) => {
        post.id; // new id from backend
        post.title; // 'Lorem'
    });
```

Watch store changes

```js
data.onStoreChange('posts', (storeName, changeType, payload) => {
    console.log('Posts changed', changeType, payload);
})
```

## API

### `Bonestore(config)`

#### Configuration
 - `defaultAdapter: adapterInstance` - default adapter for defined stores

#### Methods
 - `defineStore(storeName, storeInstance)` - define store
 - `getStore(storeName)` - return defined store
 - `onStoreChange(storeName, callback)` - listen for changes in specific store
 - `offStoreChange(storeName, callback)` - stop listen
 - `emitChange(storeName, changeType, payload)` - emmit store change (for internal use in stores)


### Stores

#### `new Store(config)`
 - `find(params)` - find object
 - `create(obj, params)` - overwrite
 - `update(obj, params)` - update
 - `delete(params)` - remove (empty object)

#### `new CollectionStore(config)`
 - `find(id, params)` - find one item
 - `findAll(params)` - find list of items
 - `create(obj, params)` - create new object
 - `update(obj, params)` - update existing item (id must be provided)
 - `save(obj, params)` - update or create item when id does not exists
 - `delete(id, params)` - delete one item

#### Store configuration
 - `adapter: adapterInstance` - (optional) adapter instance

**Warning:** `params` currently only work with HTTP adapter and are sent as query string.



### Adapters
```js
new MemoryAdapter()
```
```js
new LocalStorageAdapter({
    prefix: 'my_app_', // default ''
})
```
```js
new HttpRestAdapter({
    baseURL: '',
    timeout: 2000, // default 10s
    headers: {},
})
```


## Extending stores

If you need more complex functionality, you can extend the Store class.
```js
// PostsStore.js
class PostsStore extends CollectionStore {
    findUserPosts(userId) {
        return this.findAll({ user: userId });
    }
}
```
```js
// data.js
data.defineStore('posts', new PostsStore());
```
