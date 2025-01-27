// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();

module.exports = {
  apps: [
    {
      name: 'warehouse-helper-nextjs',
      script: 'npm start',
    },
  ],
  deploy: {
    production: {
      user: process.env.PRODUCTION_USER,
      host: process.env.PRODUCTION_HOST,
      ref: 'origin/main',
      repo: 'git@github.com:mi-qacker/warehouse-helper.git',
      path: '/var/www/warehouse-helper-frontend',
      'post-deploy':
        'npm ci && pm2 startOrRestart ecosystem.config.js --env production',
    },
  },
};
