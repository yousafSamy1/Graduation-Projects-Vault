/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow PDF parsing in API routes
  serverExternalPackages: ['pdf-parse'],
};

export default nextConfig;
