# Bourbon data

Simple app data management.

## API

- **`new BourbonData(config)`**
  - `define(name, storeManager)`
  - `get(name)`
  - `on(name, callback)`

### Data managers

- **`new Data(config)`**
  - `find()`
  - `create(obj)`
  - `update(obj)`
  - `delete()`


- **`new DataList(config)`**
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

### Create store
```js
import BourbonData, { Data, DataList, LocalStorageAdapter } from 'bourbon-data';

const store = new BourbonData({
    defaultAdapter: new LocalStorageAdapter({
        prefix: 'my_app_',
    }),
});

store.define('user', new Data());
store.define('posts', new DataList({
    id: 'id', // default,
}));

store.on('posts', (posts) => {
    console.log('Posts changed', posts.findAll());
})
```

### Usage       

```js
store.get('user')
    .find()
    .then((user) => {
        user.name;
    });

store.get('user')
    .create({
        name: 'Kacper'
    })
    .then((user) => {
        user.name;
    });

store.get('user')
    .update({
        name: 'Kacper'
    })
    .then((user) => {
        user.name;
    });

store.get('user')
    .delete()
    .then(() => {
        // done
    });



store.get('posts')
    .findAll()
    .then((postArray) => {
        postArray[0].title;
    });

store.get('posts')
    .find(1)
    .then((post) => {
        post.title;
    });

store.get('posts')
    .create({
        title: 'Lorem',
    })
    .then((post) => {
        post.id; // new id
        post.title;
    });

store.get('posts')
    .update({
        id: 2,
        title: 'Lorem',
    })
    .then((post) => {
        post.id;
        post.title;
    });

store.get('posts')
    .delete(2)
    .then(() => {
        // done
    });
```
