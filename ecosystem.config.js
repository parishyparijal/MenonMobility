module.exports = {
  apps: [
    {
      name: 'menon-web',
      script: 'npx',
      args: 'next start -p 3000',
      cwd: '/var/www/MenonMobility/apps/web',
      instances: 1,
      autorestart: true,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'menon-api',
      script: 'npx',
      args: 'tsx src/server.ts',
      cwd: '/var/www/MenonMobility/apps/api',
      instances: 1,
      autorestart: true,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        API_PORT: '5001',
        CORS_ORIGIN: 'https://menonmobility.byredstone.com',
      },
    },
  ],
};
