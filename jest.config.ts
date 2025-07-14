export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  testRegex: '.*\\.test\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
}
