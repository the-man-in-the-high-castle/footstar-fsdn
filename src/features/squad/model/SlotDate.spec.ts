import { SlotDate } from "./SlotDate"

describe("SlotDate", () => {
  it("next slot the same day", () => {
    expect(new SlotDate(1, 0).next()).toEqual({
      day: 1,
      slot: 1,
    })
  })

  it("next slot in next day", () => {
    expect(new SlotDate(1, 2).next()).toEqual({
      day: 2,
      slot: 0,
    })
  })

  it("next slot in next week", () => {
    expect(new SlotDate(6, 2).next()).toEqual({
      day: 0,
      slot: 0,
    })
  })

  it("equal", () => {
    expect(new SlotDate(6, 2).equals(new SlotDate(6, 2))).toBeTruthy()
  })
})
