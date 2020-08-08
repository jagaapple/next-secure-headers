const { createSecureHeaders } = require("next-secure-headers");

module.exports = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*?)",
        headers: createSecureHeaders({
          contentSecurityPolicy: {
            directives: {
              defaultSrc: "'self'",
              styleSrc: ["'self'", "https://stackpath.bootstrapcdn.com"],
            },
          },
          forceHTTPSRedirect: [true, { maxAge: 60 * 60 * 24 * 4, includeSubDomains: true }],
          referrerPolicy: "same-origin",
        }),
      },
    ];
  },
};
