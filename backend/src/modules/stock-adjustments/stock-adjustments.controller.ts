import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { StockAdjustmentsService } from './stock-adjustments.service';
import { StockAdjustment } from './stock-adjustment.entity';

@Controller('api/stock-adjustments')
export class StockAdjustmentsController {
  constructor(private readonly adjustmentsService: StockAdjustmentsService) {}

  @Get()
  findAll(): Promise<StockAdjustment[]> {
    return this.adjustmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<StockAdjustment> {
    return this.adjustmentsService.findOne(id);
  }

  @Post()
  create(@Body() createAdjustmentDto: Partial<StockAdjustment>): Promise<StockAdjustment> {
    return this.adjustmentsService.create(createAdjustmentDto);
  }

  @Put(':id/approve')
  approve(@Param('id') id: string, @Body('approvedBy') approvedBy?: string): Promise<StockAdjustment> {
    return this.adjustmentsService.approve(id, approvedBy);
  }
}
