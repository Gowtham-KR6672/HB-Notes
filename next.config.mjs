import withPWAInit from "next-pwa";
import runtimeCaching from "next-pwa/cache.js";
import path from "path";

const withPWA = withPWAInit({
  dest: "public",
  disable:
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_APP_URL?.includes("localhost") ||
    process.env.NEXT_PUBLIC_APP_URL?.includes("127.0.0.1"),
  register: true,
  skipWaiting: true,
  buildExcludes: [/middleware-manifest\.json$/],
  runtimeCaching: [
    ...runtimeCaching,
    {
      urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "cloudinary-assets",
        expiration: {
          maxEntries: 120,
          maxAgeSeconds: 60 * 60 * 24 * 30
        }
      }
    }
  ],
  fallbacks: {
    document: "/offline"
  }
});

const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "DENY"
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff"
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin"
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()"
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin"
  }
];

const nextConfig = {
  outputFileTracingRoot: path.resolve(process.cwd()),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com"
      }
    ]
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders
      }
    ];
  }
};

export default withPWA(nextConfig);
