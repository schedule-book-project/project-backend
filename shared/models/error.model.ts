/**
 * Interface representing the structure of an API error response.
 * This is used to standardize error responses sent to the client.
 */
export interface ApiError {
  statusCode: number; // HTTP status code
  message: string; // Error message for the client
  details?: unknown; // Optional field for additional error details
}

/**
 * Class representing an error model for handling and formatting errors in a REST API.
 * This class provides a standardized way to create and return error responses.
 *
 * @example - Creating an error manually
 * const error = new ErrorModel(404, 'Resource not found');
 * console.log(error.toResponse());
 *
 * @example - Creating an error from an existing Error object
 * const error = new Error('Something went wrong');
 * const apiError = ErrorModel.fromError(error, 500);
 * console.log(apiError.toResponse());
 */
export class ApiErrorModel {
  /**
   * HTTP status code of the error.
   */
  public statusCode: number;

  /**
   * Error message to be sent to the client.
   */
  public message: string;

  /**
   * Optional additional details about the error.
   */
  public details?: unknown;

  /**
   * Constructs an instance of ErrorModel.
   *
   * @param statusCode - HTTP status code of the error.
   * @param message - Error message to be sent to the client.
   * @param details - Optional additional details about the error.
   */
  constructor(statusCode: number, message: string, details?: unknown) {
    this.statusCode = statusCode;
    this.message = message;
    this.details = details;
  }

  /**
   * Creates an ErrorModel instance from a standard Error object.
   *
   * @param error - The original Error object.
   * @param statusCode - HTTP status code of the error (default is 500).
   * @returns An instance of ErrorModel.
   */
  public static fromError(
    error: Error,
    statusCode: number = 500,
  ): ApiErrorModel {
    return new ApiErrorModel(statusCode, error.message);
  }

  /**
   * Converts the ErrorModel instance to an ApiError object for response.
   *
   * @returns An ApiError object containing the error details.
   */
  public toResponse(): ApiError {
    return {
      statusCode: this.statusCode,
      message: this.message,
      details: this.details,
    };
  }
}
