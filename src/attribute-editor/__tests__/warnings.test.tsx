// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import AttributeEditor from '../../../lib/components/attribute-editor';

jest.mock('@cloudscape-design/component-toolkit', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit'),
  useContainerQuery: jest.fn().mockImplementation(() => ['m', () => {}]),
}));

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

afterEach(() => {
  (warnOnce as jest.Mock).mockReset();
});

const layoutProps = {
  addButtonText: 'Add',
  removeButtonText: 'Remove',
  definition: [
    { label: 'Key label', control: () => 'key' },
    { label: 'Value label', control: () => 'value' },
    { label: 'Type label', control: () => 'type' },
  ],
  items: [{}],
};

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

  test('warns when no grid layout is supplied for more than 6 attributes', () => {
    render(<AttributeEditor {...layoutProps} definition={new Array(7).fill({ label: 'Label' })} />);
    expect(warnOnce).toHaveBeenCalledWith(
      'AttributeEditor',
      '`gridLayout` is required for more than 6 attributes. Cannot render.'
    );
  });

  test('warns when no grid layout is found for the current breakpoint', () => {
    render(<AttributeEditor {...layoutProps} gridLayout={[{ breakpoint: 'xl', rows: [] }]} />);
    expect(warnOnce).toHaveBeenCalledWith(
      'AttributeEditor',
      'No `gridLayout` entry found for breakpoint m. Cannot render.'
    );
  });

  test('warns when the grid layout does not match the definition', () => {
    render(<AttributeEditor {...layoutProps} gridLayout={[{ rows: [[1]] }]} />);
    expect(warnOnce).toHaveBeenCalledWith(
      'AttributeEditor',
      'Incorrect number of columns in layout (1) for definition (3). Cannot render.'
    );
  });
});
