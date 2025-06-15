module.exports = {
  failFast: true,
  timeout: '60s',
  typescript: {
    rewritePaths: {
      'src/': 'build/main/',
    },
    compile: false,
  },
  files: [
    '!build/module/**',
  ],
};
