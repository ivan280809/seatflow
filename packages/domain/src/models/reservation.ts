import { ReservationStatus, ReservationStatusValue } from './reservation-status.js';

export class Reservation {
  readonly id: number;
  readonly seats: number;
  private status: ReservationStatus;
  readonly createdAt = new Date();
  #updatedAt = new Date();
  #expirationTime = new Date(this.createdAt.getTime() + 1000 * 60 * 8);

  constructor(id: number, seats: number) {
    this.id = id;
    this.seats = seats;
    this.status = new ReservationStatus();
    Object.freeze(this);
  }

  getStatus(): ReservationStatusValue {
    return this.status.status;
  }

  getUpdatedAt(): Date {
    return new Date(this.#updatedAt);
  }

  getExpirationTime(): Date {
    return new Date(this.#expirationTime);
  }

  confirm(): void {
    const previousStatus = this.getStatus();
    this.status.confirm();
    this.updateTimestampIfChanged(previousStatus);
  }

  cancel(): void {
    const previousStatus = this.getStatus();
    this.status.cancel();
    this.updateTimestampIfChanged(previousStatus);
  }

  expire(): void {
    const previousStatus = this.getStatus();
    this.status.expire();
    this.updateTimestampIfChanged(previousStatus);
  }

  isPending(): boolean {
    return this.status.status === ReservationStatusValue.Pending;
  }

  private updateTimestampIfChanged(previousStatus: ReservationStatusValue): void {
    if (this.getStatus() !== previousStatus) {
      this.#updatedAt = new Date();
    }
  }
}
