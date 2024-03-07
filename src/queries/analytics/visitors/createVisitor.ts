import { Prisma } from '@prisma/client';
import cache from 'lib/cache';
import prisma from 'lib/prisma';

export async function createVisitor(data: Prisma.VisitorCreateInput) {
  const {
    id,
    websiteId,
    hostname,
    browser,
    os,
    device,
    screen,
    language,
    country,
    subdivision1,
    subdivision2,
    city,
  } = data;

  return prisma.client.visitor
    .create({
      data: {
        id,
        websiteId,
        hostname,
        browser,
        os,
        device,
        screen,
        language,
        country,
        subdivision1,
        subdivision2,
        city,
      },
    })
    .then(async data => {
      if (cache.enabled) {
        await cache.storeVisitor(data);
      }

      return data;
    });
}
