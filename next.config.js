/** @type {import('next').NextConfig} */
const path = require('path') //for scss

const nextConfig = {
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
    images: {
        domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com', 'pbs.twimg.com', 'media.licdn.com', 'utfs.io', 'https://utfs.io', 'images.unsplash.com'],
    },
    reactStrictMode: false
};

module.exports = nextConfig;
