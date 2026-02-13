import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import migrator from 'Migrations'

const mockMigrationModule = vi.fn()

describe('migrations/index.js', () => {
  beforeEach(() => {
    migrator.migrations = []

    mockMigrationModule.mockResolvedValue({
      default: {
        description: 'Stub migration',
        requiredSignature: 1,
        migrate(data) {
          return {
            ...data,
            migrated: true,
          }
        },
      },
    })
  })

  afterEach(() => {
    vi.resetAllMocks()
    migrator.migrations = []
  })

  it('Can register a migration.', () => {
    migrator.register(mockMigrationModule)

    expect(migrator.migrations.length).toEqual(1)
    expect(migrator.migrations[0]).toEqual(mockMigrationModule)
  })

  it('Can unregister a migration.', () => {
    migrator.migrations.push(mockMigrationModule)
    migrator.migrations.push(mockMigrationModule)
    migrator.migrations.push(mockMigrationModule)

    migrator.unregister(mockMigrationModule)

    expect(migrator.migrations.length).toEqual(2)
  })

  it('Can gather migration entities.', async () => {
    migrator.migrations.push(mockMigrationModule)

    const migration = await migrator.gatherMigrations(1)
    expect(mockMigrationModule).toHaveBeenCalledWith(1)

    const expected = await mockMigrationModule()

    expect(migration[0]).toEqual(expected.default)
  })

  describe('Test suite for migrating data.', () => {
    it('Can migrate data where the signatures do not match.', async () => {
      migrator.migrations.push(mockMigrationModule)

      const data = {
        foo: 'bar',
        __SIGNATURE__: 1,
      }

      const migrated = await migrator.migrate(data, 2)

      expect(migrated).toEqual({ ...data, migrated: true })
      expect(mockMigrationModule).toHaveBeenCalledWith(data.__SIGNATURE__)
    })

    it('Can skip migration when signatures match.', async () => {
      migrator.migrations.push(mockMigrationModule)

      const data = {
        foo: 'bar',
        __SIGNATURE__: 1,
      }

      const migrated = await migrator.migrate(data, 1)

      expect(migrated).toEqual(data)
      expect(mockMigrationModule).not.toHaveBeenCalled()
    })

    it('Can sort migrations before migrating', async () => {
      const defaultMigration = {
        description: 'Stub migration',
        migrate(data) {
          return {
            ...data,
            migrated: true,
            requiredSignature: this.requiredSignature,
          }
        },
      }
      //A pair without a required signature.
      mockMigrationModule.mockResolvedValueOnce({
        default: {
          ...defaultMigration,
        },
      })
      mockMigrationModule.mockResolvedValueOnce({
        default: {
          ...defaultMigration,
        },
      })
      //A pair with matching required signatures.
      mockMigrationModule.mockResolvedValueOnce({
        default: {
          ...defaultMigration,
          requiredSignature: 7,
        },
      })
      mockMigrationModule.mockResolvedValueOnce({
        default: {
          ...defaultMigration,
          requiredSignature: 7,
        },
      })
      //A pair with only a B required signature.
      mockMigrationModule.mockResolvedValueOnce({
        default: {
          ...defaultMigration,
        },
      })
      mockMigrationModule.mockResolvedValueOnce({
        default: {
          ...defaultMigration,
          requiredSignature: 6,
        },
      })
      //A pair with only an A required signature.
      mockMigrationModule.mockResolvedValueOnce({
        default: {
          ...defaultMigration,
          requiredSignature: 5,
        },
      })
      mockMigrationModule.mockResolvedValueOnce({
        default: {
          ...defaultMigration,
        },
      })
      //A pair where A has a greater signature than B.
      mockMigrationModule.mockResolvedValueOnce({
        default: {
          ...defaultMigration,
          requiredSignature: 4,
        },
      })
      mockMigrationModule.mockResolvedValueOnce({
        default: {
          ...defaultMigration,
          requiredSignature: 3,
        },
      })
      //A pair where A has a lower signature than B.
      mockMigrationModule.mockResolvedValueOnce({
        default: {
          ...defaultMigration,
          requiredSignature: 2,
        },
      })
      mockMigrationModule.mockResolvedValueOnce({
        default: {
          ...defaultMigration,
          requiredSignature: 1,
        },
      })

      migrator.migrations.push(mockMigrationModule)
      migrator.migrations.push(mockMigrationModule)
      migrator.migrations.push(mockMigrationModule)
      migrator.migrations.push(mockMigrationModule)
      migrator.migrations.push(mockMigrationModule)
      migrator.migrations.push(mockMigrationModule)
      migrator.migrations.push(mockMigrationModule)
      migrator.migrations.push(mockMigrationModule)
      migrator.migrations.push(mockMigrationModule)
      migrator.migrations.push(mockMigrationModule)
      migrator.migrations.push(mockMigrationModule)
      migrator.migrations.push(mockMigrationModule)

      const data = {
        foo: 'bar',
        __SIGNATURE__: 0,
        requiredSignature: 7, // highest unique required signature
      }

      const migrated = await migrator.migrate(data, 10)

      expect(migrated).toEqual({ ...data, migrated: true })
      expect(mockMigrationModule).toHaveBeenCalledTimes(12)
    })
  })
})
