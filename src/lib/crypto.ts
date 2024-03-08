import { getHours, startOfHour, startOfMonth, subHours } from 'date-fns';
import { hash } from 'next-basics';
import { v4, v5, validate } from 'uuid';

export function secret() {
  return hash(process.env.APP_SECRET || process.env.DATABASE_URL);
}

export function salt() {
  const ROTATING_SALT = hash(startOfMonth(new Date()).toUTCString());

  return hash(secret(), ROTATING_SALT);
}

export function sessionSalt() {
  // rotate every 2 hours
  const hour = getHours(new Date());
  const date = hour % 2 === 0 ? new Date() : subHours(new Date(), 1);
  const ROTATING_SALT = hash(startOfHour(date).toUTCString());

  return hash(secret(), ROTATING_SALT);
}

export function uuid(...args: any) {
  if (!args.length) return v4();

  return v5(hash(...args, salt()), v5.DNS);
}

export function isUuid(value: string) {
  return validate(value);
}
