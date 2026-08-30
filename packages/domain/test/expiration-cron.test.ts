import { afterEach, describe, expect, jest, test } from '@jest/globals';
import { createReservationRepository } from '../src/adapters/in-memory-reservation-repository.js';
import { EventCapacity } from '../src/models/event-capacity.js';
import { ReservationStatusValue } from '../src/models/reservation-status.js';
import { ReservationUseCase } from '../src/services/reservation-use-case.js';
import { startExpirationCron } from '../src/services/expiration-cron.js';

afterEach(() => {
  jest.useRealTimers();
});

function createUseCase(): ReservationUseCase {
  return new ReservationUseCase(createReservationRepository(), new EventCapacity(10));
}

describe('startExpirationCron', () => {
  test('expires reservations when the interval runs', () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-08-31T10:00:00.000Z'));
    const useCase = createUseCase();
    const reservation = useCase.createReservation(2);
    const stop = startExpirationCron(useCase, 60_000);

    jest.advanceTimersByTime(8 * 60_000);

    expect(reservation.getStatus()).toBe(ReservationStatusValue.Expired);
    stop();
  });

  test('returns a function that stops future executions', () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-08-31T10:00:00.000Z'));
    const useCase = createUseCase();
    const reservation = useCase.createReservation(2);
    const stop = startExpirationCron(useCase, 60_000);

    stop();
    jest.advanceTimersByTime(8 * 60_000);

    expect(reservation.getStatus()).toBe(ReservationStatusValue.Pending);
  });

  test('rejects a non-positive interval', () => {
    const useCase = createUseCase();

    expect(() => startExpirationCron(useCase, 0)).toThrow(
      'intervalMs must be a positive safe integer',
    );
  });
});
