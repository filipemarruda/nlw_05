class SettingNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "SettingNotFoundError";
    Object.setPrototypeOf(this, SettingNotFoundError.prototype);
    Error.captureStackTrace(this, SettingNotFoundError);
  }
}
export { SettingNotFoundError };
