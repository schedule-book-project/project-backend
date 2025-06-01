import express from 'express';
import * as locationsController from '../controllers/locations.controller';
import { authenticate } from '@shared/middlewares/auth.middleware';
import { locationValidation } from '@shared/validations/validationSchemas';
import asyncHandler from '@shared/utils/asyncHandler';

const router = express.Router();

/**
 * @openapi
 * /api/places/nearby:
 *   get:
 *     tags:
 *       - Places
 *     summary: Search for nearby places based on coordinates and a query
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: query
 *         in: query
 *         required: true
 *         description: Search term (e.g., "cafe", "restaurant")
 *         schema:
 *           type: string
 *       - name: lat
 *         in: query
 *         required: true
 *         description: Latitude for the search center
 *         schema:
 *           type: number
 *           format: double
 *       - name: lng
 *         in: query
 *         required: true
 *         description: Longitude for the search center
 *         schema:
 *           type: number
 *           format: double
 *       - name: language
 *         in: query
 *         required: false
 *         description: Preferred language for results (e.g., "en", "es")
 *         schema:
 *           type: string
 *           default: "en"
 *     responses:
 *       200:
 *         description: A list of nearby places
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 places:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/NearbyPlaceResult' # Defined in google.model.ts (conceptual)
 *       400:
 *         $ref: '#/components/responses/BadRequestError' # For missing required query params
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ErrorResponse'
 */
router.get('/nearby', authenticate, locationsController.getNearbyPlaces);

/**
 * @openapi
 * /api/places/ip:
 *   get:
 *     tags:
 *       - Places
 *     summary: Search places near the client_s IP address
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: query
 *         in: query
 *         required: true
 *         description: Search term (e.g., "park", "atm")
 *         schema:
 *           type: string
 *       # IP address is usually inferred by the server
 *     responses:
 *       200:
 *         description: A list of places near the client_s IP and their location
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 location:
 *                   $ref: '#/components/schemas/LocationByIPResponse' # Defined in google.model.ts
 *                 places:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/NearbyPlaceResult'
 *       400:
 *         $ref: '#/components/responses/BadRequestError' # For missing query or if IP cannot be determined
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ErrorResponse'
 */
router.get('/ip', authenticate, locationsController.getPlacesByIP);

/**
 * @openapi
 * /api/places/address:
 *   post:
 *     tags:
 *       - Places
 *     summary: Search places near a specified address
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - street
 *               - city
 *               - country
 *               - query
 *             properties:
 *               street:
 *                 type: string
 *                 example: "1600 Amphitheatre Parkway"
 *               city:
 *                 type: string
 *                 example: "Mountain View"
 *               state: # Optional, but good for precision
 *                 type: string
 *                 example: "CA"
 *               country:
 *                 type: string
 *                 example: "USA"
 *               postalCode:
 *                 type: string
 *                 nullable: true
 *                 example: "94043"
 *               query:
 *                 type: string
 *                 description: Search term (e.g., "coffee shop")
 *                 example: "pizza"
 *               language:
 *                 type: string
 *                 nullable: true
 *                 default: "en"
 *     responses:
 *       200:
 *         description: A list of places near the specified address
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 location: # This is displayName from CoordinatesFromAddressResponse
 *                   type: string
 *                   example: "1600 Amphitheatre Parkway, Mountain View, CA 94043, USA"
 *                 coordinates:
 *                   $ref: '#/components/schemas/Coordinates'
 *                 results: # This is 'places' in the controller
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/NearbyPlaceResult'
 *       400:
 *         $ref: '#/components/responses/BadRequestError' # For missing address fields or invalid address
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ErrorResponse'
 */
router.post(
  '/address',
  authenticate,
  locationValidation,
  asyncHandler(locationsController.getPlacesByAddress),
);

export default router;
