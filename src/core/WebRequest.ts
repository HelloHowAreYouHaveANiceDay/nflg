export interface WebRequest {
  get(url: string): Promise<any>;
}
