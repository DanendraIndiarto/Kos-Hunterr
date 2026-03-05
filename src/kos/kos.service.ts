import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Gender } from '@prisma/client';
import { CreateKosDto } from './dto/create-kos.dto';
import { UpdateKosDto } from './dto/update-kos.dto';
import type { Express } from 'express';

@Injectable()
export class KosService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateKosDto, userId: number, file?: Express.Multer.File) {
    const facilitiesArray = dto.facilities
      ? dto.facilities.split(',').map((f) => f.trim())
      : [];

    return this.prisma.kos.create({
      data: {
        name: dto.name,
        address: dto.address,
        price_per_month: dto.price_per_month,
        gender: dto.gender,
        user_id: userId,

        images: file
          ? {
              create: { file: file.filename },
            }
          : undefined,

        facilities: facilitiesArray.length
          ? {
              create: facilitiesArray.map((f) => ({
                facility: f,
              })),
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
    const data: any = {};

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (dto.name) data.name = dto.name;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (dto.address) data.address = dto.address;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (dto.price_per_month) data.price_per_month = dto.price_per_month;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (dto.gender) data.gender = dto.gender;
    // update kos utama
    await this.prisma.kos.update({
      where: { id },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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

    if (dto.facilities) {
      const facilitiesArray =
        typeof dto.facilities === 'string'
          ? (dto.facilities as string).split(',').map((f) => f.trim())
          : dto.facilities;

      await this.prisma.kosFacility.deleteMany({
        where: { kos_id: id },
      });

      await this.prisma.kosFacility.createMany({
        data: facilitiesArray.map((f) => ({
          kos_id: id,
          facility: f,
        })),
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

  remove(id: number) {
    return this.prisma.kos.delete({
      where: { id },
    });
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
