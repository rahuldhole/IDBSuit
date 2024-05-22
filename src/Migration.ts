export default class Migration {
  static derivedClasses: Array<[string, number]> = [];

  protected dbInstance: IDBDatabase;

  constructor(dbInstance: IDBDatabase) {
    this.dbInstance = dbInstance;
  }

  static newVersion(version: number): void {
    this.derivedClasses.push([this.name, version]); // record class name and version
  }
}
