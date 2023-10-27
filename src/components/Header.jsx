import React from "react";
import Link from "next/link";

export default function Header() {
  return (
    <nav className="flex items-center justify-between flex-wrap p-6 bg-mostaza">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <Link href={"/"}>
          <img
            src="/assets/logo.png"
            alt="Logo Jose Eduardo Roman"
            classNameName="w-32 h-32"
          />
        </Link>

        <span className="font-semibold text-xl tracking-tight text-cafe">
          Jose Eduardo Roman
        </span>
      </div>
      <div className="block lg:hidden">
        <button className="flex items-center px-3 py-2 border rounded text-blue-200 border-teal-800 hover:text-white hover:border-white">
          <svg
            className="fill-current h-3 w-3"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div className="text-base lg:flex-grow ml-20">
          <Link
            href={"/"}
            className="block mt-4 lg:inline-block lg:mt-0 text-crema hover:text-white mr-12"
          >
            Inicio
          </Link>
          <Link
            href={"/recipes"}
            className="block mt-4 lg:inline-block lg:mt-0 text-crema hover:text-white mr-12"
          >
            Ejemplo Recetas
          </Link>
          <Link
            href={"/blogs"}
            className="block mt-4 lg:inline-block lg:mt-0 text-crema hover:text-white mr-12"
          >
            Ejemplo Blog
          </Link>
        </div>
      </div>
    </nav>
  );
}
