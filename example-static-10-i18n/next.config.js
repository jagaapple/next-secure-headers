const { createSecureHeaders } = require("next-secure-headers");

module.exports = {
  poweredByHeader: false,
  i18n: { locales: ["en", "ja"], defaultLocale: "en", },
  async headers() {
    return [
      {
        source: "/:path*",
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
