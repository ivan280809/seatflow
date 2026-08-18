import { describe, expect, test } from '@jest/globals';
import { reserveSeats } from '../src/reservation.js';

describe('reserveSeats', () => {
  test('reduces available seats', () => {
    expect(reserveSeats(10, 3)).toBe(7);
  });

  test('rejects more seats than available', () => {
    expect(() => reserveSeats(2, 3)).toThrow('Not enough seats');
  });
});
