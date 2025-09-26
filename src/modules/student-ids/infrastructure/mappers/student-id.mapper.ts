import { StudentId } from '../../domain/student-id';
import { StudentIdEntity } from '../entities/student-id.entity';

export class StudentIdMapper {
  static toDomain(entity: StudentIdEntity): StudentId {
    return new StudentId(
      entity.id,
      entity.fullName,
      entity.dateOfBirth,
      entity.university,
      entity.major,
      entity.enrollmentYear,
      entity.graduationYear,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toEntity(domain: StudentId): StudentIdEntity {
    const entity = new StudentIdEntity();
    entity.id = domain.id;
    entity.fullName = domain.fullName;
    entity.dateOfBirth = domain.dateOfBirth;
    entity.university = domain.university;
    entity.major = domain.major;
    entity.enrollmentYear = domain.enrollmentYear;
    entity.graduationYear = domain.graduationYear;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }

  static toDomainArray(entities: StudentIdEntity[]): StudentId[] {
    return entities.map((entity) => this.toDomain(entity));
  }
}
