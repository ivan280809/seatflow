import type { Reservation } from '../models/reservation.js';

export interface ReservationRepository {
  findAll(): readonly Reservation[];
  findById(id: number): Reservation | undefined;
  save(reservation: Reservation): void;
  deleteById(id: number): boolean;
  update(reservation: Reservation): void;
}
