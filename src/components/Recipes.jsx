import Image from "next/image";

export default function Recipes(props) {
  const { title, content } = props;
  const contentWithoutCommas = content.join('');

  return (
    <article className="h-full flex flex-col items-center pt-7">
      <h1 className="text-6xl font-black text-white mb-5">{title}</h1>
      <div className="text-xl mt-4">
        <div
          className="text-xl mt-4 max-w-3xl leading-10 prose prose-p:text-white prose-headings:text-white text-justify"
          dangerouslySetInnerHTML={{ __html: contentWithoutCommas }}
        ></div>
      </div>
    </article>
  );
}
