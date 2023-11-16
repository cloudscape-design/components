import { build } from 'vite';
import { gzip } from 'node:zlib';
import { promisify } from 'node:util';
import { unlinkSync, writeFileSync } from 'node:fs';
import react from '@vitejs/plugin-react';
const compress = promisify(gzip);

async function main() {
  try {
    unlinkSync('output.txt');
  } catch (e) {}

  const result = await build({
    plugins: [react()],
    logLevel: 'silent',
  });

  const jsFile = result.output.find(item => item.fileName.includes('index') && item.fileName.endsWith('.js'));
  if (!jsFile) {
    throw new Error('Build did not produce a JS file');
  }
  if (jsFile.type !== 'chunk') {
    throw new Error("The JS file is not of type 'chunk'");
  }
  return await getCompressedSize(jsFile.code);
}

async function getCompressedSize(code) {
  const compressed = await compress(typeof code === 'string' ? code : Buffer.from(code));
  return compressed.length;
}

main()
  .then(bytes => {
    writeFileSync('output.txt', bytes.toString());
    console.log('Result written to output.txt');
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
