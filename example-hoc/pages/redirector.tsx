import { ServerResponse } from "http";
import { NextPage } from "next";

const moveToTop = (res: ServerResponse) => {
  res.writeHead(302, { Location: "/" });
  res.end();
};

const Page: NextPage = () => null;

Page.getInitialProps = async ({ res }) => {
  if (res == undefined) return {};

  moveToTop(res);

  return {};
};

export default Page;
