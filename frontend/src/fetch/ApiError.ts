export class ApiError extends Error {
  public status: number;
  public errors: { [key: string]: string } | null;

  constructor(
    status: number,
    msg: string,
    errors: { [key: string]: string } | null = null,
  ) {
    super(msg);
    this.status = status;
    this.errors = errors;
  }
}
