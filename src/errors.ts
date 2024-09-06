export class CustomHttpError extends Error {
  public code: number;
  public additionalInfo?: string;

  constructor(code: number, message: string, additionalInfo?: string) {
    super(message);
    this.code = code;
    this.additionalInfo = additionalInfo;
  }
}
