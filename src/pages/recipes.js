import { Client } from "@notionhq/client";
import Link from "next/link";
import slugify from "slugify";

const RecipePage = ({ recipes }) => {
  return (
    <main className="h-screen bg-green-900 justify-between p-24">
      <div className="items start flex">
        <Link href={"/"}>
          <button type="" className="bg-red-600 p-2 rounded-lg">
            Atrás
          </button>
        </Link>
      </div>
      <div className="">
        <h1 className="p-12 text-4xl flex justify-center">
          Todas las Recetas:
        </h1>
        {recipes.map((recipe) => (
          <p key={recipe}>
            <Link href={`/recipes/${slugify(recipe).toLowerCase()}`}>
              <ul>
                <li  className="text-xl">- {recipe}</li>
              </ul>
            </Link>
          </p>
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
