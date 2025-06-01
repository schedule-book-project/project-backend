/**
 * @openapi
 * components:
 *   schemas:
 *     Coordinates:
 *       type: object
 *       properties:
 *         lat:
 *           type: number
 *           format: double
 *           example: 34.052235
 *         lng:
 *           type: number
 *           format: double
 *           example: -118.243683
 *     AddressComponent:
 *       type: object
 *       properties:
 *         long_name:
 *           type: string
 *         short_name:
 *           type: string
 *         types:
 *           type: array
 *           items:
 *             type: string
 *     PlaceSuggestion:
 *       type: object
 *       properties:
 *         description:
 *           type: string
 *           example: "123 Main Street, Anytown, USA"
 *         place_id:
 *           type: string
 *           example: "ChIJ..."
 *         types:
 *           type: array
 *           items:
 *             type: string
 *           example: ["geocode", "establishment"]
 *     PlaceDetails:
 *       type: object
 *       properties:
 *         place_id:
 *           type: string
 *           example: "ChIJ..."
 *         formatted_address:
 *           type: string
 *           example: "123 Main Street, Anytown, CA 12345, USA"
 *         geometry:
 *           type: object
 *           properties:
 *             location:
 *               $ref: '#/components/schemas/Coordinates'
 *         name:
 *           type: string
 *           example: "Googleplex"
 *         address_components:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AddressComponent'
 *         types:
 *           type: array
 *           items:
 *             type: string
 *         url:
 *           type: string
 *           format: url
 *         website:
 *           type: string
 *           format: url
 *           nullable: true
 *         opening_hours: # This can be complex, simplified here
 *           type: object
 *           properties:
 *             open_now:
 *               type: boolean
 *             weekday_text:
 *               type: array
 *               items:
 *                 type: string
 *           nullable: true
 *     NearbyPlaceResult: # Schema for results from HERE Discover (as per locations.service.ts)
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Local Cafe"
 *         lat:
 *           type: number
 *           example: 34.0522
 *         lng:
 *           type: number
 *           example: -118.2436
 *         type: # 'address' or 'place' based on current service logic
 *           type: string
 *           example: "place"
 *     LocationByIPResponse:
 *       type: object
 *       properties:
 *         lat:
 *           type: number
 *           example: 34.0522
 *         lng:
 *           type: number
 *           example: -118.2436
 *         city:
 *           type: string
 *           example: "Mountain View"
 *         country:
 *           type: string
 *           example: "US"
 *     CoordinatesFromAddressResponse:
 *       type: object
 *       properties:
 *         lat:
 *           type: number
 *           example: 34.052235
 *         lng:
 *           type: number
 *           example: -118.243683
 *         displayName:
 *           type: string
 *           example: "1 Infinite Loop, Cupertino, CA 95014, United States"
 */
export {}; // Ensure this is treated as a module if no other code exists
