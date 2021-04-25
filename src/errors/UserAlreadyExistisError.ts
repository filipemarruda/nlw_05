class UserAlreadyExistisError extends Error {
  constructor(message) {
    super(message);
    this.name = "UserAlreadyExistisError";
    Object.setPrototypeOf(this, UserAlreadyExistisError.prototype);
    Error.captureStackTrace(this, UserAlreadyExistisError);
  }
}

export { UserAlreadyExistisError };
