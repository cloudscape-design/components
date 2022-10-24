import resolve from '@rollup/plugin-node-resolve';

export default {
  input: './lib/components/internal/vendor/d3-scale.js',
  output: {
    dir: './lib/components/internal/vendor',
    format: 'es',
    preserveModulesRoot: 'src/internal/vendor',
    // create a vendor chunk containing all dependencies inside node_modules
    manualChunks: (id) => {
      if (id.includes('node_modules')) {
        return 'vendor';
      }
    },
  },
  plugins: [
    resolve({
      extensions: ['.js'],
    }),
  ],
};
