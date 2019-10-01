export class Result<T> {
  isSuccess: boolean;
  isFailure: boolean;
  error: string | null;
  private _value: T | undefined;

  private constructor(isSuccess: boolean, error: string | null, value?: T) {
    if (isSuccess && error) {
      throw new Error("Result cannot be both successful and contain an error");
    }

    if (!isSuccess && !error) {
      throw new Error("Failing Result must contain an error");
    }

    if (isSuccess && !value) {
      throw new Error("successful result must contain a value");
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
    this._value = value;

    Object.freeze(this);
  }

  getValue(): T {
    if (this.isFailure) {
      throw new Error("cannot retrieve from failed result");
    }

    if (this._value == undefined) {
      throw new Error("cannot retrieve from undefined value");
    }

    return this._value;
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, null, value);
  }

  public static fail<U>(error: string): Result<U> {
    return new Result<U>(false, error);
  }

  public static combine(results: Result<any>[]): Result<any> {
    for (let r of results) {
      if (r.isFailure) return r;
    }
    return Result.ok<any>();
  }

  public static unwrap<T>(r: Result<T>): T {
    return r.getValue();
  }
}
