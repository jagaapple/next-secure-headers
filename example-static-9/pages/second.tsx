import Head from "next/head";
import Link from "next/link";

const Page = () => (
  <>
    <Head>
      <title>next-secure-headers Example (the second page)</title>
    </Head>

    <h1>The second page</h1>

    <hr />

    <Link href="/">
      <a>Move to the top page</a>
    </Link>
  </>
);

export default Page;
