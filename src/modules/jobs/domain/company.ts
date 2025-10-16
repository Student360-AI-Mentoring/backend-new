export class Company {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
  industryId: number | null;
  size: number | null;
  contactEmail: string | null;
  logoUrl: string | null;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    name: string,
    description: string | null = null,
    website: string | null = null,
    industryId: number | null = null,
    size: number | null = null,
    contactEmail: string | null = null,
    logoUrl: string | null = null,
    address: string | null = null,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.website = website;
    this.industryId = industryId;
    this.size = size;
    this.contactEmail = contactEmail;
    this.logoUrl = logoUrl;
    this.address = address;
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();
  }
}
