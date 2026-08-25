import { ReservationStatus, type ReservationStatusValue } from './reservation-status.js';

export class Reservation {
  readonly id: number;
  readonly seats: number;
  private readonly status: ReservationStatus;

  constructor(id: number, seats: number) {
    this.id = id;
    this.seats = seats;
    this.status = new ReservationStatus();
    Object.freeze(this);
  }

  getStatus(): ReservationStatusValue {
    return this.status.status;
  }

  confirm(): void {
    this.status.confirm();
  }

  cancel(): void {
    this.status.cancel();
  }

  expire(): void {
    this.status.expire();
  }
}
