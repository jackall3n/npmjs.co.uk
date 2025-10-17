import removeAccents from "remove-accents";
import urban, { type UrbanResponse } from "urban";

export const getParsed = (term: string) =>
  removeAccents(term.trim())
    .toLowerCase()
    .replace(/[^0-9a-z- ]/gm, "")
    .replace(/[ ]/gm, "-");

export interface Term extends UrbanResponse {
  parsed: string;
}

export async function getTerm(term?: string) {
  return new Promise<Term>((resolve) => {
    const caller = term ? urban(term) : urban.random();

    caller.first((json) => {
      resolve({
        parsed: getParsed(json.word),
        ...json,
      });
    });
  });
}
