import { Module } from '@nestjs/common';
import { ClaseService } from './clase.service';

import { ClaseEntity } from './clase.entity/clase.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ClaseEntity])],
  providers: [ClaseService]
})
export class ClaseModule {}
