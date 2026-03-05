// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import AttributeEditor from '../../../lib/components/attribute-editor';

jest.mock('@cloudscape-design/component-toolkit', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit'),
  useContainerQuery: jest.fn().mockImplementation(() => ['m', () => {}]),
}));

let consoleWarnSpy: jest.SpyInstance;
beforeEach(() => {
  consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
});
afterEach(() => {
  consoleWarnSpy?.mockRestore();
});

/**
 * This test suite is in a separate file, because it needs a clean messageCache (inside `warnOnce()`).
 * Otherwise, warnings would not appear at the expected time in the test, because they have been issued before.
 */
describe('AttributeEditor component', () => {
  test('warns when a definition has no label', () => {
    render(
      <AttributeEditor
        addButtonText="Add"
        removeButtonText="Remove"
        definition={[{ label: 'Key label', control: () => 'key' }]}
        items={[{}]}
        gridLayout={[{ rows: [[1]] }]}
      />
    );
    expect(console.warn).not.toHaveBeenCalled();

    render(
      <AttributeEditor
        addButtonText="Add"
        removeButtonText="Remove"
        definition={[{ label: 'Key label', control: () => 'key' }, { control: () => 'value' }]}
        items={[{}]}
        gridLayout={[{ rows: [[1, 1]] }]}
      />
    );

    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith(
      '[AwsUi] [AttributeEditor] A `label` should be provided for each field definition. It is used as `aria-label` for accessibility.'
    );
  });
});
