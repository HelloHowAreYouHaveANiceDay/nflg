import { Result } from "./Result";
export interface Endpoint {
  url: string;
  execute(): Promise<Result<any>>;
}
