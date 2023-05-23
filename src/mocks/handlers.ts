import { rest } from "msw"
import { SquadDTO } from "../api/contracts"

export const handlers = [
  rest.get("/api/players", (req, res, ctx) => {
    const isAuthenticated = true //sessionStorage.getItem("is-authenticated")

    if (!isAuthenticated) {
      return res(
        ctx.status(403),
        ctx.json({
          errorMessage: "Not authorized",
        }),
      )
    }

    const result: SquadDTO = {
      players: [
        {
          id: 1,
          name: "First Player",
          age: 18,
          experienceId: 2,
          inYouthTeam: false,
          position: "D C",
          clubId: 11,
          confidenceId: 3,
          fitness: 90,
          lastLogin: new Date("2023-01-11T23:54"),
          lastLoginDays: 3,
          morale: 100,
          positionId: 1,
          userId: 4233,
          adaptability: 100,
          clubLoyalty: 100,
          training: {
            days: [
              { slots: [1, 1, 1] },
              { slots: [1, 1, 1] },
              { slots: [1, 1, 1] },
              { slots: [1, 1, 1] },
              { slots: [1, 1, 1] },
              { slots: [1, 1, 1] },
              { slots: [1, 1, 1] },
            ],
            minFitness: 92,
          },
          items: {
            shirt: { bonus: 10, desc: "Speed, Acceleration" },
          },
          matchOrders: "not set",
        },
        {
          id: 2,
          name: "Second Player",
          age: 26,
          experienceId: 9,
          inYouthTeam: false,
          position: "M RL",
          clubId: 123,
          confidenceId: 5,
          fitness: 90,
          lastLogin: undefined,
          morale: 97,
          positionId: 2,
          userId: undefined,
          adaptability: 90,
          clubLoyalty: 50,
          training: {
            days: [
              { slots: [1, 1, 14] },
              { slots: [1, 1, 1] },
              { slots: [1, 1, 1] },
              { slots: [1, 1, 1] },
              { slots: [1, 1, 1] },
              { slots: [1, 1, 1] },
              { slots: [1, 1, 1] },
            ],
            minFitness: 82,
          },
          items: {
            gloves: { bonus: 10, desc: "Handling" },
            shoes: { bonus: 8, desc: "Dribbling, Technique" },
            shirt: { bonus: 2, desc: "Speed, Acceleration" },
          },
          matchOrders: "ok",
        },
      ],
      matches: [
        {
          id: "1",
          date: "2023-01-11 18:00",
          opponent: "Zryw",
          afterSlot: { day: 0, slot: 2 },
        },
        {
          id: "2",
          date: "2023-01-14 15:00",
          opponent: "Quality Street",
          afterSlot: { day: 2, slot: 1 },
        },
      ],
    }
    // If authenticated, return a mocked user details
    return res(ctx.status(200), ctx.json(result))
  }),
]
