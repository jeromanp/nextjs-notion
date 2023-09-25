import { Client } from "@notionhq/client";
import Link from "next/link";

export default function Recipes({ recipes }) {
  return (
    <main className="bg-green-900 flex flex-col items-center justify-between p-24">
      <Link href={"/"}>
        <button type="" className="bg-red-600 p-2 rounded-lg">
          Atrás
        </button>
      </Link>
      <h1 className="p-24">Todas las Recetas:</h1>
      {/* Para ver la data del documento de Notion */}
      {/* {JSON.stringify(recipes)} */}
      <pre>
        {recipes.map((recipe) => (
          <p key={recipe.id}>
            <Link href={`/recipes/${recipe.id}`}>
              <p>{recipe.title}</p>
            </Link>
          </p>
        ))}
      </pre>
    </main>
  );
}

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
      recipes.push({
        id: result.id,
        title: result.child_page.title,
      });
    }
  });

  return {
    props: {
      // para ver la data
      // recipes:data,
      recipes,
    },
  };
};
