export interface SquadDTO {
  slotDate: SlotDateDTO;
  players: SqaudPlayerDTO[];
  matches: SquadMatchDTO[];
  dictionaries: {
    experience: string[];
    confidence: string[];
  };
}

export interface SquadMatchDTO {
  id: string;
  date: string;
  opponent: string;
  // season: number
  // day: number
  afterSlot: SlotDateDTO;
}

export interface SlotDateDTO {
  readonly day: number;
  readonly slot: number;
}

export interface SqaudPlayerDTO {
  id: number;
  userId?: number;
  positionId?: PositionTypeGeneralEnum;
  position: string;
  name: string;
  age: number;
  lastLogin?: string;
  lastLoginDays?: number;
  fitness?: number;
  morale?: number;
  confidenceId?: ConfidenceEnum;
  confidenceProblem: boolean;
  experienceId: number;
  clubId?: number;
  inYouthTeam: boolean;
  adaptability: number;
  clubLoyalty: number;
  training: WeekTrainingDTO;
  items: MatchItemsDTO;
  matchOrders?: MatchOrdersStatuses;
}

export interface MatchItemDTO {
  bonus: number;
  desc: string;
}

export interface MatchItemsDTO {
  shoes?: MatchItemDTO;
  shirt?: MatchItemDTO;
  gloves?: MatchItemDTO;
}

export interface WeekTrainingDTO {
  days: { slots: [number, number, number] }[];
  socialize?: {
    days: [
      SocializeType,
      SocializeType,
      SocializeType,
      SocializeType,
      SocializeType,
      SocializeType,
      SocializeType,
    ];
  };
  lastChanged?: string;
  minFitness: number;
}
export enum SocializeType {
  StayAlone = 0,
  Socialize = 1,
}

export enum MatchOrdersStatuses {
  NOT_SHOWED = "NOT_SHOWED",
  NO_MANAGER_ORDERS = "NO_MANAGER_ORDERS",
  NOT_SET = "NOT_SET",
  OK = "OK",
  BOT = "BOT",
}

export enum ConfidenceEnum {
  VeryLow = 1,
  Low,
  BelowAverage,
  Average,
  High,
  VeryHigh,
  Exaggerated,
}

export enum PositionTypeGeneralEnum {
  GK = 0,
  D,
  M,
  F,
}
