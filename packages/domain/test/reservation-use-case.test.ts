import { afterEach, describe, expect, jest, test } from '@jest/globals';
import { createReservationRepository } from '../src/index.js';
import { EventCapacity } from '../src/index.js';
import { ReservationStatusValue } from '../src/index.js';
import { ReservationUseCase } from '../src/index.js';

function createUseCase(): ReservationUseCase {
  return new ReservationUseCase(createReservationRepository(), new EventCapacity(10));
}

afterEach(() => {
  jest.useRealTimers();
});

describe('ReservationUseCase', () => {
  test('creates a pending reservation', () => {
    const useCase = createUseCase();

    const reservation = useCase.createReservation(2);

    expect(reservation.id).toBe(1);
    expect(reservation.seats).toBe(2);
    expect(reservation.getStatus()).toBe(ReservationStatusValue.Pending);
  });

  test('rejects a reservation when there is not enough capacity', () => {
    const useCase = createUseCase();

    useCase.createReservation(6);

    expect(() => useCase.createReservation(5)).toThrow();
  });

  test('does not create a reservation when capacity cannot be reserved', () => {
    const useCase = createUseCase();

    useCase.createReservation(10);

    expect(() => useCase.createReservation(1)).toThrow();
  });

  test('confirms a pending reservation without reserving capacity again', () => {
    const useCase = createUseCase();

    const reservation = useCase.createReservation(2);
    useCase.confirmReservation(reservation.id);

    expect(reservation.getStatus()).toBe(ReservationStatusValue.Confirmed);
    expect(() => useCase.createReservation(8)).not.toThrow();
  });

  test('cancels a pending reservation and releases its capacity', () => {
    const useCase = createUseCase();

    const reservation = useCase.createReservation(3);
    useCase.cancelReservation(reservation.id);

    expect(reservation.getStatus()).toBe(ReservationStatusValue.Cancelled);
    expect(() => useCase.createReservation(10)).not.toThrow();
  });

  test('expires a pending reservation and releases its capacity', () => {
    const useCase = createUseCase();

    const reservation = useCase.createReservation(4);
    useCase.expireReservation(reservation.id);

    expect(reservation.getStatus()).toBe(ReservationStatusValue.Expired);
    expect(() => useCase.createReservation(10)).not.toThrow();
  });

  test('does not cancel a confirmed reservation or release its capacity', () => {
    const useCase = createUseCase();

    const reservation = useCase.createReservation(2);
    useCase.confirmReservation(reservation.id);

    expect(() => useCase.cancelReservation(reservation.id)).toThrow('Reservation is not pending');
    expect(() => useCase.createReservation(9)).toThrow();
  });

  test('does not expire a confirmed reservation or release its capacity', () => {
    const useCase = createUseCase();

    const reservation = useCase.createReservation(2);
    useCase.confirmReservation(reservation.id);

    expect(() => useCase.expireReservation(reservation.id)).toThrow('Reservation is not pending');
    expect(() => useCase.createReservation(9)).toThrow();
  });

  test('does not cancel a reservation twice or release capacity twice', () => {
    const useCase = createUseCase();

    const reservation = useCase.createReservation(2);
    useCase.cancelReservation(reservation.id);

    expect(() => useCase.cancelReservation(reservation.id)).toThrow('Reservation is not pending');
    expect(() => useCase.createReservation(10)).not.toThrow();
  });

  test('does not expire a reservation twice or release capacity twice', () => {
    const useCase = createUseCase();

    const reservation = useCase.createReservation(2);
    useCase.expireReservation(reservation.id);

    expect(() => useCase.expireReservation(reservation.id)).toThrow('Reservation is not pending');
    expect(() => useCase.createReservation(10)).not.toThrow();
  });

  test('rejects confirming a cancelled reservation', () => {
    const useCase = createUseCase();

    const reservation = useCase.createReservation(2);
    useCase.cancelReservation(reservation.id);

    expect(() => useCase.confirmReservation(reservation.id)).toThrow('Reservation is not pending');
  });

  test('rejects confirming an expired reservation', () => {
    const useCase = createUseCase();

    const reservation = useCase.createReservation(2);
    useCase.expireReservation(reservation.id);

    expect(() => useCase.confirmReservation(reservation.id)).toThrow('Reservation is not pending');
  });

  test('rejects operations for an unknown reservation', () => {
    const useCase = createUseCase();

    expect(() => useCase.confirmReservation(999)).toThrow('Reservation not found');
    expect(() => useCase.cancelReservation(999)).toThrow('Reservation not found');
    expect(() => useCase.expireReservation(999)).toThrow('Reservation not found');
  });

  test('expires pending reservations whose deadline has passed', () => {
    const createdAt = new Date('2026-08-31T10:00:00.000Z');
    jest.useFakeTimers().setSystemTime(createdAt);
    const useCase = createUseCase();
    const reservation = useCase.createReservation(2);

    const currentTime = new Date('2026-08-31T10:08:00.000Z');
    useCase.expirePendingReservations(currentTime);

    expect(reservation.getStatus()).toBe(ReservationStatusValue.Expired);
  });

  test('does not expire a pending reservation before its deadline', () => {
    const createdAt = new Date('2026-08-31T10:00:00.000Z');
    jest.useFakeTimers().setSystemTime(createdAt);
    const useCase = createUseCase();
    const reservation = useCase.createReservation(2);

    useCase.expirePendingReservations(new Date('2026-08-31T10:07:59.999Z'));

    expect(reservation.getStatus()).toBe(ReservationStatusValue.Pending);
  });

  test('expires multiple due reservations and keeps future ones pending', () => {
    const createdAt = new Date('2026-08-31T10:00:00.000Z');
    jest.useFakeTimers().setSystemTime(createdAt);
    const useCase = createUseCase();
    const dueReservation = useCase.createReservation(2);

    jest.setSystemTime(new Date('2026-08-31T10:05:00.000Z'));
    const futureReservation = useCase.createReservation(2);

    useCase.expirePendingReservations(new Date('2026-08-31T10:08:00.000Z'));

    expect(dueReservation.getStatus()).toBe(ReservationStatusValue.Expired);
    expect(futureReservation.getStatus()).toBe(ReservationStatusValue.Pending);
  });

  test('does not expire confirmed reservations', () => {
    const createdAt = new Date('2026-08-31T10:00:00.000Z');
    jest.useFakeTimers().setSystemTime(createdAt);
    const useCase = createUseCase();
    const reservation = useCase.createReservation(2);
    useCase.confirmReservation(reservation.id);

    useCase.expirePendingReservations(new Date('2026-08-31T10:08:00.000Z'));

    expect(reservation.getStatus()).toBe(ReservationStatusValue.Confirmed);
  });

  test('can run expiration repeatedly without changing terminal reservations', () => {
    const createdAt = new Date('2026-08-31T10:00:00.000Z');
    jest.useFakeTimers().setSystemTime(createdAt);
    const useCase = createUseCase();
    const reservation = useCase.createReservation(2);
    const currentTime = new Date('2026-08-31T10:08:00.000Z');

    useCase.expirePendingReservations(currentTime);
    useCase.expirePendingReservations(currentTime);

    expect(reservation.getStatus()).toBe(ReservationStatusValue.Expired);
  });
});
