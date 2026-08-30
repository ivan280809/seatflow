import { describe, expect, test } from '@jest/globals';
import { EventCapacity } from '../src/index.js';

describe('EventCapacity', () => {
  test('starts with all capacity available', () => {
    const capacity = new EventCapacity(10);

    expect(capacity.capacity).toBe(10);
    expect(capacity.availableCapacity).toBe(10);
  });

  test('decreases available capacity when reserving seats', () => {
    const capacity = new EventCapacity(10);

    capacity.reserve(3);

    expect(capacity.availableCapacity).toBe(7);
  });

  test('does not allow reserving more seats than available', () => {
    const capacity = new EventCapacity(2);

    expect(() => capacity.reserve(3)).toThrow('Not enough seats: requested 3, available 2');
    expect(capacity.availableCapacity).toBe(2);
  });

  test('restores available capacity when releasing reserved seats', () => {
    const capacity = new EventCapacity(10);

    capacity.reserve(3);
    capacity.release(2);

    expect(capacity.availableCapacity).toBe(9);
  });

  test('does not allow releasing more seats than are reserved', () => {
    const capacity = new EventCapacity(10);

    expect(() => capacity.release(1)).toThrow('Cannot release 1 seats: only 0 seats are reserved');
  });

  test('rejects invalid capacity and quantities', () => {
    expect(() => new EventCapacity(-1)).toThrow('capacity cannot be negative');
    expect(() => new EventCapacity(1.5)).toThrow('capacity must be a safe integer');

    const capacity = new EventCapacity(10);
    expect(() => capacity.reserve(Number.NaN)).toThrow('quantity must be a safe integer');
    expect(() => capacity.release(-1)).toThrow('quantity cannot be negative');
  });
});
