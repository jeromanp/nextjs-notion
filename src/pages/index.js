import Link from "next/link";

export default function Home({ quote }) {
  return (
    <main className="h-screen bg-green-900 justify-between p-12">
      <div>
        <h1 className="my-5 text-4xl">Bienvenido</h1>
        <p className="items-start text-xl">
          Este es un proyecto en donde se utiliza Next JS y Notion para poder
          generar páginas estáticas a partir del contenido que se puede publicar
          en <i>Notion</i>
        </p>
      </div>
      {/* <p className="font-bold">{JSON.stringify(quote)}</p> */}
      <div className="mx-auto my-5">
        <p className="items-start text-xl my-5">
          Por el momento tenemos los siguiente enlaces de prueba:
        </p>
        <div className="flex justify-center">
          <Link href={"/recipes"}>
            <button type="" className="bg-red-600 rounded-lg p-2 mx-5">
              Recetas
            </button>
          </Link>

          <Link href={"/blogs"}>
            <button type="" className="bg-red-600 rounded-lg p-2 mx-5">
              Blogs
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}

// export const getStaticProps = async () => {
//   // fetch data
//   // create static pages
//   const quote = await fetch("https://api.breakingbadquotes.xyz/v1/quotes").then(
//     (resp) => resp.json()
//   );

//   return {
//     props: {
//       quote,
//     },
//   };
// };
