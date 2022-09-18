import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { AUTHOR } from 'src/commons/type/enum';

registerEnumType(AUTHOR, {
  name: 'AUTHOR',
});

@ObjectType()
export class ChatList {
  @Field(() => AUTHOR)
  author: AUTHOR;

  @Field(() => String)
  nickname: string;

  @Field(() => String)
  message: string;

  @Field(() => Date)
  createdAt: Date;
}
