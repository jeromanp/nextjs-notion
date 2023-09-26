import Link from "next/link";

export default function Home({ quote }) {
  return (
    <main className="bg-green-900 flex flex-col items-center justify-between p-24">
      <h1 className="p-24">Hola mundo</h1>
      <p className="font-bold">{JSON.stringify(quote)}</p>
      <div className="py-6">
        <Link href={"/recipes"}>
          <button type="" className="bg-red-600 rounded-lg p-2">
            Recetas
          </button>
        </Link>
      </div>
      <div>
        <Link href={"/blog"}>
          <button type="" className="bg-red-600 rounded-lg p-2">
            Blogs
          </button>
        </Link>
      </div>
    </main>
  );
}

export const getStaticProps = async () => {
  // fetch data
  // create static pages
  const quote = await fetch("https://api.breakingbadquotes.xyz/v1/quotes").then(
    (resp) => resp.json()
  );

  return {
    props: {
      quote,
    },
  };
};
