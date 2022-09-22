import { ConflictException, Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from 'src/database/prisma/prisma.service';

interface createProductParams {
  title: string;
}

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  listAllProducts() {
    return this.prismaService.product.findMany();
  }

  getProductById(id: string) {
    return this.prismaService.product.findUnique({ where: { id } });
  }

  async createProduct({ title }: createProductParams) {
    const slug = slugify(title, { lower: true });

    const productWithSameSlug = await this.prismaService.product.findUnique({
      where: {
        slug,
      },
    });

    console.log(productWithSameSlug);

    if (productWithSameSlug) {
      throw new ConflictException(
        productWithSameSlug,
        'Another product with same slug already exists',
      );
    }

    return this.prismaService.product.create({
      data: {
        title,
        slug,
      },
    });
  }
}
