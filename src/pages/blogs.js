import { Client } from "@notionhq/client";
import Link from "next/link";
import slugify from "slugify";

const BlogPage = ({ blogs }) => {
  // console.log(blogs);
  return (
    <div className="h-screen w-screen bg-cafe justify-between p-5 md:p-10 lg:p-20 inline-table">
      {/* <!-- ====== Blog Section Start --> */}
      <section className="bg-otrocafe pt-20 lg:pt-[120px] pb-10 lg:pb-20">
        <div className="container mx-auto items start flex">
          <Link href={"/"}>
            <button
              type=""
              className="bg-cafe p-2 rounded-lg hover:bg-mostaza ml-5 md:ml-10 lg:ml-20"
            >
              Atrás
            </button>
          </Link>
        </div>
        <div className="container">
          <div className="flex flex-wrap justify-center -mx-4">
            <div className="w-full px-4">
              <div className="text-center mx-auto mb-[60px] lg:mb-20 max-w-[510px]">
                <span className="font-semibold text-lg text-white mb-2 block">
                  Nuestros Blogs
                </span>
                <h2
                  className="
                  font-bold
                  text-2xl
                  sm:text-3xl
                  md:text-[40px]
                  text-dark
                  mb-4
                  "
                >
                  Visita Nuestro Contenido Reciente
                </h2>
                <p className="text-base text-gray-400">
                  
                </p>
              </div>
            </div>
          </div>
          {/* Items */}
          <div className="grid grid-cols-1 gap-12 text-center sm:grid-cols-2 md:grid-cols-3 lg:gap-y-16">
            {blogs.map((blog) => (
              <div className=" -mx-4" key={blog.title}>
                {" "}
                <div className="">
                  <div className="max-w-[370px] mx-auto mb-10 px-4">
                    <div className="rounded overflow-hidden mb-8">
                      <Link
                        href={`/blogs/${slugify(blog.title).toLowerCase()}`}
                      >
                        <img
                          src={blog.imageBlog}
                          alt={blog.title}
                          className="w-96 h-48 object-cover"
                        />
                      </Link>
                    </div>
                    <div>
                      <span
                        className="
                      bg-cafe
                      text-white
                      rounded-md
                      inline-block
                      text-center
                      py-1
                      px-3
                      text-xs
                      leading-loose
                      font-semibold
                      mb-5"
                      >
                        {blog.datePublic}
                      </span>
                      <div>
                        <Link
                          href={`/blogs/${slugify(blog.title).toLowerCase()}`}
                        >
                          <h3
                            className="font-bold
              text-xl
              sm:text-3xl
              lg:text-3xl
              mb-4
              inline-block
              text-dark
              hover:text-crema
              text-cafe"
                          >
                            {blog.title}
                          </h3>
                        </Link>
                      </div>

                      <p className="text-base text-stone-200 mx-1">
                        {blog.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* <pre className="mx-auto">{JSON.stringify(blogs, null, 2)}</pre> */}
    </div>
  );
};

// export const getStaticProps = async () => {
//   const notion = new Client({
//     auth: process.env.NOTION_SECRET,
//   });

//   const data = await notion.databases.query({
//     database_id: process.env.DATABASE_ID,
//   });

//   const blogs = [];

//   // console.log("DDDDD",data.results[0].properties.BannerImage.files[0].external.url);

//   data.results.forEach((result) => {
//     if (
//       result.parent.type === "database_id" &&
//       result.properties.Status?.status.name === "Done"
//     ) {
//       const title = result.properties.Title?.title[0]?.text.content || "";
//       const description =
//         result.properties.Description?.multi_select[0]?.name || "";
//       const datePublic = result.last_edited_time;
//       const parsedDate = new Date(datePublic);

//       const day = parsedDate.getDate().toString().padStart(2, "0");
//       const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
//       const year = parsedDate.getFullYear();
//       const formattedDate = `${day}-${month}-${year}`;
//       const imageBlog = result.properties.BannerImage.files[0].external.url;

//       blogs.push({
//         title,
//         description,
//         datePublic: formattedDate,
//         imageBlog,
//       });
//     }
//   });

//   return {
//     props: {
//       blogs,
//     },
//   };
// };

export const getServerSideProps = async () => {
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
      result.properties.Status?.status.name === "Done"
    ) {
      const title = result.properties.Title?.title[0]?.text.content || "";
      const description =
        result.properties.Description?.multi_select[0]?.name || "";
      const datePublic = result.last_edited_time;
      const parsedDate = new Date(datePublic);

      const day = parsedDate.getDate().toString().padStart(2, "0");
      const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
      const year = parsedDate.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;
      const imageBlog = result.properties.BannerImage.files[0].external.url;

      blogs.push({
        title,
        description,
        datePublic: formattedDate,
        imageBlog,
      });
    }
  });

  return {
    props: {
      blogs,
    },
  };
};

export default BlogPage;
