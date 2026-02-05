import { Router } from 'express';
import {
  getAllExamplesController,
  getExampleByIdController,
  createExampleController,
  updateExampleController,
  deleteExampleController,
} from './controllers';

const router = Router();

// GET / - Get all examples
router.get('/', getAllExamplesController);

// POST / - Create a new example
router.post('/', createExampleController);

// GET /:id - Get a specific example by ID
router.get('/:id', getExampleByIdController);

// PUT /:id - Update an existing example
router.put('/:id', updateExampleController);

// DELETE /:id - Delete an example by ID
router.delete('/:id', deleteExampleController);

export default router;
