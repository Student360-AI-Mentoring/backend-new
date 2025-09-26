import { Account } from '../../domain/account';

export abstract class AccountRepository {
  abstract create(account: {
    id: string;
    email: string;
    passwordHash: string;
    accountTypeId?: number;
    nationalStudentId?: string;
    externalId?: string;
    isActive?: boolean;
    isVerified?: boolean;
  }): Promise<{ id: string }>;

  abstract findById(id: string): Promise<Account | null>;

  abstract findByEmail(email: string): Promise<Account | null>;

  abstract update(
    id: string,
    data: Partial<{
      email: string;
      passwordHash: string;
      nationalStudentId: string;
      externalId: string;
      isActive: boolean;
      isVerified: boolean;
    }>,
  ): Promise<Account | null>;

  abstract delete(id: string): Promise<void>;

  abstract findAll(): Promise<Account[]>;
}
