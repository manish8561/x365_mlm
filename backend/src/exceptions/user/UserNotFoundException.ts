import HttpException from '../HttpException';

class UserNotFoundException extends HttpException {
  constructor(status: number, message: string) {
    super(status, message);
  }
}

export default UserNotFoundException;
