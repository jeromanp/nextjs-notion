import Image from "next/image";

export default function Recipes(props) {
  const { title, ingredients, method } = props;

  return (
    <article className="h-full flex flex-col items-center pt-7">
      <h1 className="text-6xl font-black text-white mb-5">{title}</h1>
      <div className="text-xl mt-4">
        <h2 className="text-3xl pb-4">Ingredientes</h2>
        <ul className="ml-5">
          {ingredients.map((ingredient, index) => (
            <li key={index}>
              <span className="font-bold">*</span> {ingredient}
            </li>
          ))}
        </ul>

        <h2 className="text-3xl pb-4">Preparación</h2>
        <ol className="ml-5">
          {method.map((step, index) => (
            <li key={index}>
              <span className="font-bold">{index + 1}.</span> {step}
            </li>
          ))}
        </ol>
        {/* <Image
        alt="Blog Image"
        src={bannerImage}
        // width={bannerImageWidth}
        width={800}
        height={bannerImageHeight}
        className="[width: 800px]!"
      /> */}
      </div>
    </article>
  );
}
