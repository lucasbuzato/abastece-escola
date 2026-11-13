const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
config.maxWorkers = 2;
config.resolver.platforms = ['ios', 'android', 'web'];
config.resolver.useWatchman = false;
module.exports = config;
