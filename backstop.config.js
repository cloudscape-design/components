// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const glob = require('glob');

function findAllPages() {
  return glob.sync('**/*.page.tsx', { cwd: 'pages' }).map(file => file.replace(/\.page\.tsx$/, ''));
}

const skippedTests = [
  'tabs/responsive-permutations', // Currently has flaky behavior (AWSUI-17810)
];

const scenarios = findAllPages()
  .filter(pageName => pageName.indexOf('permutations') !== -1 && skippedTests.indexOf(pageName) === -1)
  .map(pageName => ({
    label: pageName,
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
    bitmaps_reference: 'backstop/bitmaps_reference',
    bitmaps_test: 'backstop/bitmaps_test',
    engine_scripts: 'backstop/engine_scripts',
    html_report: 'backstop/html_report',
    ci_report: 'backstop/ci_report',
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
