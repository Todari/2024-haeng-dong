import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  setupFiles: ['<rootDir>/jest.polyfills.ts'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '\\.(svg|png|webp)$': 'jest-transform-stub',
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@apis/(.*)$': '<rootDir>/src/apis/$1',
    '^@assets/(.*)$': '<rootDir>/src/assets/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@constants/(.*)$': '<rootDir>/src/constants/$1',
    '^@store/(.*)$': '<rootDir>/src/store/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@mocks/(.*)$': '<rootDir>/src/mocks/$1',
    '^@pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@errors/(.*)$': '<rootDir>/src/errors/$1',
    '^@HDesign/(.*)$': '<rootDir>/src/components/Design/$1',
    '^@HDcomponents/(.*)$': '<rootDir>/src/components/Design/components/$1',
    '^@token/(.*)$': '<rootDir>/src/components/Design/token/$1',
    '^@theme/(.*)$': '<rootDir>/src/components/Design/theme/$1',
    '^@layouts/(.*)$': '<rootDir>/src/components/Design/layouts/$1',
    '^@type/(.*)$': '<rootDir>/src/components/Design/type/$1',
    '^@HDutils/(.*)$': '<rootDir>/src/components/Design/utils/$1',
    '^@haeng-dong/shared$': '<rootDir>/../../packages/shared/src/index.ts',
    '^types/(.*)$': '<rootDir>/src/types/$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: '<rootDir>/tsconfig.json',
    }],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!@haeng-dong)',
  ],
};

export default config;
