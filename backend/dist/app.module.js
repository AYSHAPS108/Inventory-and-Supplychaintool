"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const product_entity_1 = require("./modules/products/product.entity");
const category_entity_1 = require("./modules/categories/category.entity");
const warehouse_entity_1 = require("./modules/warehouses/warehouse.entity");
const storage_location_entity_1 = require("./modules/storage-locations/storage-location.entity");
const supplier_entity_1 = require("./modules/suppliers/supplier.entity");
const purchase_order_entity_1 = require("./modules/purchase-orders/purchase-order.entity");
const purchase_order_item_entity_1 = require("./modules/purchase-orders/purchase-order-item.entity");
const stock_transfer_entity_1 = require("./modules/stock-transfers/stock-transfer.entity");
const stock_adjustment_entity_1 = require("./modules/stock-adjustments/stock-adjustment.entity");
const batch_entity_1 = require("./modules/batches/batch.entity");
const serial_number_entity_1 = require("./modules/serial-numbers/serial-number.entity");
const stock_log_entity_1 = require("./modules/stock-logs/stock-log.entity");
const products_module_1 = require("./modules/products/products.module");
const categories_module_1 = require("./modules/categories/categories.module");
const warehouses_module_1 = require("./modules/warehouses/warehouses.module");
const storage_locations_module_1 = require("./modules/storage-locations/storage-locations.module");
const suppliers_module_1 = require("./modules/suppliers/suppliers.module");
const purchase_orders_module_1 = require("./modules/purchase-orders/purchase-orders.module");
const stock_transfers_module_1 = require("./modules/stock-transfers/stock-transfers.module");
const stock_adjustments_module_1 = require("./modules/stock-adjustments/stock-adjustments.module");
const batches_module_1 = require("./modules/batches/batches.module");
const serial_numbers_module_1 = require("./modules/serial-numbers/serial-numbers.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT, 10) || 5432,
                username: process.env.DB_USERNAME || 'postgres',
                password: process.env.DB_PASSWORD || 'postgres',
                database: process.env.DB_DATABASE || 'supply_chain_db',
                entities: [
                    product_entity_1.Product,
                    category_entity_1.Category,
                    warehouse_entity_1.Warehouse,
                    storage_location_entity_1.StorageLocation,
                    supplier_entity_1.Supplier,
                    purchase_order_entity_1.PurchaseOrder,
                    purchase_order_item_entity_1.PurchaseOrderItem,
                    stock_transfer_entity_1.StockTransfer,
                    stock_adjustment_entity_1.StockAdjustment,
                    batch_entity_1.Batch,
                    serial_number_entity_1.SerialNumber,
                    stock_log_entity_1.StockLog,
                ],
                synchronize: false,
                logging: true,
            }),
            products_module_1.ProductsModule,
            categories_module_1.CategoriesModule,
            warehouses_module_1.WarehousesModule,
            storage_locations_module_1.StorageLocationsModule,
            suppliers_module_1.SuppliersModule,
            purchase_orders_module_1.PurchaseOrdersModule,
            stock_transfers_module_1.StockTransfersModule,
            stock_adjustments_module_1.StockAdjustmentsModule,
            batches_module_1.BatchesModule,
            serial_numbers_module_1.SerialNumbersModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map