export interface ISlotDate {
  readonly day: number
  readonly slot: number
}

export class SlotDate implements ISlotDate {
  constructor(public readonly day: number, public readonly slot: number) {
    if (day < 0 || day > 6) throw Error("Wrong day " + day)
    if (slot < 0 || slot > LAST_SLOT_INDEX) throw Error("Wrong day " + slot)
  }

  static fromSlot(date: ISlotDate) {
    return new SlotDate(date.day, date.slot)
  }

  next() {
    if (this.slot === LAST_SLOT_INDEX) {
      return new SlotDate((this.day + 1) % 7, 0)
    }
    return new SlotDate(this.day, this.slot + 1)
  }
  equals(date: SlotDate) {
    return date.day === this.day && date.slot === this.slot
  }
}
const LAST_SLOT_INDEX = 2
