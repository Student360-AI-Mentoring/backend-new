import { Account } from '../../domain/account';
import { AccountEntity } from '../entities/account.entity';

export class AccountMapper {
  static toDomain(entity: AccountEntity): Account {
    return new Account(
      entity.id,
      entity.email,
      entity.passwordHash,
      entity.accountTypeId,
      entity.nationalStudentId,
      entity.externalId,
      entity.isActive,
      entity.isVerified,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toEntity(domain: Account): AccountEntity {
    const entity = new AccountEntity();
    entity.id = domain.id;
    entity.nationalStudentId = domain.nationalStudentId;
    entity.externalId = domain.externalId;
    entity.accountTypeId = domain.accountTypeId;
    entity.email = domain.email;
    entity.passwordHash = domain.passwordHash;
    entity.isActive = domain.isActive;
    entity.isVerified = domain.isVerified;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }

  static toDomainArray(entities: AccountEntity[]): Account[] {
    return entities.map((entity) => this.toDomain(entity));
  }
}
