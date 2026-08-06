import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SerialNumber } from './serial-number.entity';
import { SerialNumbersService } from './serial-numbers.service';
import { SerialNumbersController } from './serial-numbers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SerialNumber])],
  controllers: [SerialNumbersController],
  providers: [SerialNumbersService],
  exports: [TypeOrmModule, SerialNumbersService],
})
export class SerialNumbersModule {}
