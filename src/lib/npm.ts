export interface Package {
  name: string;
  version: string;
  description: string;
  readme: string;
  homepage: string;
  "dist-tags": {
    latest: string;
  };
}

export async function getPackage(name: string): Promise<Package> {
  const response = await fetch(`https://registry.npmjs.org/${name}`);
  const data = await response.json();

  return {
    ...data,
    version: data["dist-tags"].latest,
  };
}
