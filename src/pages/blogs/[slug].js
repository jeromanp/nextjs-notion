// pages/blogs/[slug].js
import { Client } from "@notionhq/client";
import { useRouter } from "next/router";
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

      <pre className="mx-auto">{JSON.stringify(blog, null, 2)}</pre>
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
    // Manejar el caso en que no se encuentre el blog
    return {
      notFound: true,
    };
  }

  // console.log(blog);

  // Obtener el contenido de la página asociada a la fila
  const pageId = blog.id; // ID de la página
  const pageContent = await notion.blocks.children.list({
    block_id: pageId,
  });

// Mapear todos los bloques en pageContent.results
const content = pageContent.results
  .map((block) => {
    if (block.type === "paragraph") {
      return (block.paragraph.rich_text[0]?.text?.content || "");
    }
    // Agregar más casos según los tipos de bloques que necesites manejar
    return "";
  })
  .join("\n\n");

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
