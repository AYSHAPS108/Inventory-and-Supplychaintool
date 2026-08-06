import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StorageLocationsService } from './storage-locations.service';
import { StorageLocation } from './storage-location.entity';

@Controller('api/storage-locations')
export class StorageLocationsController {
  constructor(private readonly locationsService: StorageLocationsService) {}

  @Get()
  findAll(): Promise<StorageLocation[]> {
    return this.locationsService.findAll();
  }

  @Get('warehouse/:warehouseId')
  findByWarehouse(@Param('warehouseId') warehouseId: string): Promise<StorageLocation[]> {
    return this.locationsService.findByWarehouse(warehouseId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<StorageLocation> {
    return this.locationsService.findOne(id);
  }

  @Post()
  create(@Body() createLocationDto: Partial<StorageLocation>): Promise<StorageLocation> {
    return this.locationsService.create(createLocationDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLocationDto: Partial<StorageLocation>): Promise<StorageLocation> {
    return this.locationsService.update(id, updateLocationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.locationsService.remove(id);
  }
}
