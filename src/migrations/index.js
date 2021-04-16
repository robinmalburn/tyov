import { SIGNATURE } from 'Libs/gameState';

class Migrator {
    migrations = [];

    migrate(data) {
        if (data.__SIGNATURE__ === SIGNATURE) {
            return data;
        }

        const migrations = [];

        this.migrations.forEach(async cb => {
            const module = await cb()
            migrations.push(module.default);
        });

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
            if (!migration.requiredSignature) {
                console.warn(`Skipping migration with missing signature.  Description: ${migration.description}`)
                return;
            }

            if (!data.__SIGNATURE__ || data.__SIGNATURE__ < migration.requiredSignature) {
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
    async () => import('Migrations/20210414-addSkillsIdMigration'),
    async () => import('Migrations/20210415-addMarkDescriptionIdMigration'),
    async () => import('Migrations/20210415-addResourcesIdMigration'),
    async () => import('Migrations/20210415-addCharactersIdMigration'),
    async () => import('Migrations/20210415-addMemoryIdEventDescriptionMigration'),
    async () => import('Migrations/20210416-addPromptIdMigration'),
);

export default migrator;