/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    domains: ["https://roleplayer.maxpaj.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "roleplayer.maxpaj.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  transpilePackages: ["roleplayer"],
};
