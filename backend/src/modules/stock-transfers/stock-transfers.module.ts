import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockTransfer } from './stock-transfer.entity';
import { Product } from '../products/product.entity';
import { StockTransfersService } from './stock-transfers.service';
import { StockTransfersController } from './stock-transfers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StockTransfer, Product])],
  controllers: [StockTransfersController],
  providers: [StockTransfersService],
  exports: [TypeOrmModule, StockTransfersService],
})
export class StockTransfersModule {}
