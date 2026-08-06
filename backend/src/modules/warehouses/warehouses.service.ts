import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from './warehouse.entity';

@Injectable()
export class WarehousesService {
  constructor(
    @InjectRepository(Warehouse)
    private readonly warehousesRepository: Repository<Warehouse>,
  ) {}

  async findAll(): Promise<Warehouse[]> {
    return this.warehousesRepository.find();
  }

  async findOne(id: string): Promise<Warehouse> {
    const warehouse = await this.warehousesRepository.findOne({ where: { id } });
    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID "${id}" not found`);
    }
    return warehouse;
  }

  async create(createWarehouseDto: Partial<Warehouse>): Promise<Warehouse> {
    const id = 'wh-' + Date.now();
    const warehouse = this.warehousesRepository.create({ id, ...createWarehouseDto });
    return this.warehousesRepository.save(warehouse);
  }

  async update(id: string, updateWarehouseDto: Partial<Warehouse>): Promise<Warehouse> {
    const warehouse = await this.findOne(id);
    Object.assign(warehouse, updateWarehouseDto);
    return this.warehousesRepository.save(warehouse);
  }

  async remove(id: string): Promise<void> {
    const warehouse = await this.findOne(id);
    await this.warehousesRepository.remove(warehouse);
  }
}
