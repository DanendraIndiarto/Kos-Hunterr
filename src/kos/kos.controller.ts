import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseEnumPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import { Gender } from '@prisma/client';

import { KosService } from './kos.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateKosDto } from './dto/create-kos.dto';
import { multerConfig } from './multer.config';

@Controller('kos')
export class KosController {
  constructor(private readonly kosService: KosService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  create(@Body() dto: CreateKosDto) {
    return this.kosService.create(dto);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  upload(@UploadedFile() file: Express.Multer.File) {
    return {
      message: 'Upload berhasil',
      filename: file.filename,
    };
  }

  @Get()
  findAll() {
    return this.kosService.findAll();
  }

  // ✅ FIXED ENUM FILTER
  @Get('filter/:gender')
  filter(
    @Param('gender', new ParseEnumPipe(Gender))
    gender: Gender,
  ) {
    return this.kosService.findByGender(gender);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  update(@Param('id') id: string, @Body() dto: CreateKosDto) {
    return this.kosService.update(Number(id), dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  remove(@Param('id') id: string) {
    return this.kosService.remove(Number(id));
  }
}
