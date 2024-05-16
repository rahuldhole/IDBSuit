# IDBSuit
IndexedDB Suit for handling migrations automatically and provide ORM.

In your config directory create `IDBSuit.js` and update path to your `./migrations` folder and `Schema.js`

Note: In IndexedDB all migrations are irreversible. If you need to reverse an immigration you may need to create another migration file

```
// IDBSuit.js
import IDBS from 'idbsuit'; // package

// Change your Schema.js path
import { Schema } from './Schema';

// change your migrations/ folder path
const reqMigrations = require.context('./migrations', true, /\.js$/);

const migrationModules = reqMigrations.keys().map(key => reqMigrations(key));

export default function IDBSuit() {
  const idbs = new IDBS(Schema, migrationModules);
  
  return idbs;
}
```

Create IDBSute object.
```
const idbs = IDBSuit();
```

Open connection to your db
```
  idbs.openDatabase()
    .then(dbInstance => {
      setDbVersion(dbInstance.version);
    })
    .catch(error => {
      console.error('Error opening database:', error);
    });
```

Destroy db

```
  idbs.destroy()
    .then(() => {
     console.log('Database deleted successfully');
    })
    .catch(error => {
      console.error('Error deleting database:', error);
    });
```
