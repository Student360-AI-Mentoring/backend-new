import { UserToken } from '../../domain/user-token';
import { UserTokenEntity } from '../entities/user-token.entity';

export class UserTokenMapper {
  static toDomain(entity: UserTokenEntity): UserToken {
    return new UserToken(
      entity.accountId,
      entity.refreshToken,
      entity.expiresAt,
      entity.id,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toEntity(domain: UserToken): UserTokenEntity {
    const entity = new UserTokenEntity();
    if (domain.id) {
      entity.id = domain.id;
    }
    entity.accountId = domain.accountId;
    entity.refreshToken = domain.refreshToken;
    entity.expiresAt = domain.expiresAt;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }

  static toDomainArray(entities: UserTokenEntity[]): UserToken[] {
    return entities.map((entity) => this.toDomain(entity));
  }
}
