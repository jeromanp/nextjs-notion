// pages/blogs/[slug].js
import { Client } from "@notionhq/client";
import Posts from "../../components/Posts";
import Link from "next/link";

const Blog = ({ blog }) => {
  return (
    <div className="bg-green-900 justify-between p-12">
      <div className="flex items-start">
        <Link href={"/blogs"}>
          <button type="" className="bg-red-600 p-2 rounded-lg">
            Atrás
          </button>
        </Link>
      </div>
      <Posts
        title={blog.title}
        content={blog.content}
        bannerImage={blog.bannerImage}
        datePublic={blog.datePublic}
      />

      {/* <pre className="mx-auto">{JSON.stringify(blog, null, 2)}</pre> */}
    </div>
  );
};

export const getServerSideProps = async (context) => {
  const { slug } = context.query;

  const notion = new Client({
    auth: process.env.NOTION_SECRET,
  });

  const data = await notion.databases.query({
    database_id: process.env.DATABASE_ID,
  });

  const blog = data.results.find((result) => {
    return (
      result.parent.type === "database_id" &&
      result.properties.Slug?.rich_text[0]?.text?.content === slug
    );
  });

  if (!blog) {
    return {
      notFound: true,
    };
  }

  // Obtener el contenido de la página asociada a la fila
  const pageId = blog.id;
  const pageContent = await notion.blocks.children.list({
    block_id: pageId,
  });

  // console.log(pageContent.results[10].quote.rich_text[0]);
  let i = 1;
  // Mapear todos los bloques en pageContent.results
  const content = pageContent.results
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
              <p class="text-lg line-through text-green"> <span class="material-symbols-outlined">
              check_circle
              </span>  ${textContent}</p>              
            </div>
          `;
        } else {
          return `
            <div class="flex mb-4 items-center">
              <p class="text-lg text-grey-darkest"> <span class="material-symbols-outlined">
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
        return (
          `- ${block.bulleted_list_item?.rich_text[0]?.plain_text}` + `<br/>`
        );
      } else if (block.type === "numbered_list_item") {
        const numberedItem =
          `${i++}. ${block.numbered_list_item?.rich_text[0]?.plain_text}` +
          `<br/>`;
        return numberedItem;
      }

      // else if (block.type === "toggle") {
      //   // Obtener el texto del bloque de tipo toggle
      //   const toggleText = block.toggle?.rich_text[0]?.text.content| "";
      //   // Crear una estructura HTML para representar el bloque de tipo toggle
      //   const toggleHtml = `
      //     <details>
      //       <summary>${toggleText}</summary>
      //       <div>${block.toggle?.children.map(child => child.rich_text[0]?.text?.content).join("<br/>")}</div>
      //     </details>
      //   `;
      //   return toggleHtml;
      // }
      else if (block.type === "toogle") {
        const toggleTitle = block.toggle?.rich_text[0]?.plain_text;
        // const toggleDescription =
      } else if (block.type === "video") {
        const videoUrl = block.video.external.url || "";
        return (
          `<video src="${videoUrl}" controls width="640" height="360" preload="auto" />` +
          `<br/>`
        );
      }

      return "";
    })
    .join("");

  const datePublic = pageContent.results[0].last_edited_time;
  // console.log(pageContent.results[0]);
  const parsedDate = new Date(datePublic);

  const day = parsedDate.getDate().toString().padStart(2, "0");
  const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
  const year = parsedDate.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;

  return {
    props: {
      blog: {
        title: blog.properties.Title.title[0]?.text?.content || "",
        description: blog.properties.Description.multi_select[0]?.name,
        content: content,
        bannerImage: blog.properties.BannerImage.files[0]?.name || "",
        datePublic: formattedDate,
      },
    },
  };
};

export default Blog;
