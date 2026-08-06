import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SerialNumber } from './serial-number.entity';

@Injectable()
export class SerialNumbersService {
  constructor(
    @InjectRepository(SerialNumber)
    private readonly serialsRepository: Repository<SerialNumber>,
  ) {}

  async findAll(): Promise<SerialNumber[]> {
    return this.serialsRepository.find({ relations: ['product', 'warehouse'] });
  }

  async findOne(id: string): Promise<SerialNumber> {
    const serial = await this.serialsRepository.findOne({
      where: { id },
      relations: ['product', 'warehouse'],
    });
    if (!serial) {
      throw new NotFoundException(`Serial number record with ID "${id}" not found`);
    }
    return serial;
  }

  async findByProduct(productId: string): Promise<SerialNumber[]> {
    return this.serialsRepository.find({
      where: { productId },
      relations: ['product', 'warehouse'],
    });
  }

  async findBySerialCode(serialNumber: string): Promise<SerialNumber> {
    const serial = await this.serialsRepository.findOne({
      where: { serialNumber },
      relations: ['product', 'warehouse'],
    });
    if (!serial) {
      throw new NotFoundException(`Serial number "${serialNumber}" not found`);
    }
    return serial;
  }

  async create(createSerialDto: Partial<SerialNumber>): Promise<SerialNumber> {
    const id = 'sn-' + Date.now();
    const serial = this.serialsRepository.create({ id, ...createSerialDto });
    return this.serialsRepository.save(serial);
  }

  async update(id: string, updateSerialDto: Partial<SerialNumber>): Promise<SerialNumber> {
    const serial = await this.findOne(id);
    Object.assign(serial, updateSerialDto);
    return this.serialsRepository.save(serial);
  }

  async remove(id: string): Promise<void> {
    const serial = await this.findOne(id);
    await this.serialsRepository.remove(serial);
  }
}
