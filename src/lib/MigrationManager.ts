import MigrationClass from '../Migration';

export default class MigrationManager {
  private migrations: any[];

  constructor(migrations: any[]) {
    this.migrations = migrations;
  }

  isVersionExist(version: number): boolean {
    return MigrationClass.derivedClasses.some(([_, v]: [string, number]) => v === version);
  }

  nextVersion(currentVersion: number): number | null {
    const nextMigration = MigrationClass.derivedClasses
      .filter(([_, v]: [string, number]) => v > currentVersion)
      .sort((a, b) => a[1] - b[1])[0];
    return nextMigration ? nextMigration[1] : null;
  }

  prevVersion(currentVersion: number): number | null {
    const prevMigration = MigrationClass.derivedClasses
      .filter(([_, v]: [string, number]) => v < currentVersion)
      .sort((a, b) => b[1] - a[1])[0];
    return prevMigration ? prevMigration[1] : null;
  }

  async run(dbInstance: IDBDatabase): Promise<void> {
    const migrationVersion = dbInstance.version;

    const migrationsToRun = MigrationClass.derivedClasses
      .filter(([_, version]: [string, number]) => version <= migrationVersion)
      .sort((a, b) => a[1] - b[1]); // Sorting by version in ascending order

    for (const [migrationClassName, ] of migrationsToRun) {
      const matchingMigration = this.migrations.find(
        migration => migration.default.name === migrationClassName
      );

      if (matchingMigration) {
        const migrationInstance = new matchingMigration.default(dbInstance);
        await migrationInstance.migrate();
      }
    }
  }
}
