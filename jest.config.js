module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  moduleNameMapper: {
            '^Components/(.*)$': '<rootDir>/src/component/$1',
            '^Stores/(.*)$': '<rootDir>/src/store/$1',
            '^Libs/(.*)$': '<rootDir>/src/lib/$1',
  },
}
