import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';

import { AppController } from './app.controller';
import UserResolver from './resolvers/user.resolver';
import MessageResolver from './resolvers/message.resolver';
import * as OrmConfig from './config/orm';
import RepoModule from './repo.module';
import { AppService } from './app.service';

const gqlImports =[
  UserResolver,
  MessageResolver, 
];

@Module({
  imports: [TypeOrmModule.forRoot(OrmConfig), 
    RepoModule, 
    ...gqlImports,
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      playground: true,
      installSubscriptionHandlers: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {};
