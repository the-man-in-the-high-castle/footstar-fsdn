import { WeekTrainingDTO } from "../../../api/contracts";
import { SlotDate } from "./SlotDate";
import { FitnessEnum, SkillsEnum, WeekTraining } from "./WeekTraining";

describe("WeekTraining", () => {
  const week = new WeekTraining(weekDto(SkillsEnum.acceleration));

  it("Regular Skill (-1)", () => {
    expect(week.fitnessDelta(new SlotDate(1, 1), 100, [])).toEqual(-1);
  });

  it("One Fitness (+8)", () => {
    const dto = weekDto(SkillsEnum.agility);
    dto.days[1].slots[1] = FitnessEnum.fitness;
    const week = new WeekTraining(dto);
    expect(week.fitnessDelta(new SlotDate(1, 1), 100, [])).toEqual(8);
  });

  it("One Auto Fitness (+8)", () => {
    expect(week.fitnessDelta(new SlotDate(1, 1), 90, [])).toEqual(8);
  });

  it("Second Fitness (+10)", () => {
    const dto = weekDto(SkillsEnum.agility);
    dto.days[1].slots = [
      SkillsEnum.agility,
      FitnessEnum.fitness,
      FitnessEnum.fitness,
    ];
    const week = new WeekTraining(dto);
    expect(
      week.fitnessDelta(new SlotDate(1, 2), 100, [
        SkillsEnum.agility,
        FitnessEnum.fitness,
      ]),
    ).toEqual(10);
  });

  it("Third Fitness (+12)", () => {
    const dto = weekDto(SkillsEnum.agility);
    dto.days[1].slots = [
      FitnessEnum.fitness,
      FitnessEnum.fitness,
      FitnessEnum.fitness,
    ];
    const week = new WeekTraining(dto);
    expect(
      week.fitnessDelta(new SlotDate(1, 2), 100, [
        FitnessEnum.fitness,
        FitnessEnum.fitness,
      ]),
    ).toEqual(12);
  });

  it("Second Auto Fitness (+10)", () => {
    expect(
      week.fitnessDelta(new SlotDate(1, 1), 90, [FitnessEnum.fitness]),
    ).toEqual(10);
  });

  it("Third Auto Fitness (+12)", () => {
    expect(
      week.fitnessDelta(new SlotDate(1, 2), 90, [
        FitnessEnum.fitness,
        FitnessEnum.fitness,
      ]),
    ).toEqual(12);
  });
});

function weekDto(skill: number): WeekTrainingDTO {
  return {
    days: new Array(7).fill({ slots: [skill, skill, skill] }),
    minFitness: 92,
  };
}
