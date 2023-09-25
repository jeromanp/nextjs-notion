import { Client } from "@notionhq/client";
import Link from "next/link";

const Recipe = ({ recipe }) => {
  return (
    <div className="container mx-auto py-5">
      <Link href={"/recipes"}>
        <button type="" className="bg-red-600 p-2 rounded-lg">
          Atrás
        </button>
      </Link>
      <h1 className="text-red-800 text-3xl">Recet: {recipe.title}</h1>
      <pre>{JSON.stringify(recipe, null, 2)}</pre>);
    </div>
  );
};

export const getStaticPaths = async () => {
  const notion = new Client({
    auth: process.env.NOTION_SECRET,
  });

  const data = await notion.blocks.children.list({
    block_id: process.env.PAGE_ID,
  });

  const paths = [];

  data.results.forEach((result) => {
    if (result.type === "child_page") {
      paths.push({
        params: {
          id: result.id,
        },
      });
    }
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params: { id } }) => {
  // fetch details for recipe
  const notion = new Client({
    auth: process.env.NOTION_SECRET,
  });

  const page = await notion.pages.retrieve({
    page_id: id,
  });

  const blocks = await notion.blocks.children.list({
    block_id: id,
  });

  const title = page.properties.title.title[0].plain_text;
  const ingredients = [];
  const method = [];

  blocks.results.forEach((block) => {
    if (block.type === "numbered_list_item") {
      ingredients.push(block.numbered_list_item.rich_text[0].text.content);
    }

    // console.log("BLOCKS ====>",blocks.results[0]);

    if (block.type === "paragraph" && block.paragraph.rich_text[0]) {
      method.push(block.paragraph.rich_text[0].text.content);
    }
    console.log(block);
  });

  return {
    props: {
      recipe: {
        title,
        ingredients,
        method,
      },
    },
  };
};

export default Recipe;
