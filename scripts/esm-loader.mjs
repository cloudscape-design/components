import { resolve as resolvePath } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { existsSync } from 'fs';

export function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('.')) {
    const base = fileURLToPath(context.parentURL);
    const dir = resolvePath(base, '..');
    const candidate = resolvePath(dir, specifier + '.js');
    if (existsSync(candidate)) {
      return { shortCircuit: true, url: pathToFileURL(candidate).href };
    }
  }
  return nextResolve(specifier, context);
}
