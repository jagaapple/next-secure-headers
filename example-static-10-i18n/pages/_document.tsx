import Document, { Html, Main, Head, NextScript } from "next/document";
import * as React from "react";

export default class extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            rel="stylesheet"
            href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
            integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
            crossOrigin="anonymous"
          />
        </Head>

        <body className="p-4">
          <React.StrictMode>
            <Main />
            <NextScript />
          </React.StrictMode>
        </body>
      </Html>
    );
  }
}
