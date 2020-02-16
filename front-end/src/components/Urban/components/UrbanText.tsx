import React, { useMemo } from 'react';

export const UrbanText: React.FC<{ text: string }> = ({ text }) => {
  const parsed = useMemo(() => {
    return (text as string)?.replace(/\[([^\]]+)]/gm, (match, token) => {
      return `<a target="_blank" href="https://www.urbandictionary.com/define.php?term=${encodeURIComponent(token)}">${token}</a>`;
    });
  }, [text]);

  return (
    <span dangerouslySetInnerHTML={{ __html: parsed }} />
  )
};
