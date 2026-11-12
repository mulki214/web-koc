/** @type {import('next').NextConfig} */
const nextConfig = { output: 'standalone', outputFileTracingRoot: process.cwd(), images: { remotePatterns: [] } }
export default nextConfig
