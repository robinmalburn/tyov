import addSkillsIdMigration from 'Migrations/20210414-addSkillsIdMigration';
import addMarkDescriptionIdMigration from 'Migrations/20210415-addMarkDescriptionIdMigration';
import addResourcesIdMigration from 'Migrations/20210415-addResourcesIdMigration';
import addCharactersIdMigration from 'Migrations/20210415-addCharactersIdMigration';
import addMemoryIdEventDescriptionMigration from 'Migrations/20210415-addMemoryIdEventDescriptionMigration';

class Migrator {
    migrations = [];

    migrate(data) {
        const migrations = [...this.migrations];
        migrations.sort((a, b) => {
            // If neither has a required signature, leave their position unchanged.
            if (!a.requiredSignature && !b.requiredSignature) {
                return 0;
            }

            // If A has no required signature or has a later required signature, move A higher in order than B.
            if (
                (!a.requiredSignature && b.requiredSignature)
                 || (a.requiredSignature && b.requiredSignature && a.requiredSignature > b.requiredSignature)
             ) {
                return 1;
            }

            // If B has no required signature or A has an earlier required signature, move A lower in order than B.
            if (
                (a.requiredSignature && !b.requiredSignature)
                || (a.requiredSignature && b.requiredSignature && a.requiredSignature < b.requiredSignature)
             ) {
                    return -1
                }

            // Leave anything else in place.
            return 0;
        });

        migrations.forEach(migration => {
            if (!migration.requiredSignature || !data.__SIGNATURE__ || data.__SIGNATURE__ < migration.requiredSignature) {
                console.info(`Running Migration: ${migration.description}`);
                data = migration.migrate(data);
            }
        });


        return data;
    }

    register(...migrations){
        migrations.forEach(migration => {
            this.migrations.push(migration);
        })
    }

    unregister(...migrations){
        migrations.forEach(migration => {
            const idx = this.migrations.indexOf(migration);
            this.migrations.splice(idx, 1);
        });
    }
}

const migrator = new Migrator();

migrator.register(
    addSkillsIdMigration,
    addMarkDescriptionIdMigration,
    addResourcesIdMigration,
    addCharactersIdMigration,
    addMemoryIdEventDescriptionMigration,
);

export default migrator;