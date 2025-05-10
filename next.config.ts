import type {NextConfig} from 'next';
import CopyPlugin from 'copy-webpack-plugin';

const nextConfig: NextConfig = {
  webpack: (config, {isServer, dev}) => {
    if (isServer) {
      // config.experiments = {...config.experiments, asyncWebAssembly: true};
      // config.module.rules.push({
      //   test: /\.wasm$/,
      //   type: 'asset/resource',
      // });
      config.plugins.push(
        new CopyPlugin({
          patterns: [
            {
              from: 'node_modules/glpk.js/dist/glpk.wasm',
              to: dev ? 'vendor-chunks/glpk.wasm' : 'chunks/glpk.wasm',
            },
          ],
        })
      );
    }

    return config;
  },
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
