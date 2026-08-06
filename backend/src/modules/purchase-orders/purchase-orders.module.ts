import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrder } from './purchase-order.entity';
import { PurchaseOrderItem } from './purchase-order-item.entity';
import { Product } from '../products/product.entity';
import { PurchaseOrdersService } from './purchase-orders.service';
import { PurchaseOrdersController } from './purchase-orders.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseOrder, PurchaseOrderItem, Product])],
  controllers: [PurchaseOrdersController],
  providers: [PurchaseOrdersService],
  exports: [TypeOrmModule, PurchaseOrdersService],
})
export class PurchaseOrdersModule {}
