import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: '/parameters',
        destination: '/parameters/warehouse',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
