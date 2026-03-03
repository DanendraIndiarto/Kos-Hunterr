import { Controller, Post, Get, Body } from '@nestjs/common';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Post()
  create(@Body() body: any) {
    return this.reviewService.create(body);
  }

  @Get()
  findAll() {
    return this.reviewService.findAll();
  }
}
