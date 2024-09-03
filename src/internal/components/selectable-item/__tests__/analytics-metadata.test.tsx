// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { activateAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

import createWrapper from '../../../../..//lib/components/test-utils/dom';
import Option from '../../../../../lib/components/internal/components/option';
import SelectableItems, {
  ItemDataAttributes,
  SelectableItemProps,
} from '../../../../../lib/components/internal/components/selectable-item';
import { validateComponentNameAndLabels } from '../../../../internal/__tests__/analytics-metadata-test-utils';

import optionLabels from '../../../../../lib/components/internal/components/option/analytics-metadata/styles.css.js';
import selectableItemsLabels from '../../../../../lib/components/internal/components/selectable-item/analytics-metadata/styles.css.js';
import styles from '../../../../../lib/components/internal/components/selectable-item/styles.css.js';

const labels = { ...selectableItemsLabels, ...optionLabels };

function renderSelectableItem(props: Partial<SelectableItemProps> & ItemDataAttributes) {
  const children = props.children || 'content';
  const renderResult = render(<SelectableItems {...props}>{children}</SelectableItems>);
  return createWrapper(renderResult.container).find(`.${styles['selectable-item']}`)!.getElement();
}
beforeAll(() => {
  activateAnalyticsMetadata(true);
});

describe('SelectableItem renders correct analytics metadata', () => {
  test('when isParent=true', () => {
    const element = renderSelectableItem({ isParent: true });
    expect(getGeneratedAnalyticsMetadata(element)).toEqual({});
  });
  test('when disabled', () => {
    const element = renderSelectableItem({ disabled: true });
    expect(getGeneratedAnalyticsMetadata(element)).toEqual({});
  });
  test('with simple content', () => {
    const element = renderSelectableItem({ children: 'content label' });
    validateComponentNameAndLabels(element, labels);
    expect(getGeneratedAnalyticsMetadata(element)).toEqual({
      action: 'select',
      detail: {
        label: 'content label',
      },
    });
  });
  test('with value', () => {
    const element = renderSelectableItem({ value: 'item-value' });
    validateComponentNameAndLabels(element, labels);
    expect(getGeneratedAnalyticsMetadata(element)).toEqual({
      action: 'select',
      detail: {
        label: 'content',
        value: 'item-value',
      },
    });
  });
  test('with data-test-index', () => {
    const element = renderSelectableItem({ 'data-test-index': '50' });
    validateComponentNameAndLabels(element, labels);
    expect(getGeneratedAnalyticsMetadata(element)).toEqual({
      action: 'select',
      detail: {
        label: 'content',
        position: '50',
      },
    });
  });
  describe('with Option component', () => {
    test('simple option', () => {
      const renderResult = render(
        <SelectableItems>
          <Option option={{ value: 'test value' }} />
        </SelectableItems>
      );
      const element = createWrapper(renderResult.container).find(`.${styles['selectable-item']}`)!.getElement();
      validateComponentNameAndLabels(element, labels);
      expect(getGeneratedAnalyticsMetadata(element)).toEqual({
        action: 'select',
        detail: {
          label: 'test value',
        },
      });
    });
    test('complex option', () => {
      const renderResult = render(
        <SelectableItems>
          <Option
            option={{
              value: 'test value',
              label: 'label',
              tags: ['A', 'B', 'C'],
              description: 'to ignore',
            }}
            highlightText="lab"
          />
        </SelectableItems>
      );
      const element = createWrapper(renderResult.container).find(`.${styles['selectable-item']}`)!.getElement();
      validateComponentNameAndLabels(element, labels);
      expect(getGeneratedAnalyticsMetadata(element)).toEqual({
        action: 'select',
        detail: {
          label: 'label',
        },
      });
    });
  });
  describe('with isChild=true', () => {
    test('with simple content', () => {
      const element = renderSelectableItem({ isChild: true });
      validateComponentNameAndLabels(element, labels);
      expect(getGeneratedAnalyticsMetadata(element)).toEqual({
        action: 'select',
        detail: {
          label: 'content',
          groupLabel: '',
        },
      });
    });
    test('with value', () => {
      const element = renderSelectableItem({ value: 'item-value', isChild: true });
      validateComponentNameAndLabels(element, labels);
      expect(getGeneratedAnalyticsMetadata(element)).toEqual({
        action: 'select',
        detail: {
          label: 'content',
          value: 'item-value',
          groupLabel: '',
        },
      });
    });
    test('with data-test-index', () => {
      const element = renderSelectableItem({ 'data-test-index': '50', isChild: true });
      validateComponentNameAndLabels(element, labels);
      expect(getGeneratedAnalyticsMetadata(element)).toEqual({
        action: 'select',
        detail: {
          label: 'content',
          position: '50',
          groupLabel: '',
        },
      });
    });
    test('with data-group-index', () => {
      const element = renderSelectableItem({ 'data-group-index': '5', isChild: true });
      validateComponentNameAndLabels(element, labels);
      expect(getGeneratedAnalyticsMetadata(element)).toEqual({
        action: 'select',
        detail: {
          label: 'content',
          groupLabel: '',
        },
      });
    });
    test('with data-group-index and data-in-group-index', () => {
      const element = renderSelectableItem({ 'data-group-index': '5', 'data-in-group-index': '1', isChild: true });
      validateComponentNameAndLabels(element, labels);
      expect(getGeneratedAnalyticsMetadata(element)).toEqual({
        action: 'select',
        detail: {
          label: 'content',
          position: '5,1',
          groupLabel: '',
        },
      });
    });
    test('with data-group-index and data-child-index', () => {
      const element = renderSelectableItem({ 'data-group-index': '5', 'data-child-index': '2', isChild: true });
      validateComponentNameAndLabels(element, labels);
      expect(getGeneratedAnalyticsMetadata(element)).toEqual({
        action: 'select',
        detail: {
          label: 'content',
          position: '5,2',
          groupLabel: '',
        },
      });
    });
    test('with parent element', () => {
      const renderResult = render(
        <>
          <SelectableItems isParent={true} data-group-index="6">
            Parent label
          </SelectableItems>
          <div id="test">
            <SelectableItems isChild={true} data-group-index="6" data-in-group-index="1">
              item label
            </SelectableItems>
          </div>
        </>
      );
      const element = createWrapper(renderResult.container)
        .find('#test')!
        .find(`.${styles['selectable-item']}`)!
        .getElement();
      validateComponentNameAndLabels(element, labels);
      expect(getGeneratedAnalyticsMetadata(element)).toEqual({
        action: 'select',
        detail: {
          label: 'item label',
          position: '6,1',
          groupLabel: 'Parent label',
        },
      });
    });
  });
});
