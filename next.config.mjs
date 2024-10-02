/** @type {import('next').NextConfig} */

const { DEVICE, API_URL } = process.env;

const nextConfig = {
  output: DEVICE == "web" ? undefined : "export",
  publicRuntimeConfig: {
    DEVICE,
    API_URL,
  },
};

export default nextConfig;
