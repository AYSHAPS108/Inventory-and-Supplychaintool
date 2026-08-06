import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Batch } from './batch.entity';

@Injectable()
export class BatchesService {
  constructor(
    @InjectRepository(Batch)
    private readonly batchesRepository: Repository<Batch>,
  ) {}

  async findAll(): Promise<Batch[]> {
    return this.batchesRepository.find({ relations: ['product'] });
  }

  async findOne(id: string): Promise<Batch> {
    const batch = await this.batchesRepository.findOne({
      where: { id },
      relations: ['product'],
    });
    if (!batch) {
      throw new NotFoundException(`Batch with ID "${id}" not found`);
    }
    return batch;
  }

  async create(createBatchDto: Partial<Batch>): Promise<Batch> {
    const id = 'batch-' + Date.now();
    const batch = this.batchesRepository.create({ id, ...createBatchDto });
    return this.batchesRepository.save(batch);
  }

  async update(id: string, updateBatchDto: Partial<Batch>): Promise<Batch> {
    const batch = await this.findOne(id);
    Object.assign(batch, updateBatchDto);
    return this.batchesRepository.save(batch);
  }

  async remove(id: string): Promise<void> {
    const batch = await this.findOne(id);
    await this.batchesRepository.remove(batch);
  }

  async findExpiring(days: number): Promise<Batch[]> {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + days);

    return this.batchesRepository.find({
      where: {
        expiryDate: LessThanOrEqual(thresholdDate),
      },
      relations: ['product'],
    });
  }
}
