import addSkillsId from 'Migrations/addSkillsId';

class Migrator {
    migrations = [];

    migrate(data) {
        this.migrations.forEach(migration => {
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

migrator.register(addSkillsId);

export default migrator;