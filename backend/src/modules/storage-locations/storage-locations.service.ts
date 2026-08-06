import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StorageLocation } from './storage-location.entity';

@Injectable()
export class StorageLocationsService {
  constructor(
    @InjectRepository(StorageLocation)
    private readonly locationsRepository: Repository<StorageLocation>,
  ) {}

  async findAll(): Promise<StorageLocation[]> {
    return this.locationsRepository.find({ relations: ['warehouse'] });
  }

  async findByWarehouse(warehouseId: string): Promise<StorageLocation[]> {
    return this.locationsRepository.find({
      where: { warehouseId },
      relations: ['warehouse'],
    });
  }

  async findOne(id: string): Promise<StorageLocation> {
    const location = await this.locationsRepository.findOne({
      where: { id },
      relations: ['warehouse'],
    });
    if (!location) {
      throw new NotFoundException(`Storage Location with ID "${id}" not found`);
    }
    return location;
  }

  async create(createLocationDto: Partial<StorageLocation>): Promise<StorageLocation> {
    const id = 'loc-' + Date.now();
    const location = this.locationsRepository.create({ id, ...createLocationDto });
    return this.locationsRepository.save(location);
  }

  async update(id: string, updateLocationDto: Partial<StorageLocation>): Promise<StorageLocation> {
    const location = await this.findOne(id);
    Object.assign(location, updateLocationDto);
    return this.locationsRepository.save(location);
  }

  async remove(id: string): Promise<void> {
    const location = await this.findOne(id);
    await this.locationsRepository.remove(location);
  }
}
