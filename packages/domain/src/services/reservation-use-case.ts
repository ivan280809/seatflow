import type { EventCapacity } from '../models/event-capacity.js';
import { Reservation } from '../models/reservation.js';
import type { ReservationRepository } from '../ports/reservation-repository.js';

export class ReservationUseCase {
  private nextReservationId = 1;

  constructor(
    private readonly repository: ReservationRepository,
    private readonly capacity: EventCapacity,
  ) {}

  createReservation(requestedSeats: number): Reservation {
    const reservation = new Reservation(this.nextReservationId, requestedSeats);
    this.capacity.reserve(reservation.seats);

    try {
      this.repository.save(reservation);
    } catch (error) {
      this.capacity.release(reservation.seats);
      throw error;
    }

    this.nextReservationId += 1;
    return reservation;
  }

  confirmReservation(reservationId: number): void {
    const reservation = this.getReservationOrThrow(reservationId);
    this.validatePendingStatus(reservation);

    reservation.confirm();
    this.repository.update(reservation);
  }

  cancelReservation(reservationId: number): void {
    const reservation = this.getReservationOrThrow(reservationId);
    this.validatePendingStatus(reservation);

    this.capacity.release(reservation.seats);
    reservation.cancel();
    this.repository.update(reservation);
  }

  expireReservation(reservationId: number): void {
    const reservation = this.getReservationOrThrow(reservationId);
    this.validatePendingStatus(reservation);

    this.capacity.release(reservation.seats);
    reservation.expire();
    this.repository.update(reservation);
  }

  private getReservationOrThrow(reservationId: number): Reservation {
    const reservation = this.repository.findById(reservationId);

    if (!reservation) {
      throw new Error('Reservation not found');
    }

    return reservation;
  }

  private validatePendingStatus(reservation: Reservation): void {
    if (!reservation.isPending()) {
      throw new Error('Reservation is not pending');
    }
  }
}
