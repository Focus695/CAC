import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get reviews for a product' })
  getProductReviews(@Param('productId') productId: string) {
    return this.reviewsService.getProductReviews(productId);
  }
}

