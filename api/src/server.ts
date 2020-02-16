import express from 'express';
import cors from 'cors';
import NPM from 'npm-api';
import urban from 'urban';

const npm = new NPM();
const app: express.Application = express();

app.use(cors());

const getParsed = (term: string) => term.trim().replace(/[^0-9A-z ]/gm, '').replace(/[ ]/gm, '-').toLowerCase();

app.get('/t/:term', (request: express.Request, response: express.Response) => {
  const term = request.params.term;
  urban(term).first((json: any) => {
    const parsed_word = getParsed(json.word);
    const repo = npm.repo(parsed_word);

    const result = {
      urban: {
        parsed: parsed_word,
        ...json
      },
      repo: {

      }
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
});

app.get('/r', (request: express.Request, response: express.Response) => {
  urban.random().first((json: any) => {
    const parsed_word = json.word.trim().replace(/[ ']/gm, '-').toLowerCase();
    const repo = npm.repo(parsed_word);

    const result = {
      urban: {
        parsed: parsed_word,
        ...json
      },
      repo: {

      }
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
});

const { PORT = 80 } = process.env;

app.listen(PORT, () => {
  console.log('listening at port:', PORT);
});
