declare module "urban" {
  export interface UrbanResponse {
    word: string;
    definition: string;
    example: string;
  }

  export interface UrbanCaller {
    first(callback: (response: UrbanResponse) => void): void;
  }

  interface UrbanFunction {
    (term: string): UrbanCaller;
    random(): UrbanCaller;
  }

  declare const urban: UrbanFunction;

  export default urban;
}
