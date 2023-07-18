import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  testMatch: ['**/?(*.)+(spec|test).ts']
};

export default config;
