export function reserveSeats(avaibleSeats: number, requestedSeats: number): number {
  if (avaibleSeats < requestedSeats) {
    throw new Error('Not enough seats');
  }
  return avaibleSeats - requestedSeats;
}
