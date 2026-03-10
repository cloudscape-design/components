// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import AttributeEditor from '../../../lib/components/attribute-editor';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

afterEach(() => {
  (warnOnce as jest.Mock).mockReset();
});

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
    expect(warnOnce).not.toHaveBeenCalled();

    render(
      <AttributeEditor
        addButtonText="Add"
        removeButtonText="Remove"
        definition={[{ label: 'Key label', control: () => 'key' }, { control: () => 'value' }]}
        items={[{}]}
        gridLayout={[{ rows: [[1, 1]] }]}
      />
    );

    expect(warnOnce).toHaveBeenCalledTimes(1);
    expect(warnOnce).toHaveBeenCalledWith(
      'AttributeEditor',
      'A `label` should be provided for each field definition. It is used as `aria-label` for accessibility.'
    );
  });
});
