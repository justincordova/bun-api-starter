export interface ExampleInput {
  name: string;
  email: string;
  age?: number;
}

export interface Example extends ExampleInput {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

let nextId = 1;
const examples: Example[] = [];

/**
 * Reset data store to empty for testing
 *
 * Clears the in-memory data store and resets the ID counter.
 * Used in test setup to ensure test isolation.
 */
export const resetExamples = (): void => {
  examples.length = 0;
  nextId = 1;
};

/**
 * Get all examples from data store
 *
 * @returns A copy of all examples in the data store
 */
export const getAllExamples = (): Example[] => {
  return [...examples];
};

/**
 * Get a single example by ID
 *
 * @param id - The ID of the example to retrieve
 * @returns The example if found, otherwise null
 */
export const getExampleById = (id: number): Example | null => {
  return examples.find((ex) => ex.id === id) || null;
};

/**
 * Create a new example
 *
 * @param input - The example data to create
 * @returns The newly created example with auto-generated ID and timestamps
 */
export const createExample = (input: ExampleInput): Example => {
  const newExample: Example = {
    id: nextId++,
    name: input.name,
    email: input.email,
    age: input.age,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  examples.push(newExample);
  return newExample;
};

/**
 * Update an existing example by ID
 *
 * @param id - The ID of the example to update
 * @param input - Partial data to update on the example
 * @returns The updated example if found, otherwise null
 */
export const updateExample = (id: number, input: Partial<ExampleInput>): Example | null => {
  const index = examples.findIndex((ex) => ex.id === id);
  if (index === -1) {
    return null;
  }
  examples[index] = {
    ...examples[index],
    ...input,
    updatedAt: new Date(),
  };
  return examples[index];
};

/**
 * Delete an example by ID
 *
 * @param id - The ID of the example to delete
 * @returns true if the example was deleted, false if not found
 */
export const deleteExample = (id: number): boolean => {
  const index = examples.findIndex((ex) => ex.id === id);
  if (index === -1) {
    return false;
  }
  examples.splice(index, 1);
  return true;
};
