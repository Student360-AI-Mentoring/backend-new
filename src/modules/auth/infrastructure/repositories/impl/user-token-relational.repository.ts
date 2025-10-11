import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { UserTokenRepository } from '../user-token.repository';
import { UserTokenEntity } from '../../../../../database/entities';
import { UserTokenMapper } from '../../mappers/user-token.mapper';
import { UserToken } from '@/modules/auth/domain/user-token';

@Injectable()
export class UserTokenRelationalRepository implements UserTokenRepository {
  constructor(
    @InjectRepository(UserTokenEntity)
    private readonly repository: Repository<UserTokenEntity>,
  ) {}

  async create(data: { accountId: string; refreshToken: string; expiresAt: Date }): Promise<{ id: number }> {
    const entity = this.repository.create(data);
    const savedEntity = await this.repository.save(entity);
    return { id: savedEntity.id };
  }

  async findByToken(refreshToken: string): Promise<UserToken | null> {
    const entity = await this.repository.findOne({
      where: { refreshToken },
    });

    return entity ? UserTokenMapper.toDomain(entity) : null;
  }

  async findByAccountId(accountId: string): Promise<UserToken[]> {
    const entities = await this.repository.find({
      where: { accountId },
      order: { createdAt: 'DESC' },
    });

    return UserTokenMapper.toDomainArray(entities);
  }

  async update(
    id: number,
    data: {
      refreshToken?: string;
      expiresAt?: Date;
    },
  ): Promise<UserToken | null> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    if (!entity) {
      return null;
    }

    Object.assign(entity, data);
    const updatedEntity = await this.repository.save(entity);
    return UserTokenMapper.toDomain(updatedEntity);
  }

  async delete(id: number): Promise<void> {
    const result = await this.repository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Token ${id} not found`);
    }
  }

  async deleteByAccountId(accountId: string): Promise<void> {
    await this.repository.delete({ accountId });
  }

  async deleteExpiredTokens(): Promise<void> {
    await this.repository.delete({
      expiresAt: LessThan(new Date()),
    });
  }
}
