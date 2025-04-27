# FootStar Development Network (FSDN)

FootStar Development Network is a development program to assist and aggregate all developers that want to create external tools to support [Footstar](https://www.footstar.org) users to manage their teams and players.

## Footstar 
Footstar is a free online football simulator where you are the player! Join a club, set up trainings, interact with your team mates, give interviews, become the best football player in the world!
https://www.footstar.org

## Scripts

- `dev`/`start` - start dev server and open browser
- `build` - build for production
- `preview` - locally preview production build
- `test` - launch test runner


## API

New simple FSDN Api used by https://github.com/the-man-in-the-high-castle/footstar-fsdn
* Base URL: https://footstar.org/community/fsdn_api

### Login:

- Request Path: /fsdn/login
- Request Method: POST
- Payload:
```JSON
{"username":"[login]", "password":"[FSDN Pass]", "pid": [FSDN program ID]}
```
```typescript
type LoginPayload = {"username": string, "password": string, "pid": number }
```

- Example usage: 
https://github.com/the-man-in-the-high-castle/footstar-fsdn/blob/main/src/features/user/userAPI.ts

- Result Type: 
```typescript
interface FsdnLoginUserDTO extends FsdnUserDTO {
    userToken: string;
}

interface FsdnUserDTO {
  userId: number;
  managerInClubs: FsdnClubManagerDTO[];
}

export type FsdnClubManagerDTO = {
  readonly playerId: number;
  readonly clubId: number;
  readonly clubName: string;
  readonly isBteam: boolean;
  readonly isMainManager: boolean;
  readonly permissions?: FsdnClubPermissionsDTO;
};

interface FsdnClubPermissionsDTO {
  contracts: boolean;
  startingEleven: boolean;
  training: boolean;
  teamTalks: boolean;
  friendlies: boolean;
  teamForum: boolean;
  trips: boolean;
  buyPlayers: boolean;
  youthTeams: boolean;
}
```

- Result example:
```JSON
{
    "userId": 600177,
    "managerInClubs": [
        {
            "clubId": 43,
            "clubName": "Inter Codru B",
            "isBteam": true,
            "playerId": 31933,
            "isMainManager": true
        },
        {
            "clubId": 1469,
            "clubName": "Inter Codru",
            "isBteam": false,
            "playerId": 31933,
            "isMainManager": true
        }
    ],
    "userToken": "[****************]"
}
```

### Squad:

- Request Path: /fsdn/squad/[club_id]?age=[main:0/youth:1]&pid=[FSDN_program_id]
- Request Method: GET
- Headers:
```
authorization: Bearer [userToken from Login result]
content-type: application/json
```
-- Example usage:
https://github.com/the-man-in-the-high-castle/footstar-fsdn/blob/2ba4fed4a22d9aeb09cb6b9df2f6f7a059f90325/src/features/squad/squadSlice.ts#L107

- Result Type: SquadDTO -> https://github.com/the-man-in-the-high-castle/footstar-fsdn/blob/main/src/api/contracts.ts
- Result example:
```JSON
{
  "club": { "clubId": 1469, "ageCategory": 0, "name": "Inter Codru" },
  "matches": [
    {
      "id": "0",
      "date": "2025-04-27 15:30:00",
      "opponent": "Inter Miami ",
      "afterSlot": { "day": 6, "slot": 1 }
    },
    {
      "id": "1",
      "date": "2025-04-29 12:00:00",
      "opponent": "Venom Strike FC",
      "afterSlot": { "day": 1, "slot": 1 }
    }
  ],
  "permissions": { "training": true, "startingEleven": true },
  "players": [
    {
      "id": 9051,
      "userId": 0,
      "adaptability": 100,
      "age": 20,
      "clubLoyalty": 100,
      "experienceId": 3,
      "inYouthTeam": false,
      "items": {},
      "matchOrders": "OK",
      "name": "Evan Holtzclaw",
      "position": "D C",
      "training": {
        "days": [
          { "slots": [29, 29, 29] },
          { "slots": [29, 29, 29] },
          { "slots": [29, 29, 29] },
          { "slots": [29, 29, 29] },
          { "slots": [29, 29, 29] },
          { "slots": [29, 29, 29] },
          { "slots": [29, 29, 29] }
        ],
        "lastChanged": "2025-02-12 22:20:44",
        "socialize": { "days": [1, 1, 1, 1, 1, 1, 1] },
        "minFitness": 90,
        "lastTrainingId": 29,
        "trainingBonus": 1
      },
      "clubId": 1469,
      "confidenceId": 4,
      "fitness": 95,
      "morale": 99,
      "positionId": 1
    }
  ],
  "slotDate": { "day": 6, "slot": 1 },
  "dictionaries": {
    "experience": [
      "Terrible",
      "Very Bad",
      "Bad",
      "Low",
      "Passable",
      "Good",
      "Very Good",
      "Excellent",
      "Formidable",
      "World Class"
    ],
    "confidence": [
      "Very Low",
      "Low",
      "Below Average",
      "Average",
      "High",
      "Very High",
      "Exaggerated"
    ]
  }
}
```

