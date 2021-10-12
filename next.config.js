module.exports = {
    reactStrictMode: true,
    env: {
        APIKEY: process.env.APIKEY,
        AUTHDOMAIN: process.env.AUTHDOMAIN,
        DATABASEURL: process.env.DATABASEURL,
        PROJECTID: process.env.PROJECTID,
        STORAGEBUCKET: process.env.STORAGEBUCKET,
        MESSAGINGSENDERID: process.env.MESSAGINGSENDERID,
        APPID: process.env.APPID,
    },
    images: {
        domains: ['lh3.googleusercontent.com'],
    },
};
