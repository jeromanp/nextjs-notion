import { Client } from "@notionhq/client";
import Link from "next/link";
import slugify from "slugify";

const BlogPage = ({ blogs }) => {
  return (
    <div className="h-screen bg-green-900 justify-between p-24">
      <div className="items start flex">
        <Link href={"/"}>
          <button type="" className="bg-red-600 p-2 rounded-lg">
            Atrás
          </button>
        </Link>
      </div>
      <div>
        <h1 className="p-12 text-4xl flex justify-center">Nuestros Blogs:</h1>
        {blogs.map((blog) => (
          <p key={blog}>
            <Link href={`/blogs/${slugify(blog).toLowerCase()}`}>
              <p className="text-xl">- {blog}</p>
            </Link>
          </p>
        ))}
      </div>

      {/* <pre className="mx-auto">{JSON.stringify(blogs, null, 2)}</pre> */}
    </div>
  );
};

export const getStaticProps = async () => {
  const notion = new Client({
    auth: process.env.NOTION_SECRET,
  });

  const data = await notion.databases.query({
    database_id: process.env.DATABASE_ID,
  });

  const blogs = [];

  data.results.forEach((result) => {
    if (
      result.parent.type === "database_id" &&
      result.properties.Title.title[0]
    ) {
      blogs.push(result.properties.Title.title[0].text.content);
      // console.log("BLOGS======>>>", result.properties);
    }
  });

  return {
    props: {
      blogs,
    },
  };
};

export default BlogPage;
