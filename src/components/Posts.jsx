import Image from "next/image";

export default function Posts(props) {
  const {
    title,
    description,
    content,
    bannerImage,
    bannerImageWidth,
    bannerImageHeight,
  } = props;

  return (
    <article className="w-full mb-10 flex flex-col items-center pt-20">
      <h1 className="text-6xl font-black text-white mb-8">{title}</h1>
      <div className="py-5">
        <img
          alt="Blog Image"
          src={bannerImage}
          width={bannerImageWidth}
          height={bannerImageHeight}
          className="[width: 800px]!"
        />
      </div>
      <div
        className="text-xl mt-4 max-w-3xl leading-10 prose prose-p:text-white prose-headings:text-white text-justify"
        dangerouslySetInnerHTML={{ __html: content }}
      ></div>
    </article>
  );
}
