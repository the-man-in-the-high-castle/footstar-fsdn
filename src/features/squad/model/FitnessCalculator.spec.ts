import { WeekTrainingDTO } from "../../../api/contracts";
import { FitnessCalculator } from "./FitnessCalculator";
import { SlotDate } from "./SlotDate";
import { FitnessEnum, SkillsEnum } from "./WeekTraining";

describe("FitnessCalculator", () => {
  const player = {
    fitness: 94,
    training: weekDto(1),
  };

  it("Returns current fitness if slot date is current", () => {
    const calculator = new FitnessCalculator(
      new SlotDate(1, 1),
      new SlotDate(1, 1),
    );
    expect(calculator.calculate(player, [])).toEqual(player.fitness);
  });

  it("Fitness after one skill training", () => {
    const calculator = new FitnessCalculator(
      new SlotDate(1, 1),
      new SlotDate(1, 2),
    );
    expect(calculator.calculate(player, [])).toEqual(player.fitness - 1);
  });

  it("Fitness after all day trainings", () => {
    const calculator = new FitnessCalculator(
      new SlotDate(1, 2),
      new SlotDate(2, 2),
    );
    expect(calculator.calculate(player, [])).toEqual(player.fitness - 3);
  });

  it("Fitness after 3 full day trainings", () => {
    const calculator = new FitnessCalculator(
      new SlotDate(1, 2),
      new SlotDate(3, 2),
    );
    expect(calculator.calculate(player, [])).toEqual(player.fitness - 6);
  });

  it("Fitness after 3 full day trainings (start after 2 day training)", () => {
    const calculator = new FitnessCalculator(
      new SlotDate(1, 1),
      new SlotDate(3, 0),
    );
    expect(calculator.calculate(player, [])).toEqual(player.fitness - 5);
  });

  it("Fitness after recover day", () => {
    const calculator = new FitnessCalculator(
      new SlotDate(1, 2),
      new SlotDate(2, 2),
    );

    const dto = weekDto(SkillsEnum.agility);
    dto.days[2].slots = [
      FitnessEnum.fitness,
      FitnessEnum.fitness,
      FitnessEnum.fitness,
    ];
    const player = { fitness: 60, training: dto };

    expect(calculator.calculate(player, [])).toEqual(90);
  });

  it("Fitness after 2 recover days", () => {
    const calculator = new FitnessCalculator(
      new SlotDate(1, 2),
      new SlotDate(3, 2),
    );

    const dto = weekDto(SkillsEnum.agility);
    dto.days[2].slots = [
      FitnessEnum.fitness,
      FitnessEnum.fitness,
      FitnessEnum.fitness,
    ];
    dto.days[3].slots = [
      FitnessEnum.fitness,
      FitnessEnum.fitness,
      FitnessEnum.fitness,
    ];
    const player = { fitness: 60, training: dto };

    expect(calculator.calculate(player, [])).toEqual(100);
  });

  it("Fitness after recover + skills", () => {
    const calculator = new FitnessCalculator(
      new SlotDate(1, 2),
      new SlotDate(3, 2),
    );

    const dto = weekDto(SkillsEnum.agility);
    dto.days[2].slots = [
      FitnessEnum.fitness,
      FitnessEnum.fitness,
      FitnessEnum.fitness,
    ];
    const player = { fitness: 60, training: dto };

    expect(calculator.calculate(player, [])).toEqual(87);
  });
});

function weekDto(skill: number, minFitness = 0): WeekTrainingDTO {
  return {
    days: new Array(7).fill(0).map(() => ({ slots: [skill, skill, skill] })),
    minFitness,
  };
}
