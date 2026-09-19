import 'dotenv/config';

import { db } from '../db/index';
import { cuisines } from './schema';

const CUISINE_SEED = [
  'Burgers',
  'American',
  'Italian',
  'Pizza',
  'Asian',
  'Japanese & Sushi',
  'Mexican & Tacos',
  'Healthy & Bowls',
  'Desserts & Bakery',
  'BBQ & Smokehouse',
];

async function seed() {
  await db
    .insert(cuisines)
    .values(CUISINE_SEED.map((name) => ({ name })))
    .onConflictDoNothing();

  console.log('Cuisines seeded');
}

seed();
