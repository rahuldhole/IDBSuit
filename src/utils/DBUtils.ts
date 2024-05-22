export default class DBUtils {
  static checkDBExists(dbName: string): Promise<boolean> {
    return indexedDB.databases()
      .then((dbs: IDBDatabaseInfo[]) => {
        return dbs.some(db => db.name === dbName);
      })
      .catch(error => {
        console.error('Error checking database existence:', error);
        return false;
      });
  }

  static getDBVersion(dbName: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName);

      request.onerror = function (event) {
        console.error('Error opening database:', (event.target as IDBRequest).error);
        reject((event.target as IDBRequest).error);
      };

      request.onsuccess = function (event) {
        const version = (event.target as IDBRequest).result.version;
        (event.target as IDBRequest).result.close();
        resolve(version);
      };

      request.onblocked = function (event) {
        console.error('Database access blocked:', (event.target as IDBRequest).error);
        reject((event.target as IDBRequest).error);
      };
    });
  }
}
