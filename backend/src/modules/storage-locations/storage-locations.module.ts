import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageLocation } from './storage-location.entity';
import { StorageLocationsService } from './storage-locations.service';
import { StorageLocationsController } from './storage-locations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StorageLocation])],
  controllers: [StorageLocationsController],
  providers: [StorageLocationsService],
  exports: [TypeOrmModule, StorageLocationsService],
})
export class StorageLocationsModule {}
