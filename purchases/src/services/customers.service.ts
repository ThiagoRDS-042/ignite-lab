import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';

interface createCustomerParams {
  authUserId: string;
}

@Injectable()
export class CustomersService {
  constructor(private readonly prismaService: PrismaService) {}

  getCustomerByAuthUserId(authUserId: string) {
    return this.prismaService.customer.findUnique({ where: { authUserId } });
  }

  async createCustomer({ authUserId }: createCustomerParams) {
    return this.prismaService.customer.create({
      data: {
        authUserId,
      },
    });
  }
}
