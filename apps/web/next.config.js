/** @type {import('next').NextConfig} */
module.exports = {
  images: {
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
