import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createUsers1599829507869 implements MigrationInterface {
    private table = new Table({
        name: 'users',
        columns: [
            {
                name: 'id',
                type: 'integer',
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'uuid',
            },
            {
                name: 'email',
                type: 'varchar',
                isUnique: true,
                isNullable: false,
            },
            {
                name: 'created_at',
                type: 'timestamptz',
                isNullable: false,
                default: 'now()',
            },
            {
                name: 'updated_at',
                type: 'timestamptz',
                isNullable: false,
                default: 'now()',
            },
        ]
    })
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(this.table);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.table);
    }

}
