# Bourbon data

```js
import BourbonData, { Data, DataList } from 'bourbon-data';
import HttpAdapter from 'bourbon-data-adapter-http';
import LocalStorageAdapter from 'bourbon-data-adapter-localstorage';

const httpAdapter = new HttpAdapter({
    base: 'http://localhost:6666/api'
});

const userLocalAdapter = new LocalStorageAdapter({
    prefix: 'app_',
});


const store = new BourbonData({
    defaultAdapter: httpAdapter,
});

store.define('user', new Data({
    adapter: userLocalAdapter,
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

- Data:                 Adapter:
  - `find()`              find
  - `create(obj)`         create
  - `update(obj)`         update
  - `delete()`            delete


- DataList:             Adapter:
  - `find(id)`            findItem
  - `findAll(query?)`     findAllItems
  - `create(obj)`         createItem
  - `update(obj)`         updateItem
  - `delete(id)`          deleteItem

```js
// localStorage.get('app_user')
store.get('user')
    .find()
    .then((user) => {
        user.name;
    });

// localStorage.set('app_user', user)
store.get('user')
    .create({
        name: 'Kacper'
    })
    .then((user) => {
        user.name;
    });

// localStorage.set('app_user', extend({}, old, new))
store.get('user')
    .update({
        name: 'Kacper'
    })
    .then((user) => {
        user.name;
    });

// localStorage.clear('app_user')
store.get('user')
    .delete()
    .then(() => {
        // done
    });


//////////////////////////////////////////////////////////////////


// GET http://localhost:6666/api/posts
store.get('posts')
    .findAll()
    .then((postArray) => {
        postArray[0].title;
    });

// GET http://localhost:6666/api/posts?page=2
store.get('posts')
    .findAll({ page: 2 })
    .then((postArray) => {
        postArray[0].title;
    });

// GET http://localhost:6666/api/posts/@me
store.get('posts')
    .findAll('@me')
    .then((postArray) => {
        postArray[0].title;
    });

// GET http://localhost:6666/api/posts/1
store.get('posts')
    .find(1)
    .then((post) => {
        post.title;
    });

// POST http://localhost:6666/api/posts
store.get('posts')
    .create({
        title: 'Lorem',
    })
    .then((post) => {
        post.id; // new id
        post.title;
    });

// PATCH http://localhost:6666/api/posts/2
store.get('posts')
    .update({
        id: 2,
        title: 'Lorem',
    })
    .then((post) => {
        post.id;
        post.title;
    });

// DELETE http://localhost:6666/api/posts/2
store.get('posts')
    .delete(2)
    .then(() => {
        // done
    });


//////////////////////////////////////////////////////////////////


import bourbonDataConnect from 'react-bourbon-data-connect';

const UserProfile = ({ user, posts }) =>
    <div>
        <h1>{user.name}</h1>
        <ul>
            {posts.map((post) =>
                <li>{post.title}</li>
            )}
        </ul>
    </div>;

export default bourbonDataConnect(() => [
    'user',
    ['user', 'user', (user) => user.find()]
])(UserProfile);

export default bourbonDataConnect(() => [
    ['onUpdateUser', 'user', (user) => (data) => user.update(data)]
])(UserProfile);


export default bourbonDataConnect(() => [
    'posts',
    ['posts', 'posts', (posts) => posts.findAll()]
])(UserProfile);

export default bourbonDataConnect(() => [
    ['lastPosts', 'posts', (posts) => posts.findAll({ limit: 5 })]
])(UserProfile);

export default bourbonDataConnect(() => [
    {
        propName: 'lastPosts',
        watch: ['posts'],
        value: (posts) => posts.findAll({ limit: 5 })
    }
])(UserProfile);

export default bourbonDataConnect(() => [
    ['getPostsPage', 'posts', (posts) => (page) => posts.findAll({ page })]
])(UserProfile);
```
