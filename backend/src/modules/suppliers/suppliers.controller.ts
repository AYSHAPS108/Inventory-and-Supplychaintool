import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { Supplier } from './supplier.entity';

@Controller('api/suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Get()
  findAll(): Promise<Supplier[]> {
    return this.suppliersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Supplier> {
    return this.suppliersService.findOne(id);
  }

  @Post()
  create(@Body() createSupplierDto: Partial<Supplier>): Promise<Supplier> {
    return this.suppliersService.create(createSupplierDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSupplierDto: Partial<Supplier>): Promise<Supplier> {
    return this.suppliersService.update(id, updateSupplierDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.suppliersService.remove(id);
  }
}
