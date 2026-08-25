import { describe, expect, test } from '@jest/globals';
import { Reservation, ReservationStatusValue } from '../src/index.js';

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
});
