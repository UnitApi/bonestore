# Bourbon data

Simple app data management.


## Example

```js
import BourbonData, { Data, DataList, LocalStorageAdapter } from 'bourbon-data';

const userLocalAdapter = new LocalStorageAdapter({
    prefix: 'app_',
});

const store = new BourbonData({
    defaultAdapter: LocalStorageAdapter,
});

store.define('user', new Data({
    default: {
        name: '',
        lastName: '',
        age: null,
    }
}));
store.define('posts', new DataList({
    id: 'id', // default,
    default: {
        title: '',
        content: '',
    }
}));

store.on('posts', (posts) => {
    console.log('Posts changed', posts.findAll());
})
```

## Methods

- Data:             
  - `find()`        
  - `create(obj)`   
  - `update(obj)`   
  - `delete()`      


- DataList:            
  - `find(id)`         
  - `findAll(query?)`  
  - `create(obj)`      
  - `update(obj)`      
  - `delete(id)`       

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
    .findAll({ page: 2 })
    .then((postArray) => {
        postArray[0].title;
    });

store.get('posts')
    .findAll('@me')
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
