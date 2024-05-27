import { IDBS } from '../PackageSample.js'; // package

export default function IDBSuit() {
  const Schema = require('../db/Schema.js');
  const migrations = require.context('../db/migrations/', true, /\.js$/);

  return new IDBS(Schema, migrations.keys().map(key => migrations(key)));
}
