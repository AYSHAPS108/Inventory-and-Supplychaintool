"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./product.entity");
let ProductsService = class ProductsService {
    constructor(productsRepository) {
        this.productsRepository = productsRepository;
    }
    async findAll() {
        return this.productsRepository.find({ relations: ['category'] });
    }
    async findOne(id) {
        const product = await this.productsRepository.findOne({
            where: { id },
            relations: ['category'],
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID "${id}" not found`);
        }
        return product;
    }
    async create(createProductDto) {
        const id = 'prod-' + Date.now();
        const product = this.productsRepository.create({ id, ...createProductDto });
        return this.productsRepository.save(product);
    }
    async update(id, updateProductDto) {
        const product = await this.findOne(id);
        Object.assign(product, updateProductDto);
        return this.productsRepository.save(product);
    }
    async remove(id) {
        const product = await this.findOne(id);
        await this.productsRepository.remove(product);
    }
    async getMetrics() {
        const products = await this.findAll();
        const totalProducts = products.length;
        const totalValue = products.reduce((sum, p) => sum + (Number(p.sellingPrice) * Number(p.quantity)), 0);
        const totalCostValue = products.reduce((sum, p) => sum + (Number(p.costPrice) * Number(p.quantity)), 0);
        const lowStockCount = products.filter(p => p.quantity > 0 && p.quantity <= p.minStock).length;
        const outOfStockCount = products.filter(p => p.quantity === 0).length;
        return {
            totalProducts,
            totalValue,
            totalCostValue,
            lowStockCount,
            outOfStockCount,
        };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map