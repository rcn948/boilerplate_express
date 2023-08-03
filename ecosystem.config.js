module.exports = {
    apps : {
        name: '',
        script: './bin/www',
        args: 'one two',
        instances: 1,
        autorestart: false,
        watch: false,
        ignore_watch: ["node_modules", "public", "uploads"],
        env: {
            NODE_ENV: 'development',
            TZ: 'Asia/Seoul',
            DB_HOST: 'localhost',
            DB_USER: '',
            DB_PASS: '',
            DB_PORT: '' ,
            DB_NAME: ''

        },
        env_production: {
            NODE_ENV: 'production',
            TZ: 'Asia/Seoul',
            DB_HOST: 'localhost',
            DB_USER: '',
            DB_PASS: '',
            DB_PORT: '' ,
            DB_NAME: ''
        }
    },

    deploy : {
        production : {
            user : '',
            host : "",
            ref  : '',
            repo : '',
            path : '',
            // 'post-deploy' : 'npm install && sequelize db:seed && pm2 startOrRestart ecosystem.config.js --env production && pm2 save'
            'post-deploy' : 'npm install && pm2 startOrRestart ecosystem.config.js --env production && pm2 save'
        }
    }
};
