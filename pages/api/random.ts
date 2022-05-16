import urban from 'urban';
import NPM from 'npm-api';
import Cors from 'cors'
import { getParsed } from "./search";

const npm = new NPM();

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

export default async function handler(request, response) {
  urban.random().first((json: any) => {
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
