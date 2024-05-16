# IDBSuit
IndexedDB Suit for handling migrations automatically and provide ORM.

Sample react project: https://github.com/rahuldhole/slick-pick

In your config directory create `IDBSuit.js` and update path to your `./migrations` folder and `Schema.js`

Note: In IndexedDB all migrations are irreversible. If you need to reverse an immigration you may need to create another migration file

```
// IDBSuit.js
import { IDBS } from 'idbsuit'; // package

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

## Migration

Make sure to always use increamental version number.
Recommended to use current timestamp integer `new Date().getTime()` as version number.
Similarly, you may prefix your migration file with version although it is not neccessary but it may help in visibility.

```
import { Migration } from "idbsuit";
export default class ExampleOne extends Migration{
  static #_= this.newVersion(1714815400413); // update version number
  
  async migrate() {
    return new Promise((resolve, reject) => {
      
      // Implement your migration logic here
      
      resolve();
    });
  }
}

```
