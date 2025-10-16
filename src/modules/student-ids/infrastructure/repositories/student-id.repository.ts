import { StudentId } from '../../domain/student-id';

export abstract class StudentIdRepository {
  abstract create(data: Omit<StudentId, 'createdAt' | 'updatedAt'>): Promise<StudentId>;

  abstract findById(id: string): Promise<StudentId | null>;

  abstract findAll(params: { page: number; limit: number }): Promise<{
    data: StudentId[];
    total: number;
  }>;

  abstract update(
    id: string,
    data: Partial<Omit<StudentId, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<StudentId | null>;

  abstract delete(id: string): Promise<void>;

  abstract search(query: string): Promise<StudentId[]>;
}
