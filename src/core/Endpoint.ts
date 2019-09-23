import { Result } from "./Result";
export interface Endpoint {
  url: string;
  execute(params?: any): Promise<Result<any>>;
}
