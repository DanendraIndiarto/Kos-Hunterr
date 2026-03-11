/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import type { Response } from 'express';

interface Booking {
  id: number | string;
  start_date?: Date;
  end_date?: Date;
  status?: string;
  user?: {
    name?: string;
    email?: string;
  };
  kos?: {
    name?: string;
    price_per_month?: number;
    images?: {
      file: string;
    }[];
    facilities?: {
      facility: string;
    }[];
  };
}

@Injectable()
export class PdfService {
  generate(res: Response, booking: Booking) {
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename=nota-booking-${booking.id}.pdf`,
    );

    doc.pipe(res);

    doc.fontSize(20).text('NOTA BOOKING KOS', {
      align: 'center',
    });

    doc.moveDown();

    doc.fontSize(14).text(`ID Booking : ${booking.id}`);
    doc.text(`Nama User : ${booking.user?.name ?? '-'}`);
    doc.text(`Email : ${booking.user?.email ?? '-'}`);
    doc.text(`Nama Kos : ${booking.kos?.name ?? '-'}`);
    doc.text(`Harga / bulan : ${booking.kos?.price_per_month ?? '-'}`);
    const facilities =
      booking.kos?.facilities?.map((f) => f.facility).join(', ') ?? '-';

    doc.text(`Fasilitas : ${facilities}`);

    const image =
      booking.kos?.images && booking.kos.images.length > 0
        ? booking.kos.images[0].file
        : '-';

    doc.image(`KosImage/${image}`, {
      fit: [250, 200],
      align: 'center',
    });
    doc.moveDown(2); // memberi jarak antar paragraf
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    doc.text(`Tanggal Mulai : ${booking.start_date ?? '-'}`);
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    doc.text(`Tanggal Selesai : ${booking.end_date ?? '-'}`);
    doc.text(`Status : ${booking.status ?? '-'}`);

    doc.moveDown();
    doc.text(`Tanggal Cetak : ${new Date().toLocaleString()}`);

    doc.end();
  }
}
