module.exports = {
  apps: [
    {
      name: 'warehouse-helper-nextjs',
      script: 'npm start',
    },
  ],
  deploy: {
    production: {
      user: 'matveykalinin2001',
      host: '62.84.114.252',
      ref: 'origin/main',
      repo: 'git@github.com:mi-qacker/warehouse-helper.git',
      path: '/var/www/warehouse-helper-frontend',
      "pre-deploy" : "nvm --version",
      'post-deploy': 'npm install',
    },
  },
};
