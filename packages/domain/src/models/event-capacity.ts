export class EventCapacity {
  readonly capacity: number;
  private availableCapacityValue: number;

  constructor(capacity: number) {
    validateSeatCount('capacity', capacity);

    this.capacity = capacity;
    this.availableCapacityValue = capacity;
  }

  get availableCapacity(): number {
    return this.availableCapacityValue;
  }

  reserve(quantity: number): void {
    if (this.availableCapacityValue === 0) {
      throw new Error('No seats available');
    }
    validateSeatCount('quantity', quantity);

    if (quantity > this.availableCapacityValue) {
      throw new RangeError(
        `Not enough seats: requested ${quantity}, available ${this.availableCapacityValue}`,
      );
    }

    this.availableCapacityValue -= quantity;
  }

  release(quantity: number): void {
    validateSeatCount('quantity', quantity);

    const reservedCapacity = this.capacity - this.availableCapacityValue;
    if (quantity > reservedCapacity) {
      throw new RangeError(
        `Cannot release ${quantity} seats: only ${reservedCapacity} seats are reserved`,
      );
    }

    this.availableCapacityValue += quantity;
  }
}

function validateSeatCount(name: string, value: number): void {
  if (!Number.isSafeInteger(value)) {
    throw new TypeError(`${name} must be a safe integer`);
  }

  if (value < 0) {
    throw new RangeError(`${name} cannot be negative`);
  }
}
