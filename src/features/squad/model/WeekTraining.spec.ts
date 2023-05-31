import { WeekTrainingDTO } from "../../../api/contracts";
import { SlotDate } from "./SlotDate";
import { SkillsEnum, TrainingAdvEnum, WeekTraining } from "./WeekTraining";

describe("WeekTraining", () => {
  const week = new WeekTraining(weekDto(SkillsEnum.acceleration));

  it("Regular Skill (-1)", () => {
    expect(week.fitnessDelta(new SlotDate(1, 1), 100, [])).toEqual(-1);
  });

  it("One Fitness (+8)", () => {
    const dto = weekDto(SkillsEnum.agility);
    dto.days[1].slots[1] = TrainingAdvEnum.fitness;
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
      TrainingAdvEnum.fitness,
      TrainingAdvEnum.fitness
    ];
    const week = new WeekTraining(dto);
    expect(
      week.fitnessDelta(new SlotDate(1, 2), 100, [
        SkillsEnum.agility,
        TrainingAdvEnum.fitness
      ])
    ).toEqual(10);
  });

  it("Third Fitness (+12)", () => {
    const dto = weekDto(SkillsEnum.agility);
    dto.days[1].slots = [
      TrainingAdvEnum.fitness,
      TrainingAdvEnum.fitness,
      TrainingAdvEnum.fitness
    ];
    const week = new WeekTraining(dto);
    expect(
      week.fitnessDelta(new SlotDate(1, 2), 100, [
        TrainingAdvEnum.fitness,
        TrainingAdvEnum.fitness
      ])
    ).toEqual(12);
  });

  it("Second Auto Fitness (+10)", () => {
    expect(
      week.fitnessDelta(new SlotDate(1, 1), 90, [TrainingAdvEnum.fitness])
    ).toEqual(10);
  });

  it("Third Auto Fitness (+12)", () => {
    expect(
      week.fitnessDelta(new SlotDate(1, 2), 90, [
        TrainingAdvEnum.fitness,
        TrainingAdvEnum.fitness
      ])
    ).toEqual(12);
  });

  it("Train having fun (+4)", () => {
    const dto = weekDto(SkillsEnum.agility);
    dto.days[1].slots[1] = TrainingAdvEnum.havingFun;
    const week = new WeekTraining(dto);
    expect(week.fitnessDelta(new SlotDate(1, 1), 100, [])).toEqual(4);
  });

  it("Train position (+0)", () => {
    const dto = weekDto(SkillsEnum.agility);
    dto.days[1].slots[1] = TrainingAdvEnum.positionDef;
    const week = new WeekTraining(dto);
    expect(week.fitnessDelta(new SlotDate(1, 1), 100, [])).toEqual(0);
  });
});

function weekDto(skill: number): WeekTrainingDTO {
  return {
    days: new Array(7).fill({ slots: [skill, skill, skill] }),
    minFitness: 92,
    lastTrainingId: 0,
    trainingBonus: 0
  };
}
