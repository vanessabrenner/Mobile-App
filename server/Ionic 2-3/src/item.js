import Router from 'koa-router';
import dataStore from 'nedb-promise';
import { broadcast } from './wss.js';

export class ItemStore {
  constructor({ filename, autoload }) {
    this.store = dataStore({ filename, autoload });
  }

  async find(props) {
    return this.store.find(props);
  }

  async findOne(props) {
    return this.store.findOne(props);
  }

  async insert(item) {
    if (!item.title || !item.author || !item.pages) {
      throw new Error('Missing properties');
    }
    if (item.photos) {
      if (!Array.isArray(item.photos)) {
        throw new Error('Photos must be an array');
      }
      item.photos.forEach(photo => {
        if (!photo.filepath) {
          throw new Error('Each photo must have a filepath');
        }
      });
    }
    if (item.location) {
      // Validarea locației (lat și lng trebuie să fie numere)
      const { lat, lng } = item.location;
      if (typeof lat !== 'number' || typeof lng !== 'number') {
        throw new Error('Invalid location coordinates');
      }
    }
    return this.store.insert(item);
  }
  

  async update(props, item) {
    return this.store.update(props, item);
  }

  async remove(props) {
    return this.store.remove(props);
  }
}

const itemStore = new ItemStore({ filename: './db/items.json', autoload: true });

export const itemRouter = new Router();

itemRouter.get('/', async (ctx) => {
  const userId = ctx.state.user._id;
  const items = await itemStore.find({ userId });
  ctx.response.body = items.map(item => ({
    ...item,
    photos: item.photos || [],
    location: item.location || null,
  }));
  ctx.response.status = 200;
});


itemRouter.get('/:id', async (ctx) => {
  const userId = ctx.state.user._id;
  const item = await itemStore.findOne({ _id: ctx.params.id });
  const response = ctx.response;
  if (item) {
    if (item.userId === userId) {
      ctx.response.body = item;
      ctx.response.status = 200; // ok
    } else {
      ctx.response.status = 403; // forbidden
    }
  } else {
    ctx.response.status = 404; // not found
  }
});

const createItem = async (ctx, item, response) => {
  try {
    console.log("CreateItem ", ctx.state);
    const userId = ctx.state.user._id;
    item.userId = userId;
    delete item._id;

    // Validate and normalize photos (uncomment if needed)
    // if (item.photos) {
    //   item.photos = item.photos.map(photo => ({
    //     filepath: photo.filepath,
    //     webviewPath: photo.webviewPath || null,
    //   }));
    // }

    // Validate location (uncomment if needed)
    // if (item.location) {
    //   const { lat, lng } = item.location;
    //   if (typeof lat !== 'number' || typeof lng !== 'number') {
    //     throw new Error('Invalid location coordinates');
    //   }
    // }

    const releaseDate = item.releaseDate 
      ? new Date(item.releaseDate) 
      : null;

    // Verificăm dacă `releaseDate` este un obiect `Date` valid
    const newItem = {
      ...item,
      releaseDate: releaseDate instanceof Date && !isNaN(releaseDate) 
        ? releaseDate 
        : null,
    };

    const insertedItem = await itemStore.insert(newItem);
    console.log(insertedItem);

    response.body = insertedItem;
    response.status = 201;

    broadcast(userId, { type: 'created', payload: newItem });
  } catch (err) {
    response.body = { message: err.message };
    response.status = 400;
  }
};



itemRouter.post('/', async ctx => await createItem(ctx, ctx.request.body, ctx.response));

itemRouter.put('/:id', async ctx => {
  const item = ctx.request.body;
  const id = ctx.params.id;
  const itemId = item._id;
  const response = ctx.response;

  console.log(item);

  if (itemId && itemId !== id) {
    response.body = { message: 'Param id and body _id should be the same' };
    response.status = 400; // bad request
    return;
  }
  if (itemId && /^temp-id-\d+$/.test(itemId)) {
    delete item._id;    
    await createItem(ctx, item, response);
  } else {
    const userId = ctx.state.user._id;
    item.userId = userId;
    if (item.location) {  
      const { lat, lng } = item.location;
      if (typeof lat !== 'number' || typeof lng !== 'number') {
        response.body = { message: 'Invalid location coordinates' };
        response.status = 400;
        return;
      }
    }
    const updatedCount = await itemStore.update({ _id: id }, item);
    if (updatedCount === 1) {
      response.body = item;
      response.status = 200; // ok
      broadcast(userId, { type: 'updated', payload: item });
    } else {
      response.body = { message: 'Resource no longer exists' };
      response.status = 405; // method not allowed
    }
  }
});



itemRouter.del('/:id', async (ctx) => {
  const userId = ctx.state.user._id;
  const item = await itemStore.findOne({ _id: ctx.params.id });
  if (item && userId !== item.userId) {
    ctx.response.status = 403; // forbidden
  } else {
    await itemStore.remove({ _id: ctx.params.id });
    ctx.response.status = 204; // no content
  }
});
