import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UsersModule } from './apis/users/users.module';
import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { AuthsModule } from './apis/auth/auths.module';
import { ProductModule } from './apis/products/product.module';
import { FileModule } from './apis/file/file.module';
import { AdminsModule } from './apis/admin/admins.module';

@Module({
  imports: [
    AdminsModule,
    AuthsModule,
    FileModule,
    ProductModule,
    UsersModule,
    ConfigModule.forRoot({
      // to read .env files
      isGlobal: true, // globalize .env file so that every files can use .env
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }), // enable to use graphql req, res
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
      url: 'redis://my-redis:6379', // access to redis of docker using name resolution
      isGlobal: true, // able to use on every modules
    }),
  ],
  controllers: [AppController], // health cheacking
})
export class AppModule {}
