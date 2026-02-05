import { Request, Response, NextFunction } from 'express';
import {
  getAllExamples,
  getExampleById,
  createExample,
  updateExample,
  deleteExample,
} from './services';
import { sendSuccess, sendCreated } from '../../utils/response';

/**
 * Get all examples controller
 *
 * @param _req - Express request object (unused)
 * @param res - Express response object
 * @param _next - Express next function (unused)
 */
export const getAllExamplesController = (
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const examples = getAllExamples();
  sendSuccess(res, examples);
};

/**
 * Get a single example by ID controller
 *
 * @param req - Express request object containing params.id
 * @param res - Express response object
 * @param _next - Express next function (unused)
 */
export const getExampleByIdController = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const id = Number(req.params.id);
  const example = getExampleById(id);
  sendSuccess(res, example);
};

/**
 * Create a new example controller
 *
 * @param req - Express request object containing example data in body
 * @param res - Express response object
 * @param _next - Express next function (unused)
 */
export const createExampleController = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const example = createExample(req.body);
  sendCreated(res, example, 'Example created successfully');
};

/**
 * Update an existing example controller
 *
 * @param req - Express request object containing params.id and update data in body
 * @param res - Express response object
 * @param _next - Express next function (unused)
 */
export const updateExampleController = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const id = Number(req.params.id);
  const example = updateExample(id, req.body);
  sendSuccess(res, example);
};

/**
 * Delete an example controller
 *
 * @param req - Express request object containing params.id
 * @param res - Express response object
 * @param _next - Express next function (unused)
 */
export const deleteExampleController = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const id = Number(req.params.id);
  deleteExample(id);
  sendSuccess(res, undefined, 'Example deleted successfully');
};
