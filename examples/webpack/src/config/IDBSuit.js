import { IDBS } from '../PackageSample.js'; // package

// Change your Schema.js path
import { Schema } from '../db/Schema.js';

// change your migrations/ folder path
const reqMigrations = require.context('../db/migrations/', true, /\.js$/);

const migrationModules = reqMigrations.keys().map(key => reqMigrations(key));

export default function IDBSuit() {
  const idbs = new IDBS(Schema, migrationModules);
  
  return idbs;
}
