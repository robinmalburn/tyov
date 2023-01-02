module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  moduleNameMapper: {
            '^Migrations': '<rootDir>/src/migrations/index.js',
            '^Migrations/(.*)$': '<rootDir>/src/migrations/$1',
            '^Libs/(.*)$': '<rootDir>/src/lib/$1',
            '^Stores/(.*)$': '<rootDir>/src/store/$1',
            '^Components/(.*)$': '<rootDir>/src/components/$1',
  },
  modulePaths: ["<rootDir>/src"]
}
