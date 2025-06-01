import { check } from 'express-validator';

export const userValidation = [
  check('email', 'Valid email is required').isEmail(),
  check('password', 'Password must be at least 8 characters').isLength({
    min: 8,
  }),
  check(
    'password',
    'Password must contain at least one uppercase letter',
  ).matches(/[A-Z]/),
  check(
    'password',
    'Password must contain at least one lowercase letter',
  ).matches(/[a-z]/),
  check('password', 'Password must contain at least one number').matches(/\d/),
  check(
    'password',
    'Password must contain at least one special character',
  ).matches(/[\W_]/),
];

export const createBookingValidation = [
  check('customer', 'Customer ID is required').notEmpty(),
  check('business', 'Business ID is required').notEmpty(),
  check('service.name', 'Service name is required').notEmpty(),
  check('service.price', 'Service price must be a number').isNumeric(),
  check('service.duration', 'Service duration must be a number').isNumeric(),
  check('date', 'Valid date is required').isISO8601(),
];

export const updateBookingValidation = [
  check('customer', 'Customer ID must be valid').optional().notEmpty(),
  check('business', 'Business ID must be valid').optional().notEmpty(),
  check('service.name', 'Service name must be valid').optional().notEmpty(),
  check('service.price', 'Service price must be a number')
    .optional()
    .isNumeric(),
  check('service.duration', 'Service duration must be a number')
    .optional()
    .isNumeric(),
  check('date', 'Valid date must be provided').optional().isISO8601(),
];

export const businessValidation = [
  check('name', 'Business name is required').notEmpty(),
  check('address', 'Business address is required').notEmpty(),
  check('phone', 'Valid phone number is required').isMobilePhone('any'),
];

export const loginValidation = [
  check('email', 'Valid email is required').isEmail(),
  check('password', 'Password is required').exists(),
];

export const reviewValidation = [
  check('rating', 'Rating is required and must be a number').isNumeric(),
  check('comment', 'Comment must be a string').optional().isString(),
];

export const locationValidation = [
  check('latitude', 'Latitude is required and must be a number').isNumeric(),
  check('longitude', 'Longitude is required and must be a number').isNumeric(),
];
