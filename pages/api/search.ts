// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import urban from 'urban';
import NPM from 'npm-api';
import removeAccents from 'remove-accents';

const npm = new NPM();

export const getParsed = (term: string) => removeAccents(term.trim())
  .toLowerCase()
  .replace(/[^0-9a-z- ]/gm, '')
  .replace(/[ ]/gm, '-');

export default async function handler(request, response) {
  const { term } = request.query;

  urban(term).first((json: any) => {
    const parsed_word = getParsed(json.word);
    const repo = npm.repo(parsed_word);

    const result = {
      urban: {
        parsed: parsed_word,
        ...json
      },
      repo: {}
    };

    console.log(json.word, parsed_word, repo);

    repo.package().then(repo => {
      response.json({
        ...result,
        repo
      });
    }).catch(error => {
      console.log(error);

      response.json(result);
    });
  });
}
