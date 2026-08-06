import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BatchesService } from './batches.service';
import { Batch } from './batch.entity';

@Controller('api/batches')
export class BatchesController {
  constructor(private readonly batchesService: BatchesService) {}

  @Get()
  findAll(): Promise<Batch[]> {
    return this.batchesService.findAll();
  }

  @Get('expiring')
  findExpiring(@Query('days') days?: string): Promise<Batch[]> {
    const thresholdDays = days ? parseInt(days, 10) : 90;
    return this.batchesService.findExpiring(thresholdDays);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Batch> {
    return this.batchesService.findOne(id);
  }

  @Post()
  create(@Body() createBatchDto: Partial<Batch>): Promise<Batch> {
    return this.batchesService.create(createBatchDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBatchDto: Partial<Batch>): Promise<Batch> {
    return this.batchesService.update(id, updateBatchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.batchesService.remove(id);
  }
}
