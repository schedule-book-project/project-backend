import mongoose from 'mongoose';
import { config as envConfig } from '@shared/config/environment.handler'; // To get DB URI
import logger from '@shared/logger/logger'; // For logging

export const connectTestDB = async (): Promise<void> => {
  const mongoUri = envConfig.USER_MONGO_DB_TEST_URI;

  if (!mongoUri) {
    throw new Error('USER_MONGO_DB_TEST_URI is not defined in environment variables for testing.');
  }

  try {
    await mongoose.connect(mongoUri);
    logger.info(`🚀 Test DB Connected to ${mongoUri} for User service tests`);
  } catch (error) {
    logger.error('❌ Test DB Connection Error:', { error });
    // Propagate the error to fail tests if DB connection fails
    throw error;
  }
};

export const disconnectTestDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('🔌 Test DB Disconnected for User service tests');
  } catch (error) {
    logger.error('❌ Test DB Disconnection Error:', { error });
    throw error;
  }
};

export const clearTestDB = async (): Promise<void> => {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      if (Object.prototype.hasOwnProperty.call(collections, key)) {
        const collection = collections[key];
        await collection.deleteMany({});
      }
    }
    // More targeted approach if you only want to clear specific collections:
    // if (mongoose.connection.collection('users')) {
    //   await mongoose.connection.collection('users').deleteMany({});
    // }
    logger.info('🧹 Test DB Cleared for User service tests');
  } catch (error) {
    logger.error('❌ Test DB Clearing Error:', { error });
    throw error;
  }
};
