class AppError extends Error {
  public statusCode: number;
  /**
   * @param statusCode custom status code
   * @param message custom error message
   * @param stack error stack (optional)
   */
  constructor(statusCode: number, message: string, stack = "") {
    super(message);
    this.statusCode = statusCode;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
