import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { PurchaseOrdersService } from './purchase-orders.service';
import { PurchaseOrder } from './purchase-order.entity';
import { PurchaseOrderItem } from './purchase-order-item.entity';

@Controller('api/purchase-orders')
export class PurchaseOrdersController {
  constructor(private readonly purchaseOrdersService: PurchaseOrdersService) {}

  @Get()
  findAll(): Promise<PurchaseOrder[]> {
    return this.purchaseOrdersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PurchaseOrder> {
    return this.purchaseOrdersService.findOne(id);
  }

  @Post()
  create(@Body() createPoDto: Partial<PurchaseOrder> & { items: Partial<PurchaseOrderItem>[] }): Promise<PurchaseOrder> {
    return this.purchaseOrdersService.create(createPoDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePoDto: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
    return this.purchaseOrdersService.update(id, updatePoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.purchaseOrdersService.remove(id);
  }

  @Put(':id/approve')
  approve(@Param('id') id: string): Promise<PurchaseOrder> {
    return this.purchaseOrdersService.approve(id);
  }

  @Post(':id/receive')
  receiveGoods(@Param('id') id: string, @Body('notes') notes?: string): Promise<PurchaseOrder> {
    return this.purchaseOrdersService.receiveGoods(id, notes);
  }
}
