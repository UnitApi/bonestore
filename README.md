# Bourbon data
[![npm version](https://img.shields.io/npm/v/bourbon-data.svg)](https://www.npmjs.com/package/bourbon-data)  [![Build Status](https://travis-ci.org/KacperKozak/bourbon-data.svg?branch=master)](https://travis-ci.org/KacperKozak/bourbon-data) [![Dependency Status](https://david-dm.org/KacperKozak/bourbon-data.svg)](https://david-dm.org/KacperKozak/bourbon-data) [![devDependencies Status](https://david-dm.org/KacperKozak/bourbon-data/dev-status.svg)](https://david-dm.org/KacperKozak/bourbon-data?type=dev)

Simple app data management.

## Installing

Using npm:

```
$ npm install bourbon-data
```

## Example

First create `BourbonData` instance.
It will be used to hold stores and provide default adapter.

```js
import BourbonData, { Store, CollectionStore, HttpRestAdapter } from 'bourbon-data';

const data = new BourbonData({
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

### `BourbonData(config)`

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
 - `find(params)`
 - `create(obj, params)`
 - `update(obj, params)`
 - `delete(params)`

#### `new CollectionStore(config)`
 - `find(id, params)`
 - `findAll(params)`
 - `create(obj, params)`
 - `update(obj, params)`
 - `delete(id, params)`

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
