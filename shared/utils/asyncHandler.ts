import express from "express";

/**
 * Utility function to handle asynchronous route handlers.
 *
 * @param fn - The asynchronous function to wrap.
 * @returns A function that catches errors and forwards them to the next middleware.
 */
const asyncHandler = (fn: Function) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
