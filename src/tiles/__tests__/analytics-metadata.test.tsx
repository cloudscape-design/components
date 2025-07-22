// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import {
  activateAnalyticsMetadata,
  GeneratedAnalyticsMetadataFragment,
} from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

import FormField from '../../../lib/components/form-field';
import createWrapper from '../../../lib/components/test-utils/dom';
import Tiles, { TilesProps } from '../../../lib/components/tiles';
import InternalTiles from '../../../lib/components/tiles/internal';
import { validateComponentNameAndLabels } from '../../internal/__tests__/analytics-metadata-test-utils';

import tilesLabels from '../../../lib//components/tiles/analytics-metadata/styles.css.js';
import abstractSwitchlabels from '../../../lib/components/internal/components/abstract-switch/analytics-metadata/styles.css.js';

const labels = { ...abstractSwitchlabels, ...tilesLabels };
const items: TilesProps['items'] = [
  {
    value: 'first',
    label: 'First choice',
    disabled: true,
    description: 'This option is disabled.',
  },
  { value: 'second', label: 'Second choice' },
  { value: 'third', label: 'Third choice' },
];

const componentLabel = 'radio group example';

function renderTiles(props: TilesProps) {
  const renderResult = render(<Tiles {...props} items={items} ariaLabel={componentLabel} />);
  return createWrapper(renderResult.container).findTiles()!;
}

const getMetadata = (label: string, position: string, value: string, disabled?: boolean) => {
  const eventMetadata = {
    action: 'select',
    detail: {
      label,
      position,
      value,
    },
  };

  let metadata: GeneratedAnalyticsMetadataFragment = {
    contexts: [
      {
        type: 'component',
        detail: {
          name: 'awsui.Tiles',
          label: componentLabel,
        },
      },
    ],
  };
  if (!disabled) {
    metadata = { ...metadata, ...eventMetadata };
  }
  return metadata;
};

beforeAll(() => {
  activateAnalyticsMetadata(true);
});
describe('Tiles renders correct analytics metadata', () => {
  test('with disabled element', () => {
    const wrapper = renderTiles({ value: 'second' });

    // in the whole tile
    validateComponentNameAndLabels(wrapper.findItemByValue('second')!.getElement(), labels);
    expect(getGeneratedAnalyticsMetadata(wrapper.findItemByValue('second')!.getElement())).toEqual(
      getMetadata('Second choice', '2', 'second', false)
    );
    // in the radio within the tile
    validateComponentNameAndLabels(wrapper.findInputByValue('first')!.getElement(), labels);
    expect(getGeneratedAnalyticsMetadata(wrapper.findInputByValue('first')!.getElement())).toEqual(
      getMetadata('First choice', '2', 'first', true)
    );
  });
  test('readonly', () => {
    const wrapper = renderTiles({ value: 'second', readOnly: true });

    validateComponentNameAndLabels(wrapper.findInputByValue('second')!.getElement(), labels);
    expect(getGeneratedAnalyticsMetadata(wrapper.findInputByValue('second')!.getElement())).toEqual(
      getMetadata('Second choice', '2', 'second', true)
    );
  });
  describe('when rendered in a form field', () => {
    test('without aria label', () => {
      const renderResult = render(
        <FormField label="form field label">
          <Tiles items={items} value="2" />
        </FormField>
      );
      const element = createWrapper(renderResult.container).findTiles()!.getElement()!;
      expect(getGeneratedAnalyticsMetadata(element)).toEqual({
        contexts: [
          {
            type: 'component',
            detail: {
              name: 'awsui.Tiles',
              label: 'form field label',
            },
          },
          {
            type: 'component',
            detail: {
              name: 'awsui.FormField',
              label: 'form field label',
            },
          },
        ],
      });
    });
    test('with aria label', () => {
      const renderResult = render(
        <FormField label="form field label">
          <Tiles items={items} value="2" ariaLabel="aria label" />
        </FormField>
      );
      const element = createWrapper(renderResult.container).findTiles()!.getElement()!;
      expect(getGeneratedAnalyticsMetadata(element)).toEqual({
        contexts: [
          {
            type: 'component',
            detail: {
              name: 'awsui.Tiles',
              label: 'aria label',
            },
          },
          {
            type: 'component',
            detail: {
              name: 'awsui.FormField',
              label: 'form field label',
            },
          },
        ],
      });
    });
  });
});

test('Internal Tiles does not render "component" metadata', () => {
  const renderResult = render(<InternalTiles items={items} value="second" />);
  const element = createWrapper(renderResult.container).findTiles()!.findInputByValue('first')!.getElement();
  validateComponentNameAndLabels(element, labels);
  expect(getGeneratedAnalyticsMetadata(element)).toEqual({});
});
