import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { Product } from './modules/products/product.entity';
import { Category } from './modules/categories/category.entity';
import { Warehouse } from './modules/warehouses/warehouse.entity';
import { StorageLocation } from './modules/storage-locations/storage-location.entity';
import { Supplier } from './modules/suppliers/supplier.entity';
import { PurchaseOrder } from './modules/purchase-orders/purchase-order.entity';
import { PurchaseOrderItem } from './modules/purchase-orders/purchase-order-item.entity';
import { StockTransfer } from './modules/stock-transfers/stock-transfer.entity';
import { StockAdjustment } from './modules/stock-adjustments/stock-adjustment.entity';
import { Batch } from './modules/batches/batch.entity';
import { SerialNumber } from './modules/serial-numbers/serial-number.entity';
import { StockLog } from './modules/stock-logs/stock-log.entity';

// Modules
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { WarehousesModule } from './modules/warehouses/warehouses.module';
import { StorageLocationsModule } from './modules/storage-locations/storage-locations.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';
import { PurchaseOrdersModule } from './modules/purchase-orders/purchase-orders.module';
import { StockTransfersModule } from './modules/stock-transfers/stock-transfers.module';
import { StockAdjustmentsModule } from './modules/stock-adjustments/stock-adjustments.module';
import { BatchesModule } from './modules/batches/batches.module';
import { SerialNumbersModule } from './modules/serial-numbers/serial-numbers.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'supply_chain_db',
      entities: [
        Product,
        Category,
        Warehouse,
        StorageLocation,
        Supplier,
        PurchaseOrder,
        PurchaseOrderItem,
        StockTransfer,
        StockAdjustment,
        Batch,
        SerialNumber,
        StockLog,
      ],
      synchronize: false,
      logging: true,
    }),
    ProductsModule,
    CategoriesModule,
    WarehousesModule,
    StorageLocationsModule,
    SuppliersModule,
    PurchaseOrdersModule,
    StockTransfersModule,
    StockAdjustmentsModule,
    BatchesModule,
    SerialNumbersModule,
  ],
})
export class AppModule {}
