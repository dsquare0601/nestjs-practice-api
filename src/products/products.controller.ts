import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TrimPipe } from '../common/pipes/trim.pipe';
import { CustomValidationPipe } from '../common/pipes/custom-validation.pipe';
import { BusinessException } from '../common/exceptions/business.exception';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body(TrimPipe, CustomValidationPipe) dto: CreateProductDto) {
    try {
      return await this.productsService.create(dto);
    } catch (error) {
      if (error.code === '23505') {
        throw new BusinessException('Product already exists');
      }
      throw error;
    }
  }

  @Get()
  findAll(@Query() query: QueryProductDto) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(+id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  // Bulk endpoints
  @Post('bulk')
  @UseGuards(JwtAuthGuard)
  createMany(@Body() dtos: CreateProductDto[]) {
    return this.productsService.createMany(dtos);
  }

  @Delete('bulk/delete')
  @UseGuards(JwtAuthGuard)
  deleteMany(@Body('ids') ids: number[]) {
    return this.productsService.deleteMany(ids);
  }

  @Patch('bulk/update')
  @UseGuards(JwtAuthGuard)
  updateMany(@Body('ids') ids: number[], @Body('data') dto: UpdateProductDto) {
    return this.productsService.updateMany(ids, dto);
  }
}
