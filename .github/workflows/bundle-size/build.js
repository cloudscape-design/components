import { build } from 'vite';
import { gzip } from 'node:zlib';
import { promisify } from 'node:util';
import { unlinkSync, writeFileSync } from 'node:fs';
import react from '@vitejs/plugin-react';
const compress = promisify(gzip);

function concatFiles(files) {
  return files.reduce((total, current) => total + (current.code ?? current.source ?? ''), '');
}

async function main() {
  try {
    unlinkSync('output.txt');
  } catch (e) {}

  const result = await build({
    plugins: [react()],
  });

  const jsContent = concatFiles(result.output.filter(item => item.fileName.endsWith('.js')));
  const cssContent = concatFiles(result.output.filter(item => item.fileName.endsWith('.css')));
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
