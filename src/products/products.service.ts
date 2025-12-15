import {
  ErrorMessages,
  SuccessMessages,
} from './../common/constants/http-status.constants';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { BusinessException } from 'src/common/exceptions/business.exception';
import { CustomLoggerService } from 'src/common/services/logger.service';

@Injectable()
export class ProductsService {
  private readonly logger = new CustomLoggerService(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(dto: CreateProductDto) {
    this.logger.log(`Creating product: ${dto.name}`);
    const product = this.productRepository.create(dto);
    await this.productRepository.save(product);
    return {
      message: SuccessMessages.CREATED,
      data: product,
    };
  }

  async findAll(query: QueryProductDto) {
    const { page, limit, search, category, sortBy, order } = query;

    const queryBuilder = this.productRepository.createQueryBuilder('product');

    // Filtering
    if (search) {
      queryBuilder.where(
        'product.name ILIKE :search OR product.description ILIKE :search',
        {
          search: `%${search}%`,
        },
      );
    }

    if (category) {
      queryBuilder.andWhere('product.category = :category', { category });
    }

    // Sorting
    queryBuilder.orderBy(`product.${sortBy}`, order);

    // Pagination
    const skip = (page! - 1) * limit!;
    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page: page!,
        limit: limit!,
        totalPages: Math.ceil(total / limit!),
      },
    };
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(ErrorMessages.NOT_FOUND);
    }
    return product;
  }

  async update(id: number, dto: UpdateProductDto) {
    const product = await this.findOne(id);

    // Business logic validation
    if (dto.price && dto.price < 0) {
      throw new BusinessException('Price cannot be negative');
    }

    if (dto.stock && dto.stock < 0) {
      throw new BusinessException('Stock cannot be negative');
    }

    Object.assign(product, dto);
    await this.productRepository.save(product);
    return {
      message: SuccessMessages.UPDATED,
      data: product,
    };
  }

  async remove(id: number) {
    this.logger.warn(`Attempting to delete product: ${id}`);

    const product = await this.findOne(id);

    if (product.stock > 0) {
      throw new BusinessException(ErrorMessages.CONFLICT, HttpStatus.CONFLICT);
    }

    await this.productRepository.remove(product);
    this.logger.log(`Product ${id} deleted successfully`);
    return { message: SuccessMessages.DELETED };
  }

  // Bulk operations
  async createMany(dtos: CreateProductDto[]) {
    const products = this.productRepository.create(dtos);
    return this.productRepository.save(products);
  }

  async deleteMany(ids: number[]) {
    const result = await this.productRepository.delete(ids);
    return { deleted: result.affected || 0 };
  }

  async updateMany(ids: number[], dto: UpdateProductDto) {
    await this.productRepository.update(ids, dto);
    return this.productRepository.findBy({ id: In(ids) });
  }
}
