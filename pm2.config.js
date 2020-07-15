module.exports = {
  apps: [
    {
      name: 'notely-backend',
      script: '/var/www/node_modules/.bin/ts-node',
      args: '--transpile-only -r tsconfig-paths/register src/main.ts',
      watch: true,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        S3_BUCKET: 'notely-prod',
      },
    },
  ],
};
