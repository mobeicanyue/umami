import { User, Website } from '@prisma/client';
import redis from '@umami/redis-client';
import { getVisitor, getUser, getWebsite } from '../queries';

async function fetchWebsite(websiteId: string): Promise<Website> {
  return redis.client.getCache(`website:${websiteId}`, () => getWebsite(websiteId), 86400);
}

async function storeWebsite(data: { id: any }) {
  const { id } = data;
  const key = `website:${id}`;

  const obj = await redis.client.setCache(key, data);
  await redis.client.expire(key, 86400);

  return obj;
}

async function deleteWebsite(id) {
  return redis.client.deleteCache(`website:${id}`);
}

async function fetchUser(id): Promise<User> {
  return redis.client.getCache(`user:${id}`, () => getUser(id, { includePassword: true }), 86400);
}

async function storeUser(data) {
  const { id } = data;
  const key = `user:${id}`;

  const obj = await redis.client.setCache(key, data);
  await redis.client.expire(key, 86400);

  return obj;
}

async function deleteUser(id) {
  return redis.client.deleteCache(`user:${id}`);
}

async function fetchVisitor(id) {
  return redis.client.getCache(`visitor:${id}`, () => getVisitor(id), 86400);
}

async function storeVisitor(data) {
  const { id } = data;
  const key = `visitor:${id}`;

  const obj = await redis.client.setCache(key, data);
  await redis.client.expire(key, 86400);

  return obj;
}

async function deleteVisitor(id) {
  return redis.client.deleteCache(`visitor:${id}`);
}

async function fetchUserBlock(userId: string) {
  const key = `user:block:${userId}`;
  return redis.client.get(key);
}

async function incrementUserBlock(userId: string) {
  const key = `user:block:${userId}`;
  return redis.client.incr(key);
}

export default {
  fetchWebsite,
  storeWebsite,
  deleteWebsite,
  fetchUser,
  storeUser,
  deleteUser,
  fetchVisitor,
  storeVisitor,
  deleteVisitor,
  fetchUserBlock,
  incrementUserBlock,
  enabled: !!redis.enabled,
};
