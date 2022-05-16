import React from 'react';
import Head from 'next/head';
import 'tailwindcss/tailwind.css'
import '../styles/global.css';

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.png" />
        <title>urban • npm</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default App
