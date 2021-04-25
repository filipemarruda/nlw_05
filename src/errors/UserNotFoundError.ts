class UserNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "UserNotFoundError";
    Object.setPrototypeOf(this, UserNotFoundError.prototype);
    Error.captureStackTrace(this, UserNotFoundError);
  }
}

export { UserNotFoundError };
