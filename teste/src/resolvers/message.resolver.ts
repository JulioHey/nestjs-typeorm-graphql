import { 
    Args, 
    Mutation, 
    Query, 
    Resolver, 
    Parent, 
    ResolveField, Subscription
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import RepoService from '../repo.service';
import {MessageInput, DeleteMessageInput } from './input/message.input';
import Message from 'src/db/models/message.entity'
import User from 'src/db/models/user.entity';
import { response } from 'express';

export const pubSub = new PubSub();

@Resolver(() => Message)
export default class MessageResolver {
   constructor(private readonly repoService: RepoService) {}

  @Query(() => [Message])
  public async getMessages(): Promise<Message[]> {
    return this.repoService.messageRepo.find();
  }

  @Query(() => [Message])
  public async getMessagesFromUser(@Args('userId') userId: number): Promise<Message[]> {
    return  this.repoService.messageRepo.find({
        where: { userId }
    });
  }

  @Query(() => Message, { nullable: true })
  public async getMessage(@Args('id') id: number): Promise<Message> {
      return this.repoService.messageRepo.findOne(id);
  }

  @Mutation(() => Message)
  public async createMessage(@Args('data') input: MessageInput): 
    Promise<Message> {
      const message = this.repoService.messageRepo.create(
          {
              content: input.content,
              userId: input.userId,
          },
        );
        
        const response = await this.repoService.messageRepo.save(message);

        pubSub.publish('messageAdded', {messageAdded: message});

        return response;
  }

  @Mutation(() => Message, { nullable: true})
  public async deleteMessage(@Args('data') input: DeleteMessageInput): 
    Promise<Message> {
      const message = await this.repoService.messageRepo.findOne(input.id);

      if (message.userId !== input.userId) return null

      if (!message) {
        return null;
      }

      return this.repoService.messageRepo.remove(message);
  }

  @Subscription(() => Message)
  messageAdded() {
    return pubSub.asyncIterator('messageAdded');
  }

  @ResolveField(() => User, {name: 'user'})
  public async getUser(@Parent() parent: Message): Promise<User> {
    return this.repoService.userRepo.findOne(parent.userId);
  }
}
