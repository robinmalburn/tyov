class Migrator {
    migrations = [];

    async gatherMigrations(signature) {
        const migrations = [];
        const len = this.migrations.length;
        
        for (let i = 0; i < len; i++) {
            const cb = this.migrations[i];
            const module = await cb(signature);
            if (module) {
                migrations.push(module.default);
            }
        }

        return migrations;
    }

    async migrate(data, signature) {
        if (data.__SIGNATURE__ === signature) {
            return data;
        }

        const migrations = await this.gatherMigrations(data.__SIGNATURE__);

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

            console.info(`Running Migration: ${migration.description}`);
            data = migration.migrate(data);
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
    async (signature) => signature < 1 && import('Migrations/20210414-addSkillsIdMigration'),
    async (signature) => signature < 1 && import('Migrations/20210415-addMarkDescriptionIdMigration'),
    async (signature) => signature < 1 && import('Migrations/20210415-addResourcesIdMigration'),
    async (signature) => signature < 1 && import('Migrations/20210415-addCharactersIdMigration'),
    async (signature) => signature < 1 && import('Migrations/20210415-addMemoryIdEventDescriptionMigration'),
    async (signature) => signature < 1 && import('Migrations/20210416-addPromptIdMigration'),
    async (signature) => signature < 2 && import('Migrations/20210501-decoupleMemoryEventDiaryStates'),
);

export default migrator;