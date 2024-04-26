// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const glob = require('glob');

function findAllPages() {
  return glob.sync('**/*.page.tsx', { cwd: 'pages' }).map(file => file.replace(/\.page\.tsx$/, ''));
}

const skippedTests = [
  'tabs/responsive-permutations', // Currently has flaky behavior (AWSUI-17810)
  'pie-chart/permutations', // Currently has flaky behavior (AWSUI-29588)
];

const scenarios = findAllPages()
  .filter(pageName => pageName.indexOf('permutations') !== -1 && skippedTests.indexOf(pageName) === -1)
  .map(pageName => ({
    label: pageName,
    // wait until code-editor is fully loaded and rendered error state
    readySelector: pageName === 'code-editor/permutations' ? '.ace_error' : undefined,
    url: `http://localhost:8080/#/light/${pageName}`,
    delay: 1000,
  }));

module.exports = {
  id: 'permutations',
  viewports: [
    {
      label: 'phone',
      width: 465,
      height: 480,
    },
    {
      label: 'desktop',
      width: 1320,
      height: 768,
    },
  ],
  scenarios,
  paths: {
    bitmaps_reference: 'backstop/report/bitmaps_reference',
    bitmaps_test: 'backstop/report/bitmaps_test',
    engine_scripts: 'backstop/engine_scripts',
    html_report: 'backstop/report/html_report',
    ci_report: 'backstop/report/ci_report',
  },
  report: ['browser'],
  engine: 'puppeteer',
  engineOptions: {
    args: ['--no-sandbox', '--disable-gpu', '--headless', '--force-prefers-reduced-motion'],
  },
  asyncCaptureLimit: 5,
  asyncCompareLimit: 5,
  resembleOutputOptions: {
    ignoreAntialiasing: true,
  },
};
