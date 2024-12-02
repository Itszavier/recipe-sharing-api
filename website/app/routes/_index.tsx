/** @format */

import type { MetaFunction } from "@remix-run/node";
import { LoaderFunction } from "react-router";

export const loader: LoaderFunction = () => {
  return null;
};



export const meta: MetaFunction = () => {
  return [
    { title: "FoodLibrary" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return <div className=""></div>;
}
