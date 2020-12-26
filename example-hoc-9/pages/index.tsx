import Head from "next/head";
import Link from "next/link";

const Page = () => (
  <>
    <Head>
      <title>next-secure-headers Example</title>
    </Head>

    <h1>Hello!</h1>
    <p>
      This page doesn't use <code>next-secure-headers</code>, but <code>_app.tsx</code> use instead.
    </p>
    <p>
      Check actual response headers from <code>Developer Tools &gt; Network &gt; Response Headers</code> in your web browser.
    </p>

    <Link href="/second">
      <a>Move to the second page</a>
    </Link>
  </>
);

export default Page;
