/** @type {import('next').NextConfig} */

const nextConfig = {
  output: process.env.DEVICE == "web" ? undefined : "export",
};

export default nextConfig;
