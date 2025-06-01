import dotenv from 'dotenv';
import path from 'path';

const envFiles: { [key: string]: string } = {
  dev: path.resolve('./resources/config/dev.env'),
  prod: path.resolve('./resources/config/prod.env'),
  staging: path.resolve('./resources/config/staging.env'),
};

export const setEnvironment = (setEnv: keyof typeof envFiles = 'dev'): void => {
  const env = process.env.ENV ?? setEnv;
  const envFile: string = envFiles[env];
  if (!envFile) {
    throw new Error(`Unknown environment: ${env}`);
  }
  dotenv.config({ path: envFile });
};

setEnvironment();

export const config: { [key: string]: string | undefined } = {
  ...process.env,
  ENV: process.env.ENV ?? 'dev',
  // We can add more environment variables here
};
