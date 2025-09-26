export class StudentId {
  id: string;
  fullName: string | null;
  dateOfBirth: Date | null;
  university: string | null;
  major: string | null;
  enrollmentYear: number | null;
  graduationYear: number | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    fullName: string | null = null,
    dateOfBirth: Date | null = null,
    university: string | null = null,
    major: string | null = null,
    enrollmentYear: number | null = null,
    graduationYear: number | null = null,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.fullName = fullName;
    this.dateOfBirth = dateOfBirth;
    this.university = university;
    this.major = major;
    this.enrollmentYear = enrollmentYear;
    this.graduationYear = graduationYear;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }
}
