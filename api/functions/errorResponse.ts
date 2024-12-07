/** @format */

export class ErrorResponse extends Error {
  statusCode: number;

  constructor(data: {
    code: number;
    message: string;
    name?: string;
  }) {
    super(data.message);
    this.statusCode = data.code;
    this.name = data.name || "Error";
  }
}

export function customError(
  code: number,
  message: string,
  name?: string
) {
  const error = new ErrorResponse({ code, message, name });

  throw error;
}
