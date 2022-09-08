import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Story } from 'src/apis/story/entities/story.entity';
import { CATEGORY_NAME } from 'src/commons/type/enum';

registerEnumType(CATEGORY_NAME, {
  name: 'CATEGORY_NAME',
});

@Entity()
@ObjectType()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'enum', enum: CATEGORY_NAME, nullable: false })
  @Field(() => String)
  name: string;

  @Column({ type: 'int', unsigned: true, nullable: false })
  @Field(() => Int)
  number: number;

  @OneToMany(() => Story, (story) => story.category)
  @Field(() => Story)
  story: Story;
}
