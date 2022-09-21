import { Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any) {
    const status = exception.getStatus();
    const message = exception.message;
    // 배포때 콘솔 지우기
    // console.log('-------------------');
    // console.log('Exception Occur');
    // console.log('message: ', message);
    // console.log('status code: ', status);
    // console.log('-------------------');
  }
}
