import { describe, expect, test } from '@jest/globals';
import { reserveSeats } from '../src/index.js';

describe('reserveSeats', () => {
  test('reduces the number of available seats', () => {
    expect(reserveSeats(10, 3)).toBe(7);
  });

  test('reduces available seats to zero', () => {
    expect(reserveSeats(10, 10)).toBe(0);
  });

  test('allows requesting zero seats', () => {
    expect(reserveSeats(10, 0)).toBe(10);
  });

  test('allows having zero available seats when requesting zero', () => {
    expect(reserveSeats(0, 0)).toBe(0);
  });

  test('rejects requesting more seats than available', () => {
    const action = () => reserveSeats(2, 3);

    expect(action).toThrow(RangeError);
    expect(action).toThrow('Not enough seats: requested 3, available 2');
  });

  test('rejects negative requested seats', () => {
    const action = () => reserveSeats(10, -1);

    expect(action).toThrow(RangeError);
    expect(action).toThrow('requestedSeats cannot be negative');
  });

  test('rejects negative available seats', () => {
    const action = () => reserveSeats(-10, 5);

    expect(action).toThrow(RangeError);
    expect(action).toThrow('availableSeats cannot be negative');
  });

  test('rejects a non-numeric availableSeats value', () => {
    const action = () => reserveSeats('j10' as unknown as number, 10);

    expect(action).toThrow(TypeError);
    expect(action).toThrow('availableSeats must be a safe integer');
  });

  test('rejects a non-numeric requestedSeats value', () => {
    const action = () => reserveSeats(10, '10j' as unknown as number);

    expect(action).toThrow(TypeError);
    expect(action).toThrow('requestedSeats must be a safe integer');
  });

  test('rejects a decimal availableSeats value', () => {
    expect(() => reserveSeats(10.5, 5)).toThrow('availableSeats must be a safe integer');
  });

  test('rejects a decimal requestedSeats value', () => {
    expect(() => reserveSeats(10, 5.5)).toThrow('requestedSeats must be a safe integer');
  });

  test('rejects NaN', () => {
    expect(() => reserveSeats(Number.NaN, 1)).toThrow('availableSeats must be a safe integer');
  });

  test('rejects Infinity', () => {
    expect(() => reserveSeats(10, Number.POSITIVE_INFINITY)).toThrow(
      'requestedSeats must be a safe integer',
    );
  });

  test('rejects integers outside the safe range', () => {
    expect(() => reserveSeats(Number.MAX_SAFE_INTEGER + 1, 1)).toThrow(
      'availableSeats must be a safe integer',
    );
  });
});
