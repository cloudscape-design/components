// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { activateAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
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

beforeAll(() => {
  activateAnalyticsMetadata(true);
});
describe('Tiles renders correct analytics metadata', () => {
  test('with disabled element', () => {
    const wrapper = renderTiles({ value: 'second' });

    // in the whole tile
    validateComponentNameAndLabels(wrapper.findItemByValue('second')!.getElement(), labels);
    expect(getGeneratedAnalyticsMetadata(wrapper.findItemByValue('second')!.getElement())).toMatchSnapshot();
    // in the radio within the tile
    validateComponentNameAndLabels(wrapper.findInputByValue('first')!.getElement(), labels);
    expect(getGeneratedAnalyticsMetadata(wrapper.findInputByValue('first')!.getElement())).toMatchSnapshot();
  });
  test('with null value', () => {
    const wrapper = renderTiles({ value: null });
    expect(getGeneratedAnalyticsMetadata(wrapper.findItemByValue('second')!.getElement())).toMatchSnapshot();
  });
  test('readonly', () => {
    const wrapper = renderTiles({ value: 'second', readOnly: true });

    validateComponentNameAndLabels(wrapper.findInputByValue('second')!.getElement(), labels);
    expect(getGeneratedAnalyticsMetadata(wrapper.findInputByValue('second')!.getElement())).toMatchSnapshot();
  });
  describe('when rendered in a form field', () => {
    test('without aria label', () => {
      const renderResult = render(
        <FormField label="form field label">
          <Tiles items={items} value="2" />
        </FormField>
      );
      const element = createWrapper(renderResult.container).findTiles()!.getElement()!;
      expect(getGeneratedAnalyticsMetadata(element)).toMatchSnapshot();
    });
    test('with aria label', () => {
      const renderResult = render(
        <FormField label="form field label">
          <Tiles items={items} value="2" ariaLabel="aria label" />
        </FormField>
      );
      const element = createWrapper(renderResult.container).findTiles()!.getElement()!;
      expect(getGeneratedAnalyticsMetadata(element)).toMatchSnapshot();
    });
  });
});

test('Internal Tiles does not render "component" metadata', () => {
  const renderResult = render(<InternalTiles items={items} value="second" />);
  const element = createWrapper(renderResult.container).findTiles()!.findInputByValue('first')!.getElement();
  validateComponentNameAndLabels(element, labels);
  expect(getGeneratedAnalyticsMetadata(element)).toMatchSnapshot();
});
