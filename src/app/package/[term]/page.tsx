"use client";

import { IconExternalLink } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { RefreshButton } from "~/components/refresh-button";
import { cn } from "~/lib/utils";

interface Result {
  urban?: {
    parsed: string;
    word: string;
    definition: string;
    example: string;
  };
  npm?: {
    version: string;
    description: string;
  };
}

export default function TermPage() {
  const { term } = useParams<{ term?: string }>();

  const [{ urban, npm }, setData] = useState<Result>({});
  const [loading, setLoading] = useState(true);
  const termRef = useRef<string | undefined | null>(null);

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: no need
  useEffect(() => {
    if (urban && term === urban.parsed) {
      return;
    }

    get(term as string).then();
  }, [term]);

  return (
    <div className="grid grid-cols-1 flex-1 lg:grid-cols-2">
      <RefreshButton onClick={() => get()} className="absolute top-5 left-5" />

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
              className={cn("bg-white p-4 mt-10")}
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
            backgroundImage: "url(https://upload.wikimedia.org/wikipedia/commons/d/db/Npm-logo.svg)",
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
              className={cn("bg-white p-4 mt-10")}
            >
              <a
                target="_blank"
                rel="noreferrer"
                href={`https://www.npmjs.com/package/${urban?.parsed}`}
                className="flex items-center"
              >
                <span className="mr-1 font-semibold text-2xl">{urban?.parsed}</span>

                <IconExternalLink className="size-5 ml-1" />
              </a>

              {npm?.version && (
                <>
                  <div
                    style={{
                      fontFamily: '"Fira Mono", "Andale Mono", "Consolas", monospace',
                    }}
                    className="mt-2"
                  >
                    {npm?.version}
                  </div>
                  <div className="mt-2">{npm?.description}</div>
                </>
              )}
              {!npm?.version && (
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
    return (text as string)?.replace(/\[([^\]]+)]/gm, (_, token) => {
      return `<a target="_blank" rel="noopener noreferrer" class="text-blue-600 underline" href="https://www.urbandictionary.com/define.php?term=${encodeURIComponent(token)}">${token}</a>`;
    });
  }, [text]);

  // biome-ignore lint/security/noDangerouslySetInnerHtml: will replace
  return <span dangerouslySetInnerHTML={{ __html: parsed }} />;
}
