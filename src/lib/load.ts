import cache from 'lib/cache';
import { getVisitor, getUser, getWebsite } from 'queries';
import { User, Website, Visitor } from '@prisma/client';

export async function loadWebsite(websiteId: string): Promise<Website> {
  let website;

  if (cache.enabled) {
    website = await cache.fetchWebsite(websiteId);
  } else {
    website = await getWebsite(websiteId);
  }

  if (!website || website.deletedAt) {
    return null;
  }

  return website;
}

export async function loadVisitor(visitorId: string): Promise<Visitor> {
  let visitor;

  if (cache.enabled) {
    visitor = await cache.fetchVisitor(visitorId);
  } else {
    visitor = await getVisitor(visitorId);
  }

  if (!visitor) {
    return null;
  }

  return visitor;
}

export async function loadUser(userId: string): Promise<User> {
  let user;

  if (cache.enabled) {
    user = await cache.fetchUser(userId);
  } else {
    user = await getUser(userId);
  }

  if (!user || user.deletedAt) {
    return null;
  }

  return user;
}
