import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentIdsService } from './student-ids.service';
import { StudentIdsController } from './student-ids.controller';
import { StudentIdEntity } from './infrastructure/entities/student-id.entity';
import { StudentIdRepository } from './infrastructure/repositories/student-id.repository';
import { StudentIdRelationalRepository } from './infrastructure/repositories/student-id-relational.repository';

@Module({
  imports: [TypeOrmModule.forFeature([StudentIdEntity])],
  controllers: [StudentIdsController],
  providers: [
    StudentIdsService,
    {
      provide: StudentIdRepository,
      useClass: StudentIdRelationalRepository,
    },
  ],
  exports: [StudentIdsService],
})
export class StudentIdsModule {}
