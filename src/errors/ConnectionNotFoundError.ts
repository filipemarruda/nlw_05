class ConnectionNotFoundError extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, ConnectionNotFoundError.prototype);
    Error.captureStackTrace(this, ConnectionNotFoundError);
  }
}
export { ConnectionNotFoundError };
