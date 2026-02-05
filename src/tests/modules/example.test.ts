// These tests use standard describe/it syntax that works with most testing frameworks.
// You can use any test framework you prefer - just install and configure it:
// - Jest: npm install jest @types/jest ts-jest
// - Mocha + Chai: npm install mocha chai @types/mocha @types/chai
// - AVA: npm install ava @types/ava
// - Tap: npm install tap @types/tap
// - Bun's built-in test runner: bun test (no install needed)

import { resetExamples } from '../../modules/example/services';

describe('Example Services', () => {
  beforeEach(() => {
    resetExamples();
  });

  describe('getAllExamples', () => {
    it('should return empty array initially', async () => {
      const { getAllExamples } = await import('../../modules/example/services');
      const examples = getAllExamples();
      expect(examples).toEqual([]);
    });

    it('should return all examples', async () => {
      const { createExample, getAllExamples } = await import('../../modules/example/services');
      createExample({ name: 'Test', email: 'test@example.com' });
      createExample({ name: 'Test2', email: 'test2@example.com' });
      const examples = getAllExamples();
      expect(examples.length).toBe(2);
    });
  });

  describe('getExampleById', () => {
    it('should return null for non-existent example', async () => {
      const { getExampleById } = await import('../../modules/example/services');
      const example = getExampleById(999);
      expect(example).toBeNull();
    });

    it('should return example by ID', async () => {
      const { createExample, getExampleById } = await import('../../modules/example/services');
      const created = createExample({ name: 'Test', email: 'test@example.com' });
      const found = getExampleById(created.id);
      expect(found).toEqual(created);
    });
  });

  describe('createExample', () => {
    it('should create example with auto-incrementing ID', async () => {
      const { createExample } = await import('../../modules/example/services');
      const example1 = createExample({ name: 'Test1', email: 'test1@example.com' });
      const example2 = createExample({ name: 'Test2', email: 'test2@example.com' });
      expect(example2.id).toBe(example1.id + 1);
    });

    it('should create example with timestamps', async () => {
      const { createExample } = await import('../../modules/example/services');
      const before = new Date();
      const example = createExample({ name: 'Test', email: 'test@example.com' });
      const after = new Date();
      expect(example.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(example.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('updateExample', () => {
    it('should return null for non-existent example', async () => {
      const { updateExample } = await import('../../modules/example/services');
      const updated = updateExample(999, { name: 'Updated' });
      expect(updated).toBeNull();
    });

    it('should update existing example', async () => {
      const { createExample, updateExample } = await import('../../modules/example/services');
      const created = createExample({ name: 'Test', email: 'test@example.com', age: 25 });
      const updated = updateExample(created.id, { name: 'Updated', age: 30 });
      expect(updated?.name).toBe('Updated');
      expect(updated?.age).toBe(30);
      expect(updated?.email).toBe('test@example.com');
    });

    it('should update updatedAt timestamp', async () => {
      const { createExample, updateExample } = await import('../../modules/example/services');
      const created = createExample({ name: 'Test', email: 'test@example.com' });
      await new Promise(resolve => setTimeout(resolve, 10));
      const updated = updateExample(created.id, { name: 'Updated' });
      expect(updated?.updatedAt.getTime()).toBeGreaterThan(created.updatedAt.getTime());
    });
  });

  describe('deleteExample', () => {
    it('should return false for non-existent example', async () => {
      const { deleteExample } = await import('../../modules/example/services');
      const deleted = deleteExample(999);
      expect(deleted).toBe(false);
    });

    it('should delete existing example', async () => {
      const { createExample, deleteExample, getExampleById } = await import('../../modules/example/services');
      const created = createExample({ name: 'Test', email: 'test@example.com' });
      const deleted = deleteExample(created.id);
      expect(deleted).toBe(true);
      const found = getExampleById(created.id);
      expect(found).toBeNull();
    });

    it('should remove example from getAll', async () => {
      const { createExample, deleteExample, getAllExamples } = await import('../../modules/example/services');
      const created = createExample({ name: 'Test', email: 'test@example.com' });
      deleteExample(created.id);
      const examples = getAllExamples();
      expect(examples.length).toBe(0);
    });
  });
});
