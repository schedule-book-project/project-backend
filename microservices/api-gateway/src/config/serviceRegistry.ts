interface ServiceRegistry {
  [serviceName: string]: string;
}

// Default to localhost and specific ports from dev.env
// In a real environment, these would come from a config service or environment variables
export const serviceRegistry: ServiceRegistry = {
  userService: `http://localhost:5001/health`,
  businessService: `http://localhost:5002/health`,
  bookingService: `http://localhost:5003/health`,
  reviewService: `http://localhost:5004/health`,
  placesService: `http://localhost:5005/health`,
};

export default serviceRegistry;
