import type { ReservationUseCase } from './reservation-use-case.js';

export function startExpirationCron(
  reservationUseCase: ReservationUseCase,
  intervalMs = 60_000,
): () => void {
  if (!Number.isSafeInteger(intervalMs) || intervalMs <= 0) {
    throw new RangeError('intervalMs must be a positive safe integer');
  }

  const intervalId = setInterval(() => {
    try {
      reservationUseCase.expirePendingReservations(new Date());
    } catch (error) {
      console.error('Error expiring reservations', error);
    }
  }, intervalMs);

  return () => clearInterval(intervalId);
}
