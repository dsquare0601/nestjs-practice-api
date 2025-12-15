import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(dto: CreateProductDto) {
    const product = this.productRepository.create(dto);
    return this.productRepository.save(product);
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
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  async update(id: number, dto: UpdateProductDto) {
    const product = await this.findOne(id);
    Object.assign(product, dto);
    return this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return { message: 'Product deleted successfully' };
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
