import { describe, expect, test } from '@jest/globals';
import {
  createReservationRepository,
  reservationRepository,
} from '../src/adapters/in-memory-reservation-repository.js';
import { Reservation } from '../src/models/reservation.js';

describe('Reservation', () => {
  test('creates an immutable reservation', () => {
    const reservation = new Reservation(1, 2);

    expect(Object.isFrozen(reservation)).toBe(true);
  });
});

describe('createReservationRepository', () => {
  test('stores and finds a reservation by id', () => {
    const repository = createReservationRepository();
    const reservation = new Reservation(1, 2);

    repository.save(reservation);

    expect(repository.findById(1)).toBe(reservation);
  });

  test('returns undefined for an unknown id', () => {
    const repository = createReservationRepository();

    expect(repository.findById(1)).toBeUndefined();
  });

  test('returns a snapshot of all reservations', () => {
    const repository = createReservationRepository();
    const reservation = new Reservation(1, 2);

    repository.save(reservation);

    const firstResult = repository.findAll();
    const secondResult = repository.findAll();

    expect(firstResult).toEqual([reservation]);
    expect(firstResult).not.toBe(secondResult);
  });

  test('rejects saving a duplicate id', () => {
    const repository = createReservationRepository();

    repository.save(new Reservation(1, 2));

    expect(() => repository.save(new Reservation(1, 3))).toThrow(
      'Reservation with id 1 already exists',
    );
  });

  test('updates an existing reservation', () => {
    const repository = createReservationRepository();
    const original = new Reservation(1, 2);
    const updated = new Reservation(1, 3);

    repository.save(original);
    repository.update(updated);

    expect(repository.findById(1)).toBe(updated);
  });

  test('rejects updating an unknown id', () => {
    const repository = createReservationRepository();

    expect(() => repository.update(new Reservation(1, 2))).toThrow(
      'Reservation with id 1 does not exist',
    );
  });

  test('deletes an existing reservation and reports success', () => {
    const repository = createReservationRepository();
    repository.save(new Reservation(1, 2));

    expect(repository.deleteById(1)).toBe(true);
    expect(repository.findById(1)).toBeUndefined();
  });

  test('reports false when deleting an unknown id', () => {
    const repository = createReservationRepository();

    expect(repository.deleteById(1)).toBe(false);
  });

  test('creates repositories with isolated state', () => {
    const firstRepository = createReservationRepository();
    const secondRepository = createReservationRepository();

    firstRepository.save(new Reservation(1, 2));

    expect(secondRepository.findById(1)).toBeUndefined();
  });
});

describe('reservationRepository', () => {
  test('is a separate repository instance from repositories created by the factory', () => {
    expect(reservationRepository).not.toBe(createReservationRepository());
  });
});
