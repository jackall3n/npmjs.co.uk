import { type PropsWithChildren } from "react";
import { type Metadata } from "next";

import "../styles/global.css";

export const metadata: Metadata = {
  title: "urban • npm",
};

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html>
      <head>
        <link rel="shortcut icon" href="/favicon.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
