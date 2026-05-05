import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-reviw.dto';
import { ReplyReviewDto } from './dto/reply-reviw.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Role } from '@prisma/client';

interface RequestWithUser extends Request {
  user: {
    id: number;
    email: string;
    role: string;
  };
}

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewsService: ReviewService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req: RequestWithUser, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(req.user.id, dto);
  }

  @Put('reply/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  reply(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: ReplyReviewDto,
  ) {
    return this.reviewsService.reply(req.user, Number(id), dto);
  }

  @Get('kos/:kosId')
  findByKos(@Param('kosId') kosId: string) {
    return this.reviewsService.findByKos(Number(kosId));
  }
}
