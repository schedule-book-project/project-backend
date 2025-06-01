export const services = {
  admin: `http://localhost:${process.env.GATEWAY_PORT ?? 5000}/api/admin`,
  business: `http://localhost:${process.env.BUSINESS_PORT ?? 5002}/api/business`,
  booking: `http://localhost:${process.env.BOOKING_PORT ?? 5003}/api/booking`,
  review: `http://localhost:${process.env.REVIEW_PORT ?? 5004}/api/review`,
  places: `http://localhost:${process.env.PLACES_PORT ?? 5005}/api/places`,
};
