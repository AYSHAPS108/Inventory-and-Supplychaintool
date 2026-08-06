import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SerialNumbersService } from './serial-numbers.service';
import { SerialNumber } from './serial-number.entity';

@Controller('api/serial-numbers')
export class SerialNumbersController {
  constructor(private readonly serialsService: SerialNumbersService) {}

  @Get()
  findAll(): Promise<SerialNumber[]> {
    return this.serialsService.findAll();
  }

  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string): Promise<SerialNumber[]> {
    return this.serialsService.findByProduct(productId);
  }

  @Get('code/:serialNumber')
  findBySerialCode(@Param('serialNumber') serialNumber: string): Promise<SerialNumber> {
    return this.serialsService.findBySerialCode(serialNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<SerialNumber> {
    return this.serialsService.findOne(id);
  }

  @Post()
  create(@Body() createSerialDto: Partial<SerialNumber>): Promise<SerialNumber> {
    return this.serialsService.create(createSerialDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSerialDto: Partial<SerialNumber>): Promise<SerialNumber> {
    return this.serialsService.update(id, updateSerialDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.serialsService.remove(id);
  }
}
