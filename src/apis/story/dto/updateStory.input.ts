import { InputType, PartialType } from '@nestjs/graphql';
import { CreateStoryInput } from './createStory.input';

@InputType()
export class UpdateStoryInput extends PartialType(CreateStoryInput) {}
