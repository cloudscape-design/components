// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const { src, dest, series, parallel } = require('gulp');
const execa = require('execa');
const path = require('path');
const { pascalCase } = require('change-case');
const { default: convertToSelectorUtil } = require('@cloudscape-design/test-utils-converter');
const { through, task } = require('../utils/gulp-utils');
const { writeFile, listPublicItems } = require('../utils/files');
const themes = require('../utils/themes');

function toWrapper(componentClass) {
  return `${componentClass}Wrapper`;
}

const testUtilsSrcDir = path.resolve('src/test-utils');
const configs = {
  dom: {
    defaultExport: `export default function wrapper(root: Element = document.body) { if (document && document.body && !document.body.contains(root)) { console.warn('[AwsUi] [test-utils] provided element is not part of the document body, interactions may work incorrectly')}; return new ElementWrapper(root); }`,
    buildFinderInterface: ({ componentName }) =>
      `find${componentName}(selector?: string): ${toWrapper(componentName)} | null;`,
  },
  selectors: {
    defaultExport: `export default function wrapper(root: string = 'body') { return new ElementWrapper(root); }`,
    buildFinderInterface: ({ componentName }) =>
      `find${componentName}(selector?: string): ${toWrapper(componentName)};`,
  },
};

function generateIndexFileContent(testUtilType, testUtilMetaData) {
  const config = configs[testUtilType];
  if (config === undefined) {
    throw new Error('Unknown test util type');
  }
  const { defaultExport, buildFinderInterface } = config;

  return [
    // language=TypeScript
    `import { ElementWrapper } from '@cloudscape-design/test-utils-core/${testUtilType}';`,
    `import { appendSelector } from '@cloudscape-design/test-utils-core/utils';`,
    `export { ElementWrapper };`,
    ...testUtilMetaData.map(metaData => {
      const { componentName, relPathtestUtilFile } = metaData;

      return `
        import ${toWrapper(componentName)} from '${relPathtestUtilFile}';
        export { ${componentName}Wrapper };
      `;
    }),
    // we need to redeclare the interface in its original definition, extending a re-export will not work
    // https://github.com/microsoft/TypeScript/issues/12607
    `declare module '@cloudscape-design/test-utils-core/dist/${testUtilType}' {
      interface ElementWrapper {
        ${testUtilMetaData.map(metaData => buildFinderInterface(metaData)).join('\n')}
      }
    }`,
    ...testUtilMetaData.map(({ componentName }) => {
      const wrapperName = toWrapper(componentName);
      // language=TypeScript
      return `ElementWrapper.prototype.find${componentName} = function(selector) {
          const rootSelector = \`.$\{${wrapperName}.rootSelector}\`;
          // casting to 'any' is needed to avoid this issue with generics
          // https://github.com/microsoft/TypeScript/issues/29132
          return (this as any).findComponent(selector ? appendSelector(selector, rootSelector) : rootSelector, ${wrapperName});
      };`;
    }),
    defaultExport,
  ].join('\n');
}

function generateTestUtilMetaData(testUtilType) {
  const components = listPublicItems(path.join(testUtilsSrcDir, testUtilType));

  const metaData = components.reduce((allMetaData, componentFolderName) => {
    const absPathComponentFolder = path.resolve(testUtilsSrcDir, componentFolderName);
    const relPathtestUtilFile = `./${path.relative(testUtilsSrcDir, absPathComponentFolder)}`;

    const componentNameKebab = componentFolderName;
    const componentName = pascalCase(componentNameKebab);

    const componentMetaData = {
      componentName,
      relPathtestUtilFile,
    };

    return allMetaData.concat(componentMetaData);
  }, []);

  return metaData;
}

function writeContentToIndexTsFile(content, testUtilType) {
  const filepath = path.join(testUtilsSrcDir, testUtilType, 'index.ts');
  writeFile(filepath, content);
}

function generateIndexTsFile(signalCompletion, testUtilType) {
  const testUtilMetaData = generateTestUtilMetaData(testUtilType);
  const content = generateIndexFileContent(testUtilType, testUtilMetaData);
  writeContentToIndexTsFile(content, testUtilType);

  signalCompletion();
}

function compileTypescript(theme) {
  return task(`typescript:test-utils:${theme.name}`, async () => {
    const config = path.resolve(testUtilsSrcDir, 'tsconfig.json');
    const outDir = path.join(theme.outputPath, 'test-utils');
    await execa('tsc', ['-p', config, '--outDir', outDir, '--sourceMap'], { stdio: 'inherit' });
  });
}

function generateIndexFiles(signalCompletion) {
  generateIndexTsFile(signalCompletion, 'dom');
  generateIndexTsFile(signalCompletion, 'selectors');

  signalCompletion();
}

function generateSelectorUtils() {
  return src(['**/*.ts', '!index.ts'], { cwd: path.join(testUtilsSrcDir, 'dom') })
    .pipe(
      through(file => {
        const converted = convertToSelectorUtil(file.contents.toString());
        file.contents = Buffer.from(converted);
        return file;
      })
    )
    .pipe(dest(path.join(testUtilsSrcDir, 'selectors')));
}

module.exports = series(
  generateSelectorUtils,
  generateIndexFiles,
  parallel(themes.map(theme => compileTypescript(theme)))
);
