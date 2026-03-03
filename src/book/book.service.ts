import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookService {
  constructor(private readonly prisma: PrismaService) {}

  // ✅ CREATE BOOKING
  create(data: any) {
    return this.prisma.book.create({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data,
    });
  }

  // ✅ GET ALL BOOKING
  findAll() {
    return this.prisma.book.findMany({
      include: {
        user: true,
        kos: true,
      },
    });
  }

  // ✅ GET BY ID (untuk generate PDF)
  findById(id: number) {
    return this.prisma.book.findUnique({
      where: { id },
      include: {
        user: true,
        kos: true,
      },
    });
  }

  // ✅ HISTORY BY MONTH
  findByMonth(month: number, year: number) {
    return this.prisma.book.findMany({
      where: {
        createdAt: {
          gte: new Date(year, month - 1, 1),
          lt: new Date(year, month, 1),
        },
      },
      include: {
        user: true,
        kos: true,
      },
    });
  }
}
