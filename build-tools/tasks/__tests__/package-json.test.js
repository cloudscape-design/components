// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const { getComponentsExports } = require('../package-json');
const { listPublicItems } = require('../../utils/files');

describe('getComponentsExports', () => {
  const exportsMap = getComponentsExports();

  test('keeps the test-utils barrel entry points', () => {
    expect(exportsMap['./test-utils/dom']).toBe('./test-utils/dom/index.js');
    expect(exportsMap['./test-utils/selectors']).toBe('./test-utils/selectors/index.js');
  });

  test('exposes every public component wrapper for dom and selectors', () => {
    const wrappers = listPublicItems('src/test-utils/dom');
    expect(wrappers).toContain('button');
    for (const wrapper of wrappers) {
      expect(exportsMap[`./test-utils/dom/${wrapper}`]).toBe(`./test-utils/dom/${wrapper}/index.js`);
      expect(exportsMap[`./test-utils/selectors/${wrapper}`]).toBe(`./test-utils/selectors/${wrapper}/index.js`);
    }
  });

  test('does not expose the internal test-utils directory as a component wrapper', () => {
    expect(exportsMap['./test-utils/dom/internal']).toBeUndefined();
    expect(exportsMap['./test-utils/selectors/internal']).toBeUndefined();
    // curated internal entry points remain explicitly exported
    expect(exportsMap['./test-utils/dom/internal/drag-handle']).toBe('./test-utils/dom/internal/drag-handle.js');
  });
});
