import '../styles/globals.css'
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      {/* Encabezado global de la aplicación */}
      <Head>
        <title>Notion y NextJS</title>
        <meta name="description" content="Renderizado de paginas de Notion" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0"
        />
      </Head>
      {/* Renderiza el componente de la página actual */}
      <Component {...pageProps} />
    </>
  )
}

export default MyApp