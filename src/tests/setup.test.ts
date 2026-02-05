import { resetExamples } from '../modules/example/services';

// Reset in-memory data before each test
beforeEach(() => {
  resetExamples();
});
