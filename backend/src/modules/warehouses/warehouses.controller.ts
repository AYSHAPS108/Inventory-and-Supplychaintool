import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { Warehouse } from './warehouse.entity';

@Controller('api/warehouses')
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Get()
  findAll(): Promise<Warehouse[]> {
    return this.warehousesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Warehouse> {
    return this.warehousesService.findOne(id);
  }

  @Post()
  create(@Body() createWarehouseDto: Partial<Warehouse>): Promise<Warehouse> {
    return this.warehousesService.create(createWarehouseDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWarehouseDto: Partial<Warehouse>): Promise<Warehouse> {
    return this.warehousesService.update(id, updateWarehouseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.warehousesService.remove(id);
  }
}
