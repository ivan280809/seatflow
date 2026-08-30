export enum ReservationStatusValue {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Cancelled = 'cancelled',
  Expired = 'expired',
}

export class ReservationStatus {
  private statusValue: ReservationStatusValue = ReservationStatusValue.Pending;

  get status(): ReservationStatusValue {
    return this.statusValue;
  }

  confirm(): void {
    if (this.statusValue === ReservationStatusValue.Pending) {
      this.statusValue = ReservationStatusValue.Confirmed;
    }
  }

  cancel(): void {
    if (this.statusValue === ReservationStatusValue.Pending) {
      this.statusValue = ReservationStatusValue.Cancelled;
    }
  }

  expire(): void {
    if (this.statusValue === ReservationStatusValue.Pending) {
      this.statusValue = ReservationStatusValue.Expired;
    }
  }
}
