import { Module } from '@nestjs/common';
import { OrderService } from './services';
import { OrderController } from './order.controller';
import { CartService } from '../cart/services';
import { DatabaseService } from '../cart/services/database.service';

@Module({
  providers: [OrderService, CartService, DatabaseService],
  exports: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
