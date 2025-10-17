declare module "npm-api" {
  export interface NPMRepo {
    version: string;
    description: string;
  }

  export default class NPM {
    repo(name: string): {
      package(): Promise<NPMRepo>;
    };
  }
}
