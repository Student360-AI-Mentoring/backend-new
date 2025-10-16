export enum EmploymentTypeEnum {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  INTERNSHIP = 'internship',
  CONTRACT = 'contract',
}

export enum ExperienceLevelEnum {
  INTERNSHIP = 'internship',
  FRESHER = 'fresher',
  JUNIOR = 'junior',
  MIDDLE = 'middle',
  SENIOR = 'senior',
}

export const EMPLOYMENT_TYPE_VALUES = Object.values(EmploymentTypeEnum);
export const EXPERIENCE_LEVEL_VALUES = Object.values(ExperienceLevelEnum);
