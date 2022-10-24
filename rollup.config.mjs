import resolve from '@rollup/plugin-node-resolve';

export default {
  input: './src/internal/vendor/d3-scale.ts',
  output: {
    dir: './lib/components/internal/vendor',
    format: 'es',
    preserveModulesRoot: 'src/internal/vendor',
  },
  plugins: [
    resolve({
      extensions: ['.js'],
    }),
  ],
};
