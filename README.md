# Bourbon data [![npm version](https://img.shields.io/npm/v/bourbon-data.svg)](https://www.npmjs.com/package/bourbon-data)  [![Build Status](https://travis-ci.org/KacperKozak/bourbon-data.svg?branch=master)](https://travis-ci.org/KacperKozak/bourbon-data) [![Dependency Status](https://david-dm.org/KacperKozak/bourbon-data.svg)](https://david-dm.org/KacperKozak/bourbon-data) [![devDependencies Status](https://david-dm.org/KacperKozak/bourbon-data/dev-status.svg)](https://david-dm.org/KacperKozak/bourbon-data?type=dev)

Simple app data management.

## API

- **`new BourbonData(config)`**
  - `defineStore(name, store)`
  - `getStore(name)`
  - `onStoreChange(storeName, callback)`
  - `offStoreChange(storeName, callback)`
  - `emitChange(storeName, changeType, payload)`

### Stores

- **`new Store(config)`**
  - `find()`
  - `create(obj)`
  - `update(obj)`
  - `delete()`


- **`new CollectionStore(config)`**
  - `find(id)`
  - `findAll()`
  - `create(obj)`
  - `update(obj)`
  - `delete(id)`

### Adapters

- `new MemoryAdapter()`
- `new LocalStorageAdapter(config)`
- `new HttpRestAdapter(config)` **(work in progress)**


## Example

### Create BourbonData instance
```js
import BourbonData, { Store, CollectionStore, LocalStorageAdapter } from 'bourbon-data';

const data = new BourbonData({
    defaultAdapter: new LocalStorageAdapter({
        prefix: 'my_app_',
    }),
});
```

### Define store

```js
// Data object { key: value }
data.defineStore('user', new Store());

// Collection of objects [{key: value}, …]
data.defineStore('posts', new CollectionStore({
    id: 'id', // default,
}));
```

### Read/create/update/delete store

```js
data.getStore('user')
    .find()
    .then((user) => {
        user.name;
    });

data.getStore('user')
    .create({
        name: 'Kacper'
    })
    .then((user) => {
        user.name;
    });

data.getStore('user')
    .update({
        name: 'Kacper'
    })
    .then((user) => {
        user.name;
    });

data.getStore('user')
    .delete()
    .then(() => {
        // done
    });
```

### Read/create/update/delete collection store

```js
data.getStore('posts')
    .findAll()
    .then((postArray) => {
        postArray[0].title;
    });

data.getStore('posts')
    .find(1)
    .then((post) => {
        post.title;
    });

data.getStore('posts')
    .create({
        title: 'Lorem',
    })
    .then((post) => {
        post.id; // new id
        post.title;
    });

data.getStore('posts')
    .update({
        id: 2,
        title: 'Lorem',
    })
    .then((post) => {
        post.id;
        post.title;
    });

data.getStore('posts')
    .delete(2)
    .then(() => {
        // done
    });
```

### Watch store changes

```js
data.onStoreChange('posts', (storeName, changeType, payload) => {
    console.log('Posts changed', changeType, payload);
})
```
