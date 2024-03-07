import { isUuid, secret, uuid } from 'lib/crypto';
import { getClientInfo } from 'lib/detect';
import { parseToken } from 'next-basics';
import { NextApiRequestCollect } from 'pages/api/send';
import { createVisitor } from 'queries';
import cache from './cache';
import clickhouse from './clickhouse';
import { loadVisitor, loadWebsite } from './load';

export async function findVisitor(req: NextApiRequestCollect): Promise<{
  id: any;
  websiteId: string;
  hostname: string;
  browser: string;
  os: any;
  device: string;
  screen: string;
  language: string;
  country: any;
  subdivision1: any;
  subdivision2: any;
  city: any;
  ownerId: string;
}> {
  const { payload } = req.body;

  if (!payload) {
    throw new Error('Invalid payload.');
  }

  // Check if cache token is passed
  const cacheToken = req.headers['x-umami-cache'];

  if (cacheToken) {
    const result = await parseToken(cacheToken, secret());

    if (result) {
      await checkUserBlock(result?.ownerId);

      return result;
    }
  }

  // Verify payload
  const { website: websiteId, hostname, screen, language } = payload;

  // Check the hostname value for legality to eliminate dirty data
  const validHostnameRegex = /^[\w-.]+$/;
  if (!validHostnameRegex.test(hostname)) {
    throw new Error('Invalid hostname.');
  }

  if (!isUuid(websiteId)) {
    throw new Error('Invalid website ID.');
  }

  // Find website
  const website = await loadWebsite(websiteId);

  if (!website) {
    throw new Error(`Website not found: ${websiteId}.`);
  }

  await checkUserBlock(website.userId);

  const { userAgent, browser, os, ip, country, subdivision1, subdivision2, city, device } =
    await getClientInfo(req, payload);

  const visitorId = uuid(websiteId, hostname, ip, userAgent);

  // Clickhouse does not require visitor lookup
  if (clickhouse.enabled) {
    return {
      id: visitorId,
      websiteId,
      hostname,
      browser,
      os: os as any,
      device,
      screen,
      language,
      country,
      subdivision1,
      subdivision2,
      city,
      ownerId: website.userId,
    };
  }

  // Find visitor
  let visitor = await loadVisitor(visitorId);

  // Create a visitor if not found
  if (!visitor) {
    try {
      visitor = await createVisitor({
        id: visitorId,
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
      });
    } catch (e: any) {
      if (!e.message.toLowerCase().includes('unique constraint')) {
        throw e;
      }
    }
  }

  return { ...visitor, ownerId: website.userId };
}

async function checkUserBlock(userId: string) {
  if (process.env.ENABLE_BLOCKER && (await cache.fetchUserBlock(userId))) {
    await cache.incrementUserBlock(userId);

    throw new Error('Usage Limit.');
  }
}
