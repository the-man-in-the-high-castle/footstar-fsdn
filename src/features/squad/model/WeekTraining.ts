import { WeekTrainingDTO } from "../../../api/contracts";
import { SlotDate } from "./SlotDate";

export enum FitnessEnum {
  fitness = 14,
}

export class WeekTraining {
  constructor(private week: WeekTrainingDTO) {}

  fitnessDelta(date: SlotDate, fitness: number, prevTrainings: number[]) {
    let result =
      fitness < this.week.minFitness
        ? 8
        : fitnessChange[this.week.days[date.day].slots[date.slot]];

    // console.log(
    //   "fd",
    //   date,
    //   this.week.days[date.day].slots[date.slot],
    //   fitness,
    //   this.week.minFitness,
    //   result,
    // )
    // fitness
    if (result === 8) {
      for (let i = date.slot - 1; i >= 0; i--) {
        if (prevTrainings[i] !== FitnessEnum.fitness) break;
        result += 2;
      }

      prevTrainings[date.slot] = FitnessEnum.fitness;
    }

    return result;
  }
}

export enum SkillsEnum {
  tackling = 1,
  shortPasses = 2,
  technique = 3,
  finishing = 4,
  positioning = 5,
  heading = 6,
  speed = 7,
  stamina = 8,
  handling = 9,
  outOfArea = 10,
  reflexes = 11,
  agility = 12,
  throwing = 15,
  longPasses = 16,
  crosses = 17,
  longShots = 18,
  dribbling = 19,
  gameVision = 21,
  acceleration = 29,
  jumping = 30,
  marking = 31,
  setPieces = 32,
  firstTouch = 33,
  commandOfArea = 34,
}

export const fitnessChange = {
  ...Object.values(SkillsEnum).reduce((acc, v) => {
    if (!isNaN(Number(v))) acc[v as number] = -1;
    return acc;
  }, {} as Record<number, number>),
  [FitnessEnum.fitness as number]: 8,
};
