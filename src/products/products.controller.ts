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
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryProductDto) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(+id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  // Bulk endpoints
  @UseGuards(JwtAuthGuard)
  @Post('bulk')
  createMany(@Body() dtos: CreateProductDto[]) {
    return this.productsService.createMany(dtos);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('bulk/delete')
  deleteMany(@Body('ids') ids: number[]) {
    return this.productsService.deleteMany(ids);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('bulk/update')
  updateMany(@Body('ids') ids: number[], @Body('data') dto: UpdateProductDto) {
    return this.productsService.updateMany(ids, dto);
  }
}
