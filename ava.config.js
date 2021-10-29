export default {
  failFast: true,
  timeout: '60s',
  typescript: {
    rewritePaths: {
      'src/': 'build/main/',
    },
  },
  files: [
    '!build/module/**',
  ],
};
