// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const fs = require('fs');
const path = require('path');

const { writeFile } = require('../utils/files');

const DEFINITIONS_DIR = 'test/definitions/visual';
const RUNNERS_DIR = 'test/visual';

const header = `// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
`;

function runnerContent(name) {
  return (
    header +
    `import { runTestSuites } from '../definitions/utils';\n` +
    `import suite from '../definitions/visual/${name}';\n\n` +
    `runTestSuites([suite]);\n`
  );
}

module.exports = function generateVisualTests() {
  // Recreate the directory, removes anything inside it.
  fs.rmSync(RUNNERS_DIR, { recursive: true, force: true });
  fs.mkdirSync(RUNNERS_DIR, { recursive: true });

  const definitions = fs
    .readdirSync(DEFINITIONS_DIR)
    .filter(file => file.endsWith('.ts'))
    .map(file => path.basename(file, '.ts'));

  for (const name of definitions) {
    writeFile(path.join(RUNNERS_DIR, `${name}.test.ts`), runnerContent(name));
  }

  return Promise.resolve();
};
