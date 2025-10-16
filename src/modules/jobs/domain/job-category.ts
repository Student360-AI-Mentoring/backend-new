export class JobCategory {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(id: number, name: string, description: string | null = null, createdAt?: Date, updatedAt?: Date) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();
  }
}
