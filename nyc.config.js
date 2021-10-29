module.exports = {
  extends: '@istanbuljs/nyc-config-typescript',
  exclude: [
    'src/spec/**',
  ],
};
