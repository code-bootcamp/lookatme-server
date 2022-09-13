import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { FileService } from './files.service';

@Resolver()
export class FileResolver {
  constructor(
    private readonly fileService: FileService, //
  ) {}

  @Mutation(() => String, { description: '이미지 업로드 API' })
  uploadFile(
    @Args({ name: 'file', type: () => [GraphQLUpload] }) file: FileUpload[],
  ) {
    return this.fileService.uploadImage({ file });
  }
}
