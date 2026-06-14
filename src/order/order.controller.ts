import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BasicAuthGuard } from '../auth';
import { AppRequest, getUserIdFromRequest } from '../shared';
import { CartService } from '../cart/services';
import { calculateCartTotal } from '../cart/models-rules';

@Controller('api/order')
export class OrderController {
  constructor(private cartService: CartService) {}

  @UseGuards(BasicAuthGuard)
  @Get()
  async getOrders(@Req() req: AppRequest) {
    const userId = getUserIdFromRequest(req);
    return this.cartService.getOrdersByUserId(userId);
  }

  @UseGuards(BasicAuthGuard)
  @Put()
  async createOrder(@Req() req: AppRequest, @Body() body: any) {
    const userId = getUserIdFromRequest(req);
    const cart = await this.cartService.findByUserId(userId);
    const total = calculateCartTotal(cart.items);
    await this.cartService.checkout(userId, total, body.address, body.address?.comment);
    return { message: 'Order created', total };
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body() body: any) {
    return this.cartService.updateOrderStatus(id, body.status);
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  async deleteOrder(@Param('id') id: string) {
    return this.cartService.deleteOrder(id);
  }
}
