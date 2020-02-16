import React, { useEffect, useState } from 'react';
import axios from "axios";
import { UrbanText } from "../Urban/components/UrbanText";
import Markdown from "react-markdown";
import { css } from "@emotion/core";
import { RouteComponentProps } from "react-router-dom";
import ClipLoader from "react-spinners/SyncLoader"
import { Transition } from 'react-transition-group';
import classnames from 'classnames';
import FA from 'react-fontawesome';
import environment from "../constants/environment";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: white;
`;

function Tile({ children, name, isLoading }: any) {
  return (
    <section className={`Tile ${name}`}>
      <div className='Tile-logo' />
      <Transition in={!isLoading} timeout={400}>
        {(state: string) => (
          <div className={classnames('Tile-content', state)}>
            {children}
          </div>
        )}
      </Transition>
      <Transition in={isLoading} timeout={400}>
        {(state: string) => (
          <div className={classnames('Tile-loading', state)}>
            <ClipLoader
              css={override}
              size={10}
              color={"#fff"}
              loading={isLoading}
            />
          </div>
        )}
      </Transition>
    </section>
  )
}

interface Props extends RouteComponentProps<{ term: string }> {

}

const { api_url } = environment;

const TERM_URL = (term: string) => `${api_url}/t/${term}`;
const RANDOM_URL = () => `${api_url}/r`;

function TermRoute({ history, match }: Props) {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const onNew = () => {
    setIsLoading(true);
    axios.get(RANDOM_URL()).then((response: any) => {
      setData(response.data);
      setIsLoading(false);
      history.push(`/package/${response.data.urban.parsed}`)
    });
  };

  useEffect(() => {
    const { term } = match.params;
    const url = term ? TERM_URL(term) : RANDOM_URL();
    setIsLoading(true);

    axios.get(url).then((response: any) => {
      setData(response.data);
      setIsLoading(false);
      history.push(`/package/${response.data.urban.parsed}`)
    });
  }, []);

  return (
    <>
      <Tile name="Urban" isLoading={isLoading}>
        <div className='Urban-word'>
          {data?.urban?.word}
        </div>
        <div className='Urban-definition'>
          <UrbanText text={data?.urban?.definition} />
        </div>
        <div className='Urban-example'>
          <UrbanText text={data?.urban?.example} />
        </div>
      </Tile>
      <Tile name="NPM" isLoading={isLoading}>
        <div className='NPM-name'>
          <a target="_blank" href={`https://www.npmjs.com/package/${data?.urban?.parsed}`}>
            {data?.urban?.parsed}
            <FA name="link" />
          </a>
        </div>
        {data?.repo?.version && (
          <>
            <div className='NPM-version'>
              {data?.repo?.version}
            </div>
            <div className='NPM-description'>
              {data?.repo?.description}
            </div>
            <div className='NPM-readme'>
              <Markdown source={data?.repo?.readme} />
            </div>
          </>
        )}

        {!data?.repo?.version && (
          <div className="NPM-notFound" />
        )}

      </Tile>
      <FA name="refresh" spin={isLoading} className="New-Button" onClick={onNew} />
    </>
  );
}

export default TermRoute;
