import { build } from 'esbuild';
import { gzip } from 'node:zlib';
import { promisify } from 'node:util';
import { unlinkSync, writeFileSync } from 'node:fs';
const compress = promisify(gzip);

function concatFiles(files) {
  return files.reduce((total, current) => total + current.text ?? '', '');
}

async function main() {
  try {
    unlinkSync('output.json');
  } catch (e) {}

  const result = await build({
    entryPoints: ['main.js'],
    bundle: true,
    minify: true,
    format: 'esm',
    outdir: 'dist',
    write: false,
    // exclude peer dependencies
    external: ['react', 'react-dom'],
  });

  const jsContent = concatFiles(result.outputFiles.filter(item => item.path.endsWith('.js')));
  const cssContent = concatFiles(result.outputFiles.filter(item => item.path.endsWith('.css')));
  if (!jsContent) {
    throw new Error('Build did not produce a JS file');
  }

  return {
    cssSize: cssContent.length,
    cssCompressedSize: await getCompressedSize(cssContent),
    jsSize: jsContent.length,
    jsCompressedSize: await getCompressedSize(jsContent),
  };
}

async function getCompressedSize(code) {
  if (!code) {
    return 0;
  }
  const compressed = await compress(typeof code === 'string' ? code : Buffer.from(code));
  return compressed.length;
}

main()
  .then(stats => {
    writeFileSync('output.json', JSON.stringify(stats));
    console.log('Result written to output.json');
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
