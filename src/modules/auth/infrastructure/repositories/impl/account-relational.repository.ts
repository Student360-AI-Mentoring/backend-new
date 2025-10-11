import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity } from '../../../../../database/entities';
import { AccountRepository } from '../account.repository';
import { Account } from '../../../domain/account';
import { AccountMapper } from '../../mappers/account.mapper';

@Injectable()
export class AccountRelationalRepository implements AccountRepository {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly repository: Repository<AccountEntity>,
  ) {}

  async create(data: {
    id: string;
    email: string;
    passwordHash: string;
    accountTypeId?: number;
    nationalStudentId?: string;
    externalId?: string;
    isActive?: boolean;
    isVerified?: boolean;
  }): Promise<{ id: string }> {
    const entity = this.repository.create({
      ...data,
      accountTypeId: data.accountTypeId ?? 1, // Default to student type
      isActive: data.isActive ?? true,
      isVerified: data.isVerified ?? false,
    });

    const savedEntity = await this.repository.save(entity);
    return { id: savedEntity.id };
  }

  async findById(id: string): Promise<Account | null> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    return entity ? AccountMapper.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<Account | null> {
    const entity = await this.repository.findOne({
      where: { email },
    });

    return entity ? AccountMapper.toDomain(entity) : null;
  }

  async update(
    id: string,
    data: Partial<{
      email: string;
      passwordHash: string;
      nationalStudentId: string;
      externalId: string;
      isActive: boolean;
      isVerified: boolean;
    }>,
  ): Promise<Account | null> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    if (!entity) {
      return null;
    }

    Object.assign(entity, data);
    const updatedEntity = await this.repository.save(entity);
    return AccountMapper.toDomain(updatedEntity);
  }

  async delete(id: string): Promise<void> {
    const result = await this.repository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Account ${id} not found`);
    }
  }

  async findAll(): Promise<Account[]> {
    const entities = await this.repository.find({
      order: { createdAt: 'DESC' },
    });

    return AccountMapper.toDomainArray(entities);
  }
}
