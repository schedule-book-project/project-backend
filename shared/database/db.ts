import mongoose from "mongoose";

/**
 * Establishes a connection to a MongoDB database.
 *
 * @param {string} mongoDbUri The URI of the MongoDB database to connect to.
 * @param {string} serviceName The name of the service that is connecting to the database.
 * @returns {Promise<void>}
 * @throws {Error} If the connection to the database cannot be established.
 */
const dbConnection = async (mongoDbUri: string, serviceName: string): Promise<void> => {
    try {
        await mongoose.connect(mongoDbUri);
        console.log(`✅ ${serviceName} Service DB Connected!`);
    } catch (error) {
        console.error("❌ Database Connection Error:", error);
        process.exit(1);
    }
};

export default dbConnection;