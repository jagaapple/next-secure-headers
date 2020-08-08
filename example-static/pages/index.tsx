import Head from "next/head";

const Page = () => (
  <>
    <Head>
      <title>next-secure-headers Example</title>
    </Head>

    <h1>Hello!</h1>
    <p>
      This project uses <code>next-secure-headers</code> in <code>next.config.js</code>.
    </p>
    <p>
      Check actual response headers from <code>Developer Tools > Network > Response Headers</code> in your web browser.
    </p>
  </>
);

export default Page;
