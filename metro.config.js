const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add 'gguf' to the list of asset extensions
config.resolver.assetExts.push('gguf');
config.resolver.assetExts.push('bin');
module.exports = config;