import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { StockTransfersService } from './stock-transfers.service';
import { StockTransfer } from './stock-transfer.entity';

@Controller('api/stock-transfers')
export class StockTransfersController {
  constructor(private readonly transfersService: StockTransfersService) {}

  @Get()
  findAll(): Promise<StockTransfer[]> {
    return this.transfersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<StockTransfer> {
    return this.transfersService.findOne(id);
  }

  @Post()
  create(@Body() createTransferDto: Partial<StockTransfer>): Promise<StockTransfer> {
    return this.transfersService.create(createTransferDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransferDto: Partial<StockTransfer>): Promise<StockTransfer> {
    return this.transfersService.update(id, updateTransferDto);
  }

  @Put(':id/approve')
  approve(@Param('id') id: string, @Body('approvedBy') approvedBy?: string): Promise<StockTransfer> {
    return this.transfersService.approve(id, approvedBy);
  }

  @Post(':id/receive')
  receiveTransfer(@Param('id') id: string): Promise<StockTransfer> {
    return this.transfersService.receiveTransfer(id);
  }
}
