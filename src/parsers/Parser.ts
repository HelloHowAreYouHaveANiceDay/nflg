import { Result } from "../core/Result";

export interface Parser<R, V> {
  (raw: R): Result<V>;
}
