import Image from "next/image";

export default function Posts(props) {
  const { title, content, bannerImage, datePublic, author, imageProfile } = props;

  return (
    <article className="">
      <div
        class="mb-4 md:mb-0 w-full max-w-screen-md mx-auto relative"
        style={{ height: "24em" }}
      >
        <div
          class="absolute left-0 bottom-0 w-full h-full z-10"
          style={{
            backgroundImage:
              "linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.7))",
          }}
        ></div>
        <img src={bannerImage} className="w-full h-full object-cover" />
        <div class="p-4 absolute bottom-0 left-0 z-20">
          <h2 class="text-5xl font-semibold text-gray-100 leading-tight">
            {title}
          </h2>
          <div class="flex mt-3">
            {/* Image profiule author */}
            <img
              src={imageProfile}
              class="h-10 w-10 rounded-full mr-2 object-cover"
            />
            {/* Image profiule author */}

            <div>
              <p class="font-semibold text-gray-200 text-sm"> {author} </p>
              <p class="font-semibold text-gray-400 text-xs"> {datePublic} </p>
            </div>
          </div>
        </div>
      </div>
      <div class="px-4 lg:px-0 mt-12 text-gray-700 max-w-screen-md mx-auto text-lg leading-relaxed">
        <div
          className="text-xl text-white mt-4 max-w-3xl leading-10 prose prose-p:text-white prose-headings:text-white text-justify"
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
      </div>
    </article>
  );
}
