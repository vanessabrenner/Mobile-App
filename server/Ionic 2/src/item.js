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
    if (!item.title || !item.author || !item.pages) { // validation
      throw new Error('Missing properties')
    }
    return this.store.insert(item);
  };

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
  ctx.response.body = await itemStore.find({ userId });
  ctx.response.status = 200; // ok
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
    const userId = ctx.state.user._id;
    item.userId = userId;

    const newItem = {
      ...item,
      releaseDate: new Date(item.releaseDate)
    };

    const item1 = await itemStore.insert(newItem);
    const item2 = await itemStore.findOne({ _id: newItem._id });
    console.log(item1);

    response.body = item1;
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
  if (itemId && /^temp-id-\d+$/.test(itemId)) { // dac aavut un _id temporar
    delete item._id;
    await createItem(ctx, item, response);
  } else {
    const userId = ctx.state.user._id;
    item.userId = userId;
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
