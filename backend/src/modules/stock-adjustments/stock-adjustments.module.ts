import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockAdjustment } from './stock-adjustment.entity';
import { Product } from '../products/product.entity';
import { StockAdjustmentsService } from './stock-adjustments.service';
import { StockAdjustmentsController } from './stock-adjustments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StockAdjustment, Product])],
  controllers: [StockAdjustmentsController],
  providers: [StockAdjustmentsService],
  exports: [TypeOrmModule, StockAdjustmentsService],
})
export class StockAdjustmentsModule {}
