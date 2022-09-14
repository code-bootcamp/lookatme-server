import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UsersModule } from './apis/user/users.module';
import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { AuthsModule } from './apis/auth/auths.module';
import { FileModule } from './apis/file/files.module';
import { AdminsModule } from './apis/admin/admins.module';
import { IamportsModule } from './apis/iamport/iamports.module';
import { PaymentsModule } from './apis/payment/payments.module';
import { ChatsModule } from './apis/chat/chats.module';
import { SpecialistModule } from './apis/specialist/specialists.module';
import { QuoteModule } from './apis/quote/quotes.module';
import { BatchesModule } from './apis/batch/batches.module';
import { StroyModule } from './apis/story/stories.module';
import { CommentsModule } from './apis/comment/comments.module';
import { TicketsModule } from './apis/ticket/tickets.module';
import { SpcialistCommentsModule } from './apis/specialistComment/specialistComments.module';

@Module({
  imports: [
    AdminsModule,
    AuthsModule,
    BatchesModule,
    ChatsModule,
    CommentsModule,
    FileModule,
    IamportsModule,
    PaymentsModule,
    UsersModule,
    SpecialistModule,
    StroyModule,
    SpcialistCommentsModule,
    TicketsModule,
    QuoteModule,
    ConfigModule.forRoot({
      // to read .env files
      isGlobal: true, // globalize .env file so that every files can use .env
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }), // enable to use graphql req, res
      cors: {
        origin: [process.env.CLIENT_DOMAIN, process.env.LOCALHOST_DOMAIN],
        methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: [
          'Access-Control-Allow-Headers',
          'Authorization',
          'X-Requested-With',
          'Content-Type',
          'Accept',
        ],
        credentials: true,
      },
    }),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true, //SQL query will be displayed on terminal
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore, // type of storage
      url: `redis://${process.env.REDIS_IP}:${process.env.REDIS_PORT}`,
      isGlobal: true,
    }),
  ],
  controllers: [AppController], // health cheacking
})
export class AppModule {}
