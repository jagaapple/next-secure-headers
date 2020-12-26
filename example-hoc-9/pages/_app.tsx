import App from "next/app";

import { withSecureHeaders } from "next-secure-headers";

class Application extends App {}

export default withSecureHeaders({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: "'self'",
      styleSrc: ["'self'", "https://stackpath.bootstrapcdn.com"],
    },
  },
  forceHTTPSRedirect: [true, { maxAge: 60 * 60 * 24 * 4, includeSubDomains: true }],
  referrerPolicy: "same-origin",
})(Application);
