import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import classnames from "classnames";
import { CSSTransition } from 'react-transition-group';

export default function TermPage() {
  const { query, push, isReady } = useRouter();

  const [{ urban, repo }, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  async function get(term?: string) {
    const url = term ? `/api/search?term=${term}` : '/api/random';

    setLoading(true);

    try {
      const response = await fetch(url);
      const data = await response.json();

      setData(data);

      if (query.term !== data.urban.parsed) {
        await push(`/package/${data.urban.parsed}`)
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false)
    }

  }

  useEffect(() => {
    if (!isReady) {
      return
    }

    if (urban && query.term === urban.parsed) {
      return;
    }

    get(query.term as string).then();
  }, [query.term, isReady])

  return (
    <div className="grid grid-cols-1 flex-1 lg:grid-cols-2">
      <div className="absolute left-0 right-0 top-0 p-6 text-white">
        <div className="cursor-pointer flex">
          <div className={classnames("flex", { 'animate-spin': loading })}>
            <svg xmlns="http://www.w3.org/2000/svg"
                 className="h-6 w-6"
                 fill="none" viewBox="0 0 24 24"
                 style={{ transform: 'scale(1, -1)' }}
                 stroke="currentColor" onClick={() => get()}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-urban font-urban flex flex-col flex-1 p-10">
        <div
          className="mt-5"
          style={{
            backgroundImage: "url(https://d2gatte9o95jao.cloudfront.net/assets/logo-1b439b7fa6572b659fbef161d8946372f472ef8e7169db1e47d21c91b410b918.svg)",
            minHeight: 200,
            minWidth: 200,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: "no-repeat"
          }}
        />

        <CSSTransition in={!loading} timeout={400}>
          {(state) => (
            <div className={classnames('bg-white p-4 mt-10 transition', {
              'opacity-1': ['entering', 'entered'].includes(state),
              'opacity-0': ['exited', 'exiting'].includes(state)
            })}>
              <div className="font-bold text-3xl" style={{ color: '#134FE6' }}>{urban?.word}</div>
              <div style={{ color: '#2C353C' }} className="mt-3">
                <UrbanText text={urban?.definition} />
              </div>
              <div className="italic mt-4" style={{ color: '#2C353C' }}>
                <UrbanText text={urban?.example} />
              </div>
            </div>
          )}
        </CSSTransition>

      </div>
      <div className="bg-npm font-npm flex flex-col flex-1 p-10">
        <div
          className="mt-5"
          style={{
            backgroundImage: "url(https://upload.wikimedia.org/wikipedia/commons/d/db/Npm-logo.svg)",
            minHeight: 200,
            minWidth: 200,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: "no-repeat"
          }}
        />

        <CSSTransition in={!loading} timeout={400}>
          {(state) => (

            <div className={classnames('bg-white p-4 mt-10 transition', {
              'opacity-1': ['entering', 'entered'].includes(state),
              'opacity-0': ['exited', 'exiting'].includes(state)
            })}>
              <a target="_blank" rel="noreferrer" href={`https://www.npmjs.com/package/${urban?.parsed}`}
                 className="flex items-center">
            <span className="mr-1 font-semibold text-2xl">
              {urban?.parsed}
            </span>

                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </a>

              {repo?.version && (
                <>
                  <div style={{ fontFamily: '"Fira Mono", "Andale Mono", "Consolas", monospace' }} className="mt-2">
                    {repo?.version}
                  </div>
                  <div className="mt-2">
                    {repo?.description}
                  </div>
                </>
              )}
              {!repo?.version && (
                <div style={{
                  backgroundImage: "url(https://static.npmjs.com/2f55441126e3c8d643c4c2d4e852cb4c.png)",
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: "no-repeat"
                }}
                     className="h-96 mx-auto my-4" />
              )}
            </div>
          )}
        </CSSTransition>
      </div>
    </div>
  )
}

function UrbanText({ text }: { text?: string }) {
  const parsed = useMemo(() => {
    return (text as string)?.replace(/\[([^\]]+)]/gm, (match, token) => {
      return `<a target="_blank" rel="noopener noreferrer" class="text-blue-600 underline" href="https://www.urbandictionary.com/define.php?term=${encodeURIComponent(token)}">${token}</a>`;
    });
  }, [text]);

  return (
    <span dangerouslySetInnerHTML={{ __html: parsed }} />
  )
}
