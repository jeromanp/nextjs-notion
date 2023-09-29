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
        description={blog.description}
        content={blog.content}
        bannerImage={blog.bannerImage}
        bannerImageWidth={blog.bannerImageWidth}
        bannerImageHeight={blog.bannerImageHeight}
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

  console.log(pageContent.results[23].toggle.rich_text[0]);
  let i = 1;
  // Mapear todos los bloques en pageContent.results
  const content = pageContent.results
    .map((block) => {
      if (block.type === "paragraph") {
        const parra = block.paragraph.rich_text[0]?.plain_text || "";
        return parra + `<br/>`;
      } else if (block.type === "heading_1") {
        return ` ${block.heading_1.rich_text[0]?.text.content || ""}` + `<br/>`;
      } else if (block.type === "heading_2") {
        return ` ${block.heading_2.rich_text[0]?.plain_text || ""}` + `<br/>`;
      } else if (block.type === "heading_3") {
        return ` ${block.heading_3.rich_text[0]?.plain_text || ""}` + `<br/>`;
      } else if (block.type === "quote") {
        const result = `> ${block.quote?.rich_text?.[0]?.plain_text}` + `<br/>`;
        return `<blockquote className="p-4 my-4 border-l-4 border-gray-300 bg-gray-50 dark:border-gray-500 dark:bg-gray-800">
            <p className="text-xl italic font-medium leading-relaxed text-gray-900 dark:text-white">
              ${result}
            </p>
          </blockquote>`;
      } else if (block.type === "to_do") {
        const checkbox = block.to_do?.checked ? "[x]" : "[ ]";
        return `${checkbox} ${block.to_do?.rich_text[0]?.plain_text}` + `<br/>`;
      } else if (block.type === "image") {
        const imageUrl = block.image.external.url || "";
        return `<img src="${imageUrl}" alt="Image" />` + `<br/>`;
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

  return {
    props: {
      blog: {
        title: blog.properties.Title.title[0]?.text?.content || "",
        description: blog.properties.Description.multi_select[0]?.name,
        content: content,
        bannerImage: blog.properties.BannerImage.files[0]?.name || "",
        bannerImageWidth: blog.properties.BannerImageWidth?.number || 0,
        bannerImageHeight: blog.properties.BannerImageHeight?.number || 0,
      },
    },
  };
};

export default Blog;
