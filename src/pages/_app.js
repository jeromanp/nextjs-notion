import Header from "@/components/Header";
import "../styles/globals.css";
import Head from "next/head";
import Footer from "@/components/Footer";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Notion y NextJS</title>
        <meta name="description" content="Renderizado de paginas de Notion" />
      </Head>
     <Header/> 
      <Component {...pageProps} />
      <Footer/>
    </>
  );
}

export default MyApp;
