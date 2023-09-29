import "../styles/globals.css";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Notion y NextJS</title>
        <meta name="description" content="Renderizado de paginas de Notion" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
