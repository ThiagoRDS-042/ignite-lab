import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';

interface CreatePurchase {
  customerId: string;
  productId: string;
}

@Injectable()
export class PurchasesService {
  constructor(private readonly prismaService: PrismaService) {}

  listAllPurchases() {
    return this.prismaService.purchase.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async createPurchase({ customerId, productId }: CreatePurchase) {
    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prismaService.purchase.create({
      data: {
        customerId,
        productId,
      },
    });
  }
}
