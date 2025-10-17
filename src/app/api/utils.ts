import { getPackage } from "~/lib/npm";
import { getTerm } from "~/lib/urban";

export async function get(term?: string | null) {
  const urban = await getTerm(term);

  try {
    const npm = await getPackage(urban.parsed);

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
