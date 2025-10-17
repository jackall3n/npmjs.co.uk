import NPM from "npm-api";
import urban from "urban";
import removeAccents from "remove-accents";

const npm = new NPM();

export const getParsed = (term: string) =>
  removeAccents(term.trim())
    .toLowerCase()
    .replace(/[^0-9a-z- ]/gm, "")
    .replace(/[ ]/gm, "-");

export const get = async (term?: string) => {
  return new Promise((resolve, reject) => {
    const caller = term ? urban(term) : urban.random();

    caller.first((json: any) => {
      const parsed_word = getParsed(json.word);
      const repo = npm.repo(parsed_word);

      const result = {
        urban: {
          parsed: parsed_word,
          ...json,
        },
        repo: {},
      };

      console.log(json.word, parsed_word, repo);

      repo
        .package()
        .then((repo) => {
          resolve({
            ...result,
            repo,
          });
        })
        .catch((error) => {
          console.log(error);

          resolve(result);
        });
    });
  });
};
