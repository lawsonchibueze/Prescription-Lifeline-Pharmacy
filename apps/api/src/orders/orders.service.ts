import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentsService } from '../payments/payments.service';
import { CreateOrderDto } from './dto/create-order.dto';

const ORDER_INCLUDE = {
  items: { include: { product: true } },
} as const;

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentsService: PaymentsService,
  ) {}

  async create(userId: string, dto: CreateOrderDto) {
    // Merge duplicate productId entries so "add 1, then add 1 more" style
    // client payloads can't double-count or bypass the stock check below.
    const quantitiesByProduct = new Map<string, number>();
    for (const item of dto.items) {
      quantitiesByProduct.set(
        item.productId,
        (quantitiesByProduct.get(item.productId) ?? 0) + item.quantity,
      );
    }

    const products = await this.prisma.product.findMany({
      where: { id: { in: [...quantitiesByProduct.keys()] } },
    });

    for (const [productId, quantity] of quantitiesByProduct) {
      const product = products.find((p) => p.id === productId);
      if (!product || !product.isActive) {
        throw new BadRequestException(`Product ${productId} is not available`);
      }
      if (product.stock < quantity) {
        throw new BadRequestException(
          `Not enough stock for "${product.name}" (requested ${quantity}, have ${product.stock})`,
        );
      }
    }

    // Price is always taken from the database, never from the client, so a
    // tampered request can't check out at an arbitrary price.
    const totalKobo = products.reduce((sum, product) => {
      const quantity = quantitiesByProduct.get(product.id) ?? 0;
      return sum + product.priceKobo * quantity;
    }, 0);

    const paymentReference = `plp_${randomUUID()}`;

    const order = await this.prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          userId,
          totalKobo,
          paymentReference,
          shippingName: dto.shippingName,
          shippingPhone: dto.shippingPhone,
          shippingAddress: dto.shippingAddress,
          shippingCity: dto.shippingCity,
          shippingState: dto.shippingState,
          items: {
            create: [...quantitiesByProduct.entries()].map(
              ([productId, quantity]) => {
                const product = products.find((p) => p.id === productId)!;
                return {
                  productId,
                  quantity,
                  unitPriceKobo: product.priceKobo,
                };
              },
            ),
          },
        },
        include: ORDER_INCLUDE,
      });

      for (const [productId, quantity] of quantitiesByProduct) {
        await tx.product.update({
          where: { id: productId },
          data: { stock: { decrement: quantity } },
        });
      }

      return created;
    });

    const checkout = await this.paymentsService.initializeCheckoutForOrder();

    return { order, checkout };
  }

  findMine(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: ORDER_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findMineById(userId: string, id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: ORDER_INCLUDE,
    });
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }
    if (order.userId !== userId) {
      throw new ForbiddenException();
    }
    return order;
  }

  findAllAdmin() {
    return this.prisma.order.findMany({
      include: {
        ...ORDER_INCLUDE,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async findOneAdmin(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        ...ORDER_INCLUDE,
        user: { select: { id: true, name: true, email: true } },
      },
    });
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }
    return order;
  }
}
