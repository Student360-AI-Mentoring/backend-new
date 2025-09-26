import { StudentId } from '../../domain/student-id';

export abstract class StudentIdRepository {
  abstract create(studentId: {
    id: string;
    fullName?: string;
    dateOfBirth?: Date;
    university?: string;
    major?: string;
    enrollmentYear?: number;
    graduationYear?: number;
  }): Promise<{ id: string }>;

  abstract findById(id: string): Promise<{
    id: string;
    fullName: string;
    dateOfBirth: Date;
    university: string;
    major: string;
    enrollmentYear: number;
    graduationYear: number;
    createdAt: Date;
    updatedAt: Date;
  } | null>;

  abstract findAll(params: { page: number; limit: number }): Promise<{
    data: StudentId[];
    total: number;
  }>;

  abstract update(
    id: string,
    data: {
      fullName?: string;
      dateOfBirth?: Date;
      university?: string;
      major?: string;
      enrollmentYear?: number;
      graduationYear?: number;
    },
  ): Promise<{
    id: string;
    fullName: string;
    dateOfBirth: Date;
    university: string;
    major: string;
    enrollmentYear: number;
    graduationYear: number;
    createdAt: Date;
    updatedAt: Date;
  } | null>;

  abstract delete(id: string): Promise<void>;

  abstract search(query: string): Promise<
    Array<{
      id: string;
      fullName: string;
      dateOfBirth: Date;
      university: string;
      major: string;
      enrollmentYear: number;
      graduationYear: number;
      createdAt: Date;
      updatedAt: Date;
    }>
  >;
}
