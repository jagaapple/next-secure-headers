import Head from "next/head";

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
      Check actual response headers from <code>Developer Tools > Network > Response Headers</code> in your web browser.
    </p>
  </>
);

export default Page;
