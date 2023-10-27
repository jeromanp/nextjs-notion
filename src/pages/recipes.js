import { Client } from "@notionhq/client";
import Link from "next/link";
import slugify from "slugify";

const RecipePage = ({ recipes }) => {
  return (
    <main className="h-screen bg-crema justify-between p-10 md:p-16 lg:p-24">
      <div className="items start flex">
        <Link href={"/"}>
          <button type="" className="bg-cafe p-2 rounded-lg hover:bg-mostaza">
            Atrás
          </button>
        </Link>
      </div>
      <div className="">
        <h1 className="p-12 text-2xl md:text-4xl flex justify-center text-gray-950">
          Todas las Recetas:
        </h1>
        {recipes.map((recipe) => (
          <Link className="text-gray-800 hover:text-slate-500" href={`/recipes/${slugify(recipe).toLowerCase()}`}>
            <ul key={recipe}>
              <li className="text-xl">- {recipe}</li>
            </ul>
          </Link>
        ))}
      </div>
    </main>
  );
};

export const getStaticProps = async () => {
  const notion = new Client({
    auth: process.env.NOTION_SECRET,
  });

  const data = await notion.blocks.children.list({
    block_id: process.env.PAGE_ID,
  });

  const recipes = [];

  data.results.forEach((result) => {
    if (result.type === "child_page") {
      recipes.push(result.child_page.title);
    }
  });

  return {
    props: {
      recipes,
    },
  };
};

export default RecipePage;
