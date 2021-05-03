const path = require('path');

module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/tyov/' : '/',
    chainWebpack: config => {
        config
            .resolve
            .alias
            .set('Components', path.resolve(__dirname, 'src', 'components'))
            .set('Stores', path.resolve(__dirname, 'src', 'store'))
            .set('Libs', path.resolve(__dirname, 'src', 'lib'))
            .set('Migrations', path.resolve(__dirname, 'src', 'migrations'));
    },
}