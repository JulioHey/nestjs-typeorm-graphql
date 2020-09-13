import { Field, ObjectType } from '@nestjs/graphql';
import { 
    Column,
    CreateDateColumn,
    Entity,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
    BaseEntity,
    OneToMany,
} from 'typeorm';
import Message from './message.entity';

@ObjectType()
@Entity({ name: 'users' })
export default class User extends BaseEntity{
    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    email: string;

    @Field()
    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @Field()
    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @OneToMany(
        () => Message,
        message => message.userConnection,
    )
    messageConnection: Promise<Message[]>;
} 