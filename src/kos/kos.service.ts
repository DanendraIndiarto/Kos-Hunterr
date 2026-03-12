import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Gender, Prisma } from '@prisma/client';
import { CreateKosDto } from './dto/create-kos.dto';
import { UpdateKosDto } from './dto/update-kos.dto';
import type { Express } from 'express';

@Injectable()
export class KosService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateKosDto, userId: number, file?: Express.Multer.File) {
    return this.prisma.kos.create({
      data: {
        name: dto.name,
        address: dto.address,
        price_per_month: dto.price_per_month,
        gender: dto.gender,
        user_id: userId,

        images: file
          ? {
              create: {
                file: file.filename,
              },
            }
          : undefined,
      },
      include: {
        owner: true,
        images: true,
        facilities: true,
      },
    });
  }

  findAll() {
    return this.prisma.kos.findMany({
      include: {
        owner: true,
        images: true,
        facilities: true,
      },
    });
  }

  async update(id: number, dto: UpdateKosDto, file?: Express.Multer.File) {
    const data: Prisma.KosUpdateInput = {};

    if (dto.name !== undefined) data.name = dto.name;
    if (dto.address !== undefined) data.address = dto.address;
    if (dto.price_per_month !== undefined)
      data.price_per_month = dto.price_per_month;
    if (dto.gender !== undefined) data.gender = dto.gender;

    await this.prisma.kos.update({
      where: { id },
      data,
    });

    if (file) {
      await this.prisma.kosImage.deleteMany({
        where: { kos_id: id },
      });

      await this.prisma.kosImage.create({
        data: {
          kos_id: id,
          file: file.filename,
        },
      });
    }

    return this.prisma.kos.findUnique({
      where: { id },
      include: {
        images: true,
        facilities: true,
      },
    });
  }

  async remove(id: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.prisma.$transaction([
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      this.prisma.images.deleteMany({
        where: { kos_id: id },
      }),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      this.prisma.facilities.deleteMany({
        where: { kos_id: id },
      }),
      this.prisma.kos.delete({
        where: { id },
      }),
    ]);
  }

  findByGender(gender: Gender) {
    if (gender === Gender.ALL) {
      return this.prisma.kos.findMany({
        include: {
          images: true,
          facilities: true,
        },
      });
    }

    return this.prisma.kos.findMany({
      where: {
        OR: [{ gender }, { gender: Gender.ALL }],
      },
      include: {
        images: true,
        facilities: true,
      },
    });
  }
}
