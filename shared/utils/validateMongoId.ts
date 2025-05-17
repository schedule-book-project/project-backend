import { Types } from 'mongoose';
import { ApiErrorModel } from '../models/error.model';

/**
 * Validates a MongoDB ObjectId.
 *
 * @param id - The ID to validate.
 * @param entityName - The name of the entity for error messages.
 * @throws ApiErrorModel if the ID is invalid.
 */
export const validateMongoId = (id: string, entityName: string): void => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiErrorModel(400, `Invalid ${entityName} ID`);
  }
};
