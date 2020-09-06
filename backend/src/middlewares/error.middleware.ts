import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptions';

const errorMiddleware = (error: HttpException, request: any, response: Response, next: NextFunction) => {
  console.log('\n ------ inside error middleware: ', error.message);
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';
  return response
    .status(status)
    .send({
      message,
      status,
    });
}

export default errorMiddleware;
