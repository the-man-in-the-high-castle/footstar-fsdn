import { rest } from "msw";
import {
  ClubAgeCategoryDTO,
  ConfidenceEnum,
  MatchOrdersStatuses,
  SquadDTO
} from "../api/contracts";

export const handlers = [
  rest.get("/api/players", (req, res, ctx) => {
    const isAuthenticated = true; //sessionStorage.getItem("is-authenticated")

    if (!isAuthenticated) {
      return res(
        ctx.status(403),
        ctx.json({
          errorMessage: "Not authorized"
        })
      );
    }

    const result: SquadDTO = {
      slotDate: { day: 1, slot: 2 },
      dictionaries: { confidence: [], experience: [] },
      club: { name: "Club 1", clubId: 1, ageCategory: ClubAgeCategoryDTO.Main },
      players: [
        {
          id: 1,
          name: "First Player",
          age: 18,
          experienceId: 2,
          inYouthTeam: false,
          position: "D C",
          clubId: 11,
          confidenceId: ConfidenceEnum.Average,
          confidenceProblem: true,
          fitness: 90,
          lastLogin: "2023-01-11 23:54",
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
              { slots: [1, 1, 1] }
            ],
            minFitness: 92
          },
          items: {
            shirt: { bonus: 10, desc: "Speed, Acceleration" }
          },
          matchOrders: MatchOrdersStatuses.NOT_SET
        },
        {
          id: 2,
          name: "Second Player",
          age: 26,
          experienceId: 9,
          inYouthTeam: false,
          position: "M RL",
          clubId: 123,
          confidenceId: ConfidenceEnum.High,
          confidenceProblem: false,
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
              { slots: [1, 1, 1] }
            ],
            minFitness: 82
          },
          items: {
            gloves: { bonus: 10, desc: "Handling" },
            shoes: { bonus: 8, desc: "Dribbling, Technique" },
            shirt: { bonus: 2, desc: "Speed, Acceleration" }
          },
          matchOrders: MatchOrdersStatuses.OK
        }
      ],
      matches: [
        {
          id: "1",
          date: "2023-01-11 18:00",
          opponent: "Zryw",
          afterSlot: { day: 0, slot: 2 }
        },
        {
          id: "2",
          date: "2023-01-14 15:00",
          opponent: "Quality Street",
          afterSlot: { day: 2, slot: 1 }
        }
      ]
    };
    // If authenticated, return a mocked user details
    return res(ctx.status(200), ctx.json(result));
  })
];
