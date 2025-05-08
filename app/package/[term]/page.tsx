"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import classnames from "classnames";
import { AnimatePresence, motion } from "motion/react";
import { RefreshCw } from "lucide-react";

export default function TermPage() {
  const { push } = useRouter();
  const { term } = useParams<{ term?: string }>();

  const [{ urban, repo }, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const termRef = useRef<string>(null);

  async function get(term?: string) {
    const url = term ? `/api/search?term=${term}` : "/api/random";

    if (termRef.current === term) {
      return;
    }

    termRef.current = term;

    setLoading(true);

    try {
      const response = await fetch(url);
      const data = await response.json();

      setData(data);

      if (term !== data.urban.parsed) {
        window.history.pushState(null, "", `/package/${data.urban.parsed}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      termRef.current = null;
    }
  }

  useEffect(() => {
    if (urban && term === urban.parsed) {
      return;
    }

    get(term as string).then();
  }, [term]);

  return (
    <div className="grid grid-cols-1 flex-1 lg:grid-cols-2">
      <RefreshCw
        onClick={() => get()}
        className={classnames(
          "cursor-pointer text-white size-6 m-5 absolute z-10 top-0 left-0",
          {
            "animate-spin": loading,
          },
        )}
      />

      <div className="bg-urban font-urban flex flex-col flex-1 p-10">
        <div
          className="mt-5"
          style={{
            backgroundImage:
              "url(https://d2gatte9o95jao.cloudfront.net/assets/logo-1b439b7fa6572b659fbef161d8946372f472ef8e7169db1e47d21c91b410b918.svg)",
            minHeight: 200,
            minWidth: 200,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />

        <AnimatePresence initial={false}>
          {!loading && (
            <motion.div
              key={urban?.word}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={classnames("bg-white p-4 mt-10")}
            >
              <div className="font-bold text-3xl" style={{ color: "#134FE6" }}>
                {urban?.word}
              </div>
              <div style={{ color: "#2C353C" }} className="mt-3">
                <UrbanText text={urban?.definition} />
              </div>
              <div className="italic mt-4" style={{ color: "#2C353C" }}>
                <UrbanText text={urban?.example} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="bg-npm font-npm flex flex-col flex-1 p-10">
        <div
          className="mt-5"
          style={{
            backgroundImage:
              "url(https://upload.wikimedia.org/wikipedia/commons/d/db/Npm-logo.svg)",
            minHeight: 200,
            minWidth: 200,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />

        <AnimatePresence initial={false}>
          {!loading && (
            <motion.div
              key={urban?.word}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={classnames("bg-white p-4 mt-10")}
            >
              <a
                target="_blank"
                rel="noreferrer"
                href={`https://www.npmjs.com/package/${urban?.parsed}`}
                className="flex items-center"
              >
                <span className="mr-1 font-semibold text-2xl">
                  {urban?.parsed}
                </span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </a>

              {repo?.version && (
                <>
                  <div
                    style={{
                      fontFamily:
                        '"Fira Mono", "Andale Mono", "Consolas", monospace',
                    }}
                    className="mt-2"
                  >
                    {repo?.version}
                  </div>
                  <div className="mt-2">{repo?.description}</div>
                </>
              )}
              {!repo?.version && (
                <div
                  style={{
                    backgroundImage: "url(/404.png)",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                  className="h-96 mx-auto my-4"
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function UrbanText({ text }: { text?: string }) {
  const parsed = useMemo(() => {
    return (text as string)?.replace(/\[([^\]]+)]/gm, (match, token) => {
      return `<a target="_blank" rel="noopener noreferrer" class="text-blue-600 underline" href="https://www.urbandictionary.com/define.php?term=${encodeURIComponent(token)}">${token}</a>`;
    });
  }, [text]);

  return <span dangerouslySetInnerHTML={{ __html: parsed }} />;
}
