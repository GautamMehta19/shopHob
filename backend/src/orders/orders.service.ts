import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { ProductsService } from '../products/products.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    private productsService: ProductsService,
    private notificationsGateway: NotificationsGateway,
  ) { }

  async create(createOrderDto: CreateOrderDto, userId: number): Promise<Order> {
    let total = 0;
    const orderItems: OrderItem[] = [];

    // Validate stock and calculate total
    for (const item of createOrderDto.items) {
      const product = await this.productsService.findOne(item.productId);

      if (product.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for product ${product.name}`);
      }

      const orderItem = new OrderItem();
      orderItem.productId = item.productId;
      orderItem.quantity = item.quantity;
      orderItem.price = product.price;
      orderItems.push(orderItem);

      total += product.price * item.quantity;
    }

    // Create order
    const order = new Order();
    order.userId = userId;
    order.total = total;
    order.items = orderItems;

    const savedOrder = await this.ordersRepository.save(order);

    // Update stock
    for (const item of createOrderDto.items) {
      await this.productsService.updateStock(item.productId, item.quantity);
    }

    // Send real-time notification
    this.notificationsGateway.sendOrderNotification({
      orderId: savedOrder.id,
      userId,
      total,
      status: 'New order placed',
    });

    return this.findOne(savedOrder.id);
  }

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find({
      relations: ['items', 'items.product', 'user'],
    });
  }

  async findByUser(userId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { userId },
      relations: ['items', 'items.product'],
    });
  }

  async findOne(id: number): Promise<Order> {
    return this.ordersRepository.findOne({
      where: { id },
      relations: ['items', 'items.product', 'user'],
    });
  }

  async updateOrder(orderId: number, updateData: Partial<Order>, userId: number): Promise<Order> {
    const existingOrder = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product', 'user'],
    });

    if (!existingOrder) {
      throw new BadRequestException('Order not found');
    }

    // Ensure user owns this order
    if (existingOrder.user.id !== userId) {
      throw new BadRequestException('Unauthorized: not your order');
    }

    // Only allow cancel if status is pending or processing
    if (
      updateData.status === 'cancelled' &&
      ['pending', 'processing'].includes(existingOrder.status)
    ) {
      existingOrder.status = updateData.status;
    } else if (updateData.status && updateData.status !== 'cancelled') {
      throw new BadRequestException('You can only cancel your order');
    }

    const updatedOrder = await this.ordersRepository.save(existingOrder);

    this.notificationsGateway.sendOrderNotification({
      orderId: updatedOrder.id,
      userId: existingOrder.user.id,
      total: updatedOrder.total,
      status: updatedOrder.status,
    });

    return updatedOrder;
  }


}