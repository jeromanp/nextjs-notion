import { Client } from "@notionhq/client";
import slugify from "slugify";
import Link from "next/link";
import Recipes from "@/components/Recipes";

const Recipe = ({ recipe }) => {
  return (
    <div className="bg-green-900 justify-between p-12">
      <div className="flex items-start">
        <Link href={"/recipes"}>
          <button type="" className="bg-red-600 p-2 rounded-lg">
            Atrás
          </button>
        </Link>
      </div>
      <Recipes
        title={recipe.title}
        ingredients={recipe.ingredients}
        content={recipe.content}
      />
      {/* <pre className="mx-auto">{JSON.stringify(recipe, null, 2)}</pre> */}
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
          slug: slugify(result.child_page.title).toLowerCase(),
        },
      });
    }
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params: { slug } }) => {
  // fetch details for recipe
  const notion = new Client({
    auth: process.env.NOTION_SECRET,
  });

  const data = await notion.blocks.children.list({
    block_id: process.env.PAGE_ID,
  });

  const page = data.results.find((result) => {
    if (result.type === "child_page") {
      const { title } = result.child_page;
      const resultSlug = slugify(title).toLowerCase();
      return resultSlug === slug;
    }
    return false;
  });

  const blocks = await notion.blocks.children.list({
    block_id: page.id,
  });

  const title = page.child_page.title;
  let i = 1;

  const res = blocks.results
    .map((block) => {
      if (block.type === "paragraph") {
        const parra = block.paragraph?.rich_text[0]?.text.content || "";
        return parra + `<br/>`;
      } else if (block.type === "heading_1") {
        return `${block.heading_1?.rich_text[0]?.text.content || ""}` + `<br/>`;
      } else if (block.type === "heading_2") {
        return (
          ` ${block.heading_2?.rich_text[0]?.text.content || ""}` + `<br/>`
        );
      } else if (block.type === "heading_3") {
        return (
          ` ${block.heading_3?.rich_text[0]?.text.content || ""}` + `<br/>`
        );
      } else if (block.type === "quote") {
        return `> ${block.quote?.rich_text?.[0]?.text.content}` + `<br/>`;
      } else if (block.type === "to_do") {
        const checkbox = block.to_do?.checked ? "[x]" : "[ ]";
        return `${checkbox} ${block.to_do?.rich_text[0]?.plain_text}` + `<br/>`;
      } else if (block.type === "image") {
        const imageUrl = block.image?.external.url || "";
        return `<img src="${imageUrl}" alt="Image" />` + `<br/>`;
      } else if (block.type === "bulleted_list_item") {
        return (
          `- ${block.bulleted_list_item?.rich_text[0]?.text.content}` + `<br/>`
        );
      } else if (block.type === "numbered_list_item") {
        const numberedItem =
          `${i++}. ${block.numbered_list_item?.rich_text[0]?.text.content}` +
          `<br/>`;
        return numberedItem;
      }
    })
    .filter(Boolean);

  console.log(res);

  return {
    props: {
      recipe: {
        title,
        content: res,
      },
    },
  };
};

export default Recipe;
