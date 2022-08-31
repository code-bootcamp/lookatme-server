import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { GenderDefault } from 'src/commons/type/enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

registerEnumType(GenderDefault, {
  name: 'GenderDefault',
});

@Entity()
@ObjectType()
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  @Field(() => String)
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 10, unique: true, nullable: false })
  @Field(() => String)
  nickname: string;
}
