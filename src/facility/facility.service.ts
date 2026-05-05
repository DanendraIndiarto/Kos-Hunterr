import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFacilityDto } from './dto/create-facility.dto';

@Injectable()
export class FacilityService {
  constructor(private prisma: PrismaService) {}

  async addFacility(kosId: number, dto: CreateFacilityDto) {
    const facilities = (dto.facility ?? '')
      .split(',')
      .map((f) => f.trim())
      .filter((f) => f);

    await this.prisma.kosFacility.createMany({
      data: facilities.map((f) => ({
        kos_id: kosId,
        facility: f,
      })),
    });

    // ambil data setelah insert
    return this.prisma.kosFacility.findMany({
      where: { kos_id: kosId },
      select: {
        id: true,
        kos_id: true,
        facility: true,
      },
    });
  }

  getFacilities(kosId: number) {
    return this.prisma.kosFacility.findMany({
      where: { kos_id: kosId },
      select: {
        id: true,
        kos_id: true,
        facility: true,
      },
    });
  }

  async updateFacilities(kosId: number, dto: CreateFacilityDto) {
    const newFacilities = (dto.facility ?? '')
      .split(',')
      .map((f) => f.trim())
      .filter((f) => f);

    const existing = await this.prisma.kosFacility.findMany({
      where: { kos_id: kosId },
    });

    const existingNames = existing.map((f) => f.facility);

    // tambah yang belum ada
    const toAdd = newFacilities.filter((f) => !existingNames.includes(f));

    // hapus yang tidak ada di input baru
    const toDelete = existing.filter(
      (f) => !newFacilities.includes(f.facility),
    );

    await this.prisma.$transaction(async (prisma) => {
      if (toDelete.length > 0) {
        await prisma.kosFacility.deleteMany({
          where: {
            id: { in: toDelete.map((f) => f.id) },
          },
        });
      }

      if (toAdd.length > 0) {
        await prisma.kosFacility.createMany({
          data: toAdd.map((f) => ({
            kos_id: kosId,
            facility: f,
          })),
        });
      }
    });

    return this.prisma.kosFacility.findMany({
      where: { kos_id: kosId },
    });
  }

  async deleteFacilities(kosId: number) {
    return this.prisma.kosFacility.deleteMany({
      where: { kos_id: kosId },
    });
  }
}
