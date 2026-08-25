import { describe, expect, test } from '@jest/globals';
import { ReservationStatus, ReservationStatusValue } from '../src/index.js';

describe('ReservationStatus', () => {
  test('starts as pending', () => {
    const status = new ReservationStatus();

    expect(status.status).toBe(ReservationStatusValue.Pending);
  });

  test('confirms a pending reservation', () => {
    const status = new ReservationStatus();

    status.confirm();

    expect(status.status).toBe(ReservationStatusValue.Confirmed);
  });

  test('cancels a pending reservation', () => {
    const status = new ReservationStatus();

    status.cancel();

    expect(status.status).toBe(ReservationStatusValue.Cancelled);
  });

  test('does not change a confirmed reservation when confirming again', () => {
    const status = new ReservationStatus();

    status.confirm();
    status.confirm();

    expect(status.status).toBe(ReservationStatusValue.Confirmed);
  });

  test('does not cancel a confirmed reservation', () => {
    const status = new ReservationStatus();

    status.confirm();
    status.cancel();

    expect(status.status).toBe(ReservationStatusValue.Confirmed);
  });

  test('does not confirm a cancelled reservation', () => {
    const status = new ReservationStatus();

    status.cancel();
    status.confirm();

    expect(status.status).toBe(ReservationStatusValue.Cancelled);
  });

  test('expires a pending reservation', () => {
    const status = new ReservationStatus();

    status.expire();

    expect(status.status).toBe(ReservationStatusValue.Expired);
  });

  test('does not expire a confirmed reservation', () => {
    const status = new ReservationStatus();

    status.confirm();
    status.expire();

    expect(status.status).toBe(ReservationStatusValue.Confirmed);
  });
});
