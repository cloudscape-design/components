// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const { src, dest, series, parallel } = require('gulp');
const execa = require('execa');
const path = require('path');
const { pascalCase } = require('change-case');
const { default: convertToSelectorUtil } = require('@cloudscape-design/test-utils-converter');
const { through, task } = require('../utils/gulp-utils');
const { writeFile, listPublicItems } = require('../utils/files');
const { pluralizeComponentName } = require('../utils/pluralize');
const themes = require('../utils/themes');

function toWrapper(componentClass) {
  return `${componentClass}Wrapper`;
}

const testUtilsSrcDir = path.resolve('src/test-utils');
const configs = {
  common: {
    buildFinder: ({ componentName, componentNamePlural }) => `
      ElementWrapper.prototype.find${componentName} = function(selector) {
        const rootSelector = \`.$\{${toWrapper(componentName)}.rootSelector}\`;
        // casting to 'any' is needed to avoid this issue with generics
        // https://github.com/microsoft/TypeScript/issues/29132
        return (this as any).findComponent(selector ? appendSelector(selector, rootSelector) : rootSelector, ${toWrapper(componentName)});
      };

      ElementWrapper.prototype.findAll${componentNamePlural} = function(selector) {
        return this.findAllComponents(${toWrapper(componentName)}, selector);
      };`,
  },
  dom: {
    defaultExport: `export default function wrapper(root: Element = document.body) { if (document && document.body && !document.body.contains(root)) { console.warn('[AwsUi] [test-utils] provided element is not part of the document body, interactions may work incorrectly')}; return new ElementWrapper(root); }`,
    buildFinderInterface: ({ componentName, componentNamePlural }) => `
       /**
        * Returns the wrapper of the first ${componentName} that matches the specified CSS selector.
        * If no CSS selector is specified, returns the wrapper of the first ${componentName}.
        * If no matching ${componentName} is found, returns \`null\`.
        *
        * @param {string} [selector] CSS Selector
        * @returns {${toWrapper(componentName)} | null}
        */
       find${componentName}(selector?: string): ${toWrapper(componentName)} | null;

       /**
        * Returns an array of ${componentName} wrapper that matches the specified CSS selector.
        * If no CSS selector is specified, returns all of the ${componentNamePlural} inside the current wrapper.
        * If no matching ${componentName} is found, returns an empty array.
        *
        * @param {string} [selector] CSS Selector
        * @returns {Array<${toWrapper(componentName)}>}
        */
       findAll${componentNamePlural}(selector?: string): Array<${toWrapper(componentName)}>;`,
  },
  selectors: {
    defaultExport: `export default function wrapper(root: string = 'body') { return new ElementWrapper(root); }`,
    buildFinderInterface: ({ componentName, componentNamePlural }) => `
       /**
        * Returns a wrapper that matches the ${componentNamePlural} with the specified CSS selector.
        * If no CSS selector is specified, returns a wrapper that matches ${componentNamePlural}.
        *
        * @param {string} [selector] CSS Selector
        * @returns {${toWrapper(componentName)}}
        */
       find${componentName}(selector?: string): ${toWrapper(componentName)};

       /**
        * Returns a multi-element wrapper that matches ${componentNamePlural} with the specified CSS selector.
        * If no CSS selector is specified, returns a multi-element wrapper that matches ${componentNamePlural}.
        *
        * @param {string} [selector] CSS Selector
        * @returns {MultiElementWrapper<${toWrapper(componentName)}>}
        */
       findAll${componentNamePlural}(selector?: string): MultiElementWrapper<${toWrapper(componentName)}>;`,
  },
};

function generateFindersInterfaces({ testUtilMetaData, testUtilType, configs }) {
  const { buildFinderInterface } = configs[testUtilType];
  const findersInterfaces = testUtilMetaData.map(buildFinderInterface);

  // we need to redeclare the interface in its original definition, extending a re-export will not work
  // https://github.com/microsoft/TypeScript/issues/12607
  const interfaces = `declare module '@cloudscape-design/test-utils-core/dist/${testUtilType}' {
      interface ElementWrapper {
        ${findersInterfaces.join('\n')}
      }
  }`;

  return interfaces;
}

function generateFindersImplementations({ testUtilMetaData, configs }) {
  const { buildFinder } = configs.common;
  const findersImplementations = testUtilMetaData.map(buildFinder);

  return findersImplementations.join('\n');
}

function generateIndexFileContent(testUtilType, testUtilMetaData) {
  const config = configs[testUtilType];
  if (config === undefined) {
    throw new Error('Unknown test util type');
  }

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
    generateFindersInterfaces({ testUtilMetaData, testUtilType, configs }),
    generateFindersImplementations({ testUtilMetaData, configs }),
    config.defaultExport,
  ].join('\n');
}

function generateTestUtilMetaData(testUtilType) {
  const components = listPublicItems(path.join(testUtilsSrcDir, testUtilType));

  const metaData = components.reduce((allMetaData, componentFolderName) => {
    const absPathComponentFolder = path.resolve(testUtilsSrcDir, componentFolderName);
    const relPathtestUtilFile = `./${path.relative(testUtilsSrcDir, absPathComponentFolder)}`;

    const componentNameKebab = componentFolderName;
    const componentName = pascalCase(componentNameKebab);
    const componentNamePlural = pluralizeComponentName(componentName);

    const componentMetaData = {
      componentName,
      componentNamePlural,
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
