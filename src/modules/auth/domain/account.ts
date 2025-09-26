export class Account {
  id: string;
  nationalStudentId: string | null;
  externalId: string | null;
  accountTypeId: number;
  email: string;
  passwordHash: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    email: string,
    passwordHash: string,
    accountTypeId: number = 1, // Default to student
    nationalStudentId: string | null = null,
    externalId: string | null = null,
    isActive: boolean = true,
    isVerified: boolean = false,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.nationalStudentId = nationalStudentId;
    this.externalId = externalId;
    this.accountTypeId = accountTypeId;
    this.email = email;
    this.passwordHash = passwordHash;
    this.isActive = isActive;
    this.isVerified = isVerified;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  updatePassword(newPasswordHash: string): void {
    this.passwordHash = newPasswordHash;
    this.updatedAt = new Date();
  }

  verify(): void {
    this.isVerified = true;
    this.updatedAt = new Date();
  }

  activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }
}
