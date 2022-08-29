import { Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  // interface 구성
  catch(exception: any) {
    const status = exception.getStatus();
    const message = exception.message;

    console.log('-------------------');
    console.log('Exception Occur');
    console.log('message: ', message);
    console.log('status code: ', status);
    console.log('-------------------');
  }
}
