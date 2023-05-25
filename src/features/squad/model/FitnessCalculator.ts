import { WeekTrainingDTO } from "../../../api/contracts";
import { SlotDate } from "./SlotDate";
import { WeekTraining } from "./WeekTraining";

export class FitnessCalculator {
  constructor(
    private readonly currentDate: SlotDate,
    private readonly resultDate: SlotDate
  ) {}

  calculate(
    { fitness, training }: { fitness?: number; training: WeekTrainingDTO },
    todayPrevTraining: number[]
  ) {
    if (!fitness) return fitness;
    if (!training) return;

    let result = fitness;

    const week = new WeekTraining(training);

    let prevTrainings = [...todayPrevTraining];

    let date = this.currentDate;
    // console.log(date, this.resultDate);

    while (!date.equals(this.resultDate)) {
      date = date.next();
      if (date.slot === 0) prevTrainings = [];
      const delta = week.fitnessDelta(date, result, prevTrainings);
      //console.log("delta", delta, result, date)
      result = changeFitness(delta);
    }

    return result;

    function changeFitness(delta: number): number {
      return Math.max(0, Math.min(result + delta, 100));
    }
  }
}
