import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateStudentIdDto } from './create-student-id.dto';

export class UpdateStudentIdDto extends PartialType(OmitType(CreateStudentIdDto, ['id'] as const)) {}
