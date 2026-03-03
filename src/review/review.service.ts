import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return this.prisma.review.create({ data });
  }

  findAll() {
    return this.prisma.review.findMany();
  }
}
