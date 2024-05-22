import DBUtils from './utils/DBUtils';
import MigrationManager from './lib/MigrationManager';

interface Schema {
  dbName: string;
  version: number;
  tables: Array<{
    name: string;
    columns: Array<{
      name: string;
      isIndexed?: boolean;
    }>;
  }>;
}

export default class IDBS {
  private schema: Schema;
  private migrationManager: MigrationManager;

  constructor(schema: Schema, migrations: any) {
    this.schema = schema;
    this.migrationManager = new MigrationManager(migrations);
  }

  async getCurrentVersion(): Promise<number> {
    const version = await DBUtils.getDBVersion(this.schema.dbName);
    if (version !== null) {
      return version;
    } else {
      return this.schema.version;
    }
  }

  async openDatabase(newVersion: number | null = null): Promise<IDBDatabase> {
    const dbExists = await DBUtils.checkDBExists(this.schema.dbName);
    const currentVersion = await this.getCurrentVersion();

    if (newVersion === null) {
      newVersion = currentVersion;
    }

    const nextVersion = this.migrationManager.nextVersion(newVersion);
    if (nextVersion !== null && currentVersion < nextVersion && nextVersion <= this.schema.version) {
      return this.openDatabase(nextVersion);
    }

    return new Promise((resolve, reject) => {
      let request: IDBOpenDBRequest;

      const openRequest = () => {
        request = indexedDB.open(this.schema.dbName, this.schema.version);

        request.onerror = (event) => {
          console.error("indexedDB is not supported", (event.target as IDBRequest).error);
          reject((event.target as IDBRequest).error);
        };

        request.onsuccess = (event) => {
          const dbInstance = (event.target as IDBRequest).result;
          resolve(dbInstance);
        };

        request.onupgradeneeded = async (event) => {
          const dbInstance = (event.target as IDBRequest).result;

          if (dbExists) {
            await this.migrationManager.run(dbInstance);
          } else {
            this.createTables(dbInstance);
          }

          resolve(dbInstance);
        };
      };

      openRequest();
    });
  }

  private createTables(dbInstance: IDBDatabase): void {
    this.schema.tables.forEach(table => {
      const tableName = table.name;
      const objectStore = dbInstance.createObjectStore(tableName, { keyPath: 'id', autoIncrement: true });

      table.columns.forEach(column => {
        objectStore.createIndex(column.name, column.name, { unique: !!column.isIndexed });
      });
    });
  }

  destroy(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(this.schema.dbName);

      request.onerror = (event) => {
        console.error("Error deleting database:", (event.target as IDBRequest).error);
        reject((event.target as IDBRequest).error);
      };

      request.onsuccess = () => {
        resolve();
      };
    });
  }
}
