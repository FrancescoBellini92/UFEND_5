export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class NotValidInputError extends Error {
  name = "NotValidInputError";
  constructor(msg: string) {
    super(msg);
  }
}
