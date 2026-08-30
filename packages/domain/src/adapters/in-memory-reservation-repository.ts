import type { Reservation } from '../models/reservation.js';
import type { ReservationRepository } from '../ports/reservation-repository.js';

export class InMemoryReservationRepository implements ReservationRepository {
  private readonly reservationMap = new Map<number, Reservation>();

  findAll(): readonly Reservation[] {
    return [...this.reservationMap.values()];
  }

  findById(id: number): Reservation | undefined {
    return this.reservationMap.get(id);
  }

  save(reservation: Reservation): void {
    if (this.reservationMap.has(reservation.id)) {
      throw new Error(`Reservation with id ${reservation.id} already exists`);
    }

    this.reservationMap.set(reservation.id, reservation);
  }

  deleteById(id: number): boolean {
    return this.reservationMap.delete(id);
  }

  update(reservation: Reservation): void {
    if (!this.reservationMap.has(reservation.id)) {
      throw new Error(`Reservation with id ${reservation.id} does not exist`);
    }

    this.reservationMap.set(reservation.id, reservation);
  }
}

export function createReservationRepository(): ReservationRepository {
  return new InMemoryReservationRepository();
}

export const reservationRepository = createReservationRepository();
