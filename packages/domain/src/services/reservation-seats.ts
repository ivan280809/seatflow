export function reserveSeats(availableSeats: number, requestedSeats: number): number {
  validateSeatCount('availableSeats', availableSeats);
  validateSeatCount('requestedSeats', requestedSeats);

  if (requestedSeats > availableSeats) {
    throw new RangeError(
      `Not enough seats: requested ${requestedSeats}, available ${availableSeats}`,
    );
  }

  return availableSeats - requestedSeats;
}

function validateSeatCount(name: string, value: number): void {
  if (!Number.isSafeInteger(value)) {
    throw new TypeError(`${name} must be a safe integer`);
  }

  if (value < 0) {
    throw new RangeError(`${name} cannot be negative`);
  }
}
