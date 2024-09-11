/** @type {import('next').NextConfig} */

const { DEVICE } = process.env;

const nextConfig = {
  output: DEVICE == "web" ? undefined : "export",
  publicRuntimeConfig: {
    DEVICE,
  },
};

export default nextConfig;
