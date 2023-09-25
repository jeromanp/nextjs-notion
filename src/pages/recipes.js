import { Client } from "@notionhq/client";
import Link from "next/link";
import slugify from "slugify";

const RecipePage = ({ recipes }) => {
  return (
    <main className="bg-green-900 flex flex-col items-center justify-between p-24">
      <Link href={"/"}>
        <button type="" className="bg-red-600 p-2 rounded-lg">
          Atrás
        </button>
      </Link>
      <h1 className="p-24">Todas las Recetas:</h1>
      {recipes.map((recipe) => (
        <p key={recipe}>
          <Link href={`/recipes/${slugify(recipe).toLowerCase()}`}>
            <p>{recipe}</p>
          </Link>
        </p>
      ))}
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
