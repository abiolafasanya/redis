const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { createClient } = require('redis');

const app = express();
const client = createClient();
const config = { port: 4000 };
const REDIS_EXP = 120;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

client.on('connect', (res) => console.log('Redis Client Connected', res));
client.on('error', (err) => console.log('Redis Client Error', err));

app.get('/api/posts', async (req, res) => {
  await client.connect();
  const userId = req.query.userId;
  const endpiont = `https://jsonplaceholder.typicode.com/posts`;
  const posts = await getOrSetCached(
    `posts?userId=${userId}`,
    async () => {
      const { data } = await axios.get(endpiont, { params: { userId } });
      return data;
    },
    REDIS_EXP
  );
  res.status(axios.HttpStatusCode.Ok).json(posts);
  await client.disconnect();
  return;
});

app.get('/api/images/:id', async (req, res) => {
  const endpiont =
    'https://jsonplaceholder.typicode.com/posts/' + req.params.id;
  const post = await getOrSetCached(
    `posts?userId=${req.params.user}`,
    async (req, res) => {
      const { data } = await axios.get(endpiont);
      return data;
    },
    REDIS_EXP
  );
  res
    .status(axios.HttpStatusCode.Ok)
    .json({ message: `post ${req.params.id}`, post });
  await client.disconnect();
  return;
});

app.listen(config.port, () => console.log('listening on port ' + config.port));

async function getOrSetCached(key, cb, expiresIn) {
  const cached = await client.get(key);
  if (cached != null) return JSON.parse(cached);
  if (cached == null) {
    const data = await cb();
    await client.SETEX(key, expiresIn, JSON.stringify(data));
    return await data;
  }
}
