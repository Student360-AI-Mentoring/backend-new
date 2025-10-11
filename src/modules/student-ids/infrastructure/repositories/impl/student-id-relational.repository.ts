import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentIdEntity } from '../../../../../database/entities';
import { StudentIdRepository } from '../student-id.repository';
import { StudentId } from '../../../domain/student-id';
import { StudentIdMapper } from '../../mappers/student-id.mapper';

@Injectable()
export class StudentIdRelationalRepository implements StudentIdRepository {
  constructor(
    @InjectRepository(StudentIdEntity)
    private readonly repository: Repository<StudentIdEntity>,
  ) {}

  async create(data: Omit<StudentId, 'createdAt' | 'updatedAt'>): Promise<StudentId> {
    const entity = this.repository.create({
      ...data,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
    });

    const savedEntity = await this.repository.save(entity);
    return StudentIdMapper.toDomain(savedEntity);
  }

  async findById(id: string): Promise<StudentId | null> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    return entity ? StudentIdMapper.toDomain(entity) : null;
  }

  async findAll(params: { page: number; limit: number }): Promise<{ data: StudentId[]; total: number }> {
    const page = Math.max(params.page, 1);
    const limit = Math.max(params.limit, 1);
    const skip = (page - 1) * limit;

    const [entities, total] = await this.repository.findAndCount({
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data: StudentIdMapper.toDomainArray(entities),
      total,
    };
  }

  async update(
    id: string,
    data: Partial<Omit<StudentId, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<StudentId | null> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    if (!entity) {
      return null;
    }

    // Update fields
    Object.assign(entity, {
      ...data,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : entity.dateOfBirth,
    });
    const updatedEntity = await this.repository.save(entity);
    return StudentIdMapper.toDomain(updatedEntity);
  }

  async delete(id: string): Promise<void> {
    const result = await this.repository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Student ID ${id} not found`);
    }
  }

  async search(query: string): Promise<StudentId[]> {
    const entities = await this.repository
      .createQueryBuilder('studentId')
      .where('studentId.id ILIKE :query', { query: `%${query}%` })
      .orWhere('studentId.fullName ILIKE :query', { query: `%${query}%` })
      .orWhere('studentId.university ILIKE :query', { query: `%${query}%` })
      .orWhere('studentId.major ILIKE :query', { query: `%${query}%` })
      .orderBy('studentId.createdAt', 'DESC')
      .getMany();

    return StudentIdMapper.toDomainArray(entities);
  }
}
