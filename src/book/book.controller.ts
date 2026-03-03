import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Res,
  Query,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import type { Response } from 'express';

import { BookService } from './book.service';
import { PdfService } from './pdf.service';

@Controller('book')
export class BookController {
  constructor(
    private readonly bookService: BookService,
    private readonly pdfService: PdfService,
  ) {}

  // 📌 CREATE BOOKING
  @Post()
  create(@Body() body: any) {
    return this.bookService.create(body);
  }

  // 📌 GET ALL BOOKING
  @Get()
  findAll() {
    return this.bookService.findAll();
  }

  // 📆 HISTORY BY MONTH & YEAR
  @Get('history')
  history(@Query('month') month: string, @Query('year') year: string) {
    if (!month || !year) {
      throw new BadRequestException('Month dan Year wajib diisi');
    }

    return this.bookService.findByMonth(Number(month), Number(year));
  }

  // 🧾 GENERATE PDF NOTA
  @Get('nota/:id')
  async generate(@Param('id') id: string, @Res() res: Response) {
    const booking = await this.bookService.findById(Number(id));

    if (!booking) {
      throw new NotFoundException('Booking tidak ditemukan');
    }

    return this.pdfService.generate(res, booking);
  }
}
