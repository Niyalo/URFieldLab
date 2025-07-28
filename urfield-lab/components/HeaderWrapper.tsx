"use client";

import Header from "./Header";
import { Year } from "@/sanity/sanity-utils";

type HeaderWrapperProps = {
  year: Year | null;
};

export default function HeaderWrapper(props: HeaderWrapperProps) {
  return <Header year={props.year} />;
}
