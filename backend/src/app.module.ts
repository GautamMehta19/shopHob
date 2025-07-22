// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import { AuthModule } from './auth/auth.module';
// import { UsersModule } from './users/users.module';
// import { ProductsModule } from './products/products.module';
// import { OrdersModule } from './orders/orders.module';
// import { NotificationsModule } from './notifications/notifications.module';
// import { User } from './users/entities/user.entity';
// import { Product } from './products/entities/product.entity';
// import { Order } from './orders/entities/order.entity';
// import { OrderItem } from './orders/entities/order-item.entity';

// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'sqlite',
//       database: 'ecommerce.db',
//       entities: [User, Product, Order, OrderItem],
//       synchronize: true,
//     }),
//     PassportModule,
//     JwtModule.register({
//       secret: 'your-secret-key',
//       signOptions: { expiresIn: '24h' },
//     }),
//     AuthModule,
//     UsersModule,
//     ProductsModule,
//     OrdersModule,
//     NotificationsModule,
//   ],
// })
// export class AppModule {}


import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { NotificationsModule } from './notifications/notifications.module';

import { User } from './users/entities/user.entity';
import { Product } from './products/entities/product.entity';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/order-item.entity';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, Product, Order, OrderItem],
      synchronize: process.env.NODE_ENV === 'production' ? false : true,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    }),

    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),

    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    NotificationsModule,
  ],
  controllers: [AppController]
})
export class AppModule { }
