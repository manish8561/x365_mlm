class ResponseHelper {
  public success(response: any, responseData: any = {}) {
    return response.status(200).send(responseData);
  }
  public error(response: any, error: any) {
    let { message, statusCode, stack } = error;
    statusCode = statusCode || 400;
    // console.log(stack);
    return response.status(statusCode).send({ error: { statusCode, message } });
  }
}
export default new ResponseHelper();
