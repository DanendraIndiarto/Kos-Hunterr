/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Gender } from '@prisma/client';

@Injectable()
export class KosService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.kos.create({ data });
  }

  findAll() {
    return this.prisma.kos.findMany();
  }

  update(id: number, data: any) {
    return this.prisma.kos.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.kos.delete({
      where: { id },
    });
  }

  // 🔥 FILTER CERDAS
  findByGender(gender: Gender) {
    if (gender === Gender.ALL) {
      return this.prisma.kos.findMany();
    }

    return this.prisma.kos.findMany({
      where: {
        OR: [{ gender }, { gender: Gender.ALL }],
      },
    });
  }
}
