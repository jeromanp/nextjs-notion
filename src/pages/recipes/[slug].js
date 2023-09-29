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
        const parra = block.paragraph.rich_text[0]?.plain_text || "";
        return `<div class='flex justify-start'>
        <p class='text-lg mb-5 justify-center'>${parra}</p>
         </div>`;
      } else if (block.type === "heading_1") {
        const h_1 = ` ${block.heading_1.rich_text[0]?.text.content || ""}`;
        return `<div class='flex justify-center'>
        <p class='text-4xl mb-5 font-bold'>${h_1}</p>
         </div>`;
      } else if (block.type === "heading_2") {
        const h_2 = ` ${block.heading_2.rich_text[0]?.plain_text || ""}`;
        return `<div class='flex justify-start'>
        <p class='text-3xl mb-5 font-bold'>${h_2}</p>
         </div>`;
      } else if (block.type === "heading_3") {
        const h_3 = ` ${block.heading_3.rich_text[0]?.plain_text || ""}`;
        return `<div class='flex justify-start'>
        <p class='text-2xl mb-5 font-bold'>${h_3}</p>
         </div>`;
      } else if (block.type === "quote") {
        const result = `> ${block.quote?.rich_text?.[0]?.plain_text}` + `<br/>`;
        return `<blockquote class='p-4 my-4 border-l-4 border-gray-800 bg-yellow-700'>
            <p class='text-xl italic font-medium leading-relaxed text-gray-900 dark:text-white'>
              ${result}
            </p>
          </blockquote>`;
      } else if (block.type === "to_do") {
        const isChecked = block.to_do?.checked;
        const textContent = block.to_do?.rich_text[0]?.plain_text;

        if (isChecked) {
          return `
            <div class="flex mb-4 items-center">
              <p class="text-lg line-through text-green"> <span class="material-symbols-outlined text-green-600">
              check_circle
              </span>  ${textContent}</p>              
            </div>
          `;
        } else {
          return `
            <div class="flex mb-4 items-center">
              <p class="text-lg text-grey-darkest text-gray-400"> <span class="material-symbols-outlined text-red-600">
              circle
              </span>  ${textContent}</p>              
            </div>
          `;
        }
      } else if (block.type === "image") {
        const imageUrl = block.image.external.url || "";
        return `
        <div class='flex justify-center'>
        <img src="${imageUrl}" alt="Image" class='h-auto w-96 mb-5' /> </div>`;
      } else if (block.type === "bulleted_list_item") {
        const list = `${block.bulleted_list_item?.rich_text[0]?.plain_text}`;
        return `<ul class="max-w-md space-y-1 text-gray-700 list-disc list-inside dark:text-gray-400">
            <li>
                ${list}
            </li>
           
        </ul>`;
      } else if (block.type === "numbered_list_item") {
        const numberedItem =
          `${block.numbered_list_item?.rich_text[0]?.plain_text}` + `<br/>`;
        return `<ol class="pl-5 mt-2 space-y-1 list-decimal list-inside text-gray-400">
          <li>
              ${numberedItem}
          </li>
         
      </ol>`;
      } else if (block.type === "video") {
        const videoUrl = block.video?.external.url || "";
        // console.log(videoUrl);
        return `<video class="w-full pb-10 pl-4" controls>
          <source src="${videoUrl}" type="video/mp4" />
          Tu navegador no soporta el elemento de video.
        </video>`;
      }
    })
    .join("");

  // console.log(res);

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
