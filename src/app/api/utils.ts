import NPM from "npm-api";
import { getTerm } from "~/lib/urban";

const npm = new NPM();

export async function get(term?: string) {
  const urban = await getTerm(term);

  const repo = npm.repo(urban.parsed);

  try {
    const npm = await repo.package();

    return {
      npm,
      urban,
    };
  } catch (error) {
    console.error(error);

    return {
      npm: {},
      urban,
    };
  }
}
