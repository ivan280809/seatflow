import { afterEach, describe, expect, jest, test } from '@jest/globals';
import { Reservation, ReservationStatusValue } from '../src/index.js';

afterEach(() => {
  jest.useRealTimers();
});

describe('Reservation', () => {
  test('starts as pending', () => {
    const reservation = new Reservation(1, 2);

    expect(reservation.getStatus()).toBe(ReservationStatusValue.Pending);
  });

  test('confirms through its public API', () => {
    const reservation = new Reservation(1, 2);

    reservation.confirm();

    expect(reservation.getStatus()).toBe(ReservationStatusValue.Confirmed);
  });

  test('cancels through its public API', () => {
    const reservation = new Reservation(1, 2);

    reservation.cancel();

    expect(reservation.getStatus()).toBe(ReservationStatusValue.Cancelled);
  });

  test('expires through its public API', () => {
    const reservation = new Reservation(1, 2);

    reservation.expire();

    expect(reservation.getStatus()).toBe(ReservationStatusValue.Expired);
  });

  test('keeps a confirmed reservation confirmed', () => {
    const reservation = new Reservation(1, 2);

    reservation.confirm();
    reservation.expire();
    reservation.cancel();

    expect(reservation.getStatus()).toBe(ReservationStatusValue.Confirmed);
  });

  test('keeps the reservation object frozen', () => {
    const reservation = new Reservation(1, 2);

    expect(Object.isFrozen(reservation)).toBe(true);
  });

  test('stores its creation time', () => {
    const createdAt = new Date('2026-08-31T10:00:00.000Z');
    jest.useFakeTimers().setSystemTime(createdAt);

    const reservation = new Reservation(1, 2);

    expect(reservation.createdAt).toEqual(createdAt);
  });

  test('expires eight minutes after creation', () => {
    const createdAt = new Date('2026-08-31T10:00:00.000Z');
    jest.useFakeTimers().setSystemTime(createdAt);

    const reservation = new Reservation(1, 2);

    expect(reservation.getExpirationTime()).toEqual(new Date('2026-08-31T10:08:00.000Z'));
  });

  test('updates its modification time after a valid transition', () => {
    const createdAt = new Date('2026-08-31T10:00:00.000Z');
    const updatedAt = new Date('2026-08-31T10:01:00.000Z');
    jest.useFakeTimers().setSystemTime(createdAt);
    const reservation = new Reservation(1, 2);

    jest.setSystemTime(updatedAt);
    reservation.confirm();

    expect(reservation.getUpdatedAt()).toEqual(updatedAt);
  });
});
