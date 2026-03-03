import { Request, Response, NextFunction } from 'express';
import {
  getAllExamples,
  getExampleById,
  createExample,
  updateExample,
  deleteExample,
} from './services';
import { sendSuccess, sendCreated, sendError } from '@/utils/response';
import { HTTP_STATUS } from '@/constants';

export const getAllExamplesController = (
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const examples = getAllExamples();
    sendSuccess(res, examples);
  } catch (error) {
    next(error);
  }
};

export const getExampleByIdController = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      sendError(res, HTTP_STATUS.BAD_REQUEST, 'Invalid ID', 'ID must be a number');
      return;
    }

    const example = getExampleById(id);
    if (!example) {
      sendError(res, HTTP_STATUS.NOT_FOUND, 'Not Found', `Example with ID ${id} not found`);
      return;
    }

    sendSuccess(res, example);
  } catch (error) {
    next(error);
  }
};

export const createExampleController = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      sendError(res, HTTP_STATUS.BAD_REQUEST, 'Validation Error', 'name and email are required');
      return;
    }

    const example = createExample(req.body);
    sendCreated(res, example, 'Example created successfully');
  } catch (error) {
    next(error);
  }
};

export const updateExampleController = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      sendError(res, HTTP_STATUS.BAD_REQUEST, 'Invalid ID', 'ID must be a number');
      return;
    }

    const example = updateExample(id, req.body);
    if (!example) {
      sendError(res, HTTP_STATUS.NOT_FOUND, 'Not Found', `Example with ID ${id} not found`);
      return;
    }

    sendSuccess(res, example);
  } catch (error) {
    next(error);
  }
};

export const deleteExampleController = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      sendError(res, HTTP_STATUS.BAD_REQUEST, 'Invalid ID', 'ID must be a number');
      return;
    }

    const deleted = deleteExample(id);
    if (!deleted) {
      sendError(res, HTTP_STATUS.NOT_FOUND, 'Not Found', `Example with ID ${id} not found`);
      return;
    }

    sendSuccess(res, undefined, 'Example deleted successfully');
  } catch (error) {
    next(error);
  }
};
