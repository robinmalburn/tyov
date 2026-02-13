export type MigrationData = Record<string, unknown> & {
  __SIGNATURE__?: number
}

export interface Migration<T extends MigrationData = MigrationData> {
  description: string
  requiredSignature?: number
  migrate: (data: T) => T
}

export type MigrationModule<T extends MigrationData = MigrationData> = {
  default: Migration<T>
}

export type MigrationLoader<T extends MigrationData = MigrationData> = (
  signature: number,
) => Promise<MigrationModule<T> | false | null | undefined>
