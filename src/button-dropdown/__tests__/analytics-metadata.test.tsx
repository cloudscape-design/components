// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import {
  activateAnalyticsMetadata,
  GeneratedAnalyticsMetadataFragment,
} from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

import ButtonDropdown, { ButtonDropdownProps } from '../../../lib/components/button-dropdown';
import InternalButtonDropdown from '../../../lib/components/button-dropdown/internal';
import createWrapper from '../../../lib/components/test-utils/dom';
import { validateComponentNameAndLabels } from '../../internal/__tests__/analytics-metadata-test-utils';

import labels from '../../../lib/components/button-dropdown/analytics-metadata/styles.css.js';

function renderButtonDropdown(props: ButtonDropdownProps) {
  const renderResult = render(<ButtonDropdown {...props} />);
  return createWrapper(renderResult.container).findButtonDropdown()!;
}

const getMetadataContexts = (label: string, variant: string, disabled?: boolean) => {
  const metadata: GeneratedAnalyticsMetadataFragment = {
    contexts: [
      {
        type: 'component',
        detail: {
          name: 'awsui.ButtonDropdown',
          label,
          properties: {
            variant,
            disabled: disabled ? 'true' : 'false',
          },
        },
      },
    ],
  };
  return metadata;
};

const items: ButtonDropdownProps['items'] = [
  { text: 'Delete', id: 'rm', disabled: false, href: '#' },
  { text: 'Rename', id: 'rn', disabled: true },
  {
    text: 'Instances',
    id: 'instances',
    items: [
      { text: 'Destroy', id: 'destroy' },
      { text: 'Restart', id: 'restart' },
    ],
  },
  {
    text: 'SSH',
    id: 'ssh',
    disabled: true,
    items: [{ text: 'Upload key', id: 'upload' }],
  },
];

beforeAll(() => {
  activateAnalyticsMetadata(true);
});
describe('Button Dropdown renders correct analytics metadata', () => {
  describe('in the trigger', () => {
    test('when a label is present', () => {
      const label = 'Action text';
      const wrapper = renderButtonDropdown({
        items,
        children: label,
      });
      const nativeButton = wrapper.findTriggerButton()!.getElement();
      validateComponentNameAndLabels(nativeButton, labels);
      expect(getGeneratedAnalyticsMetadata(nativeButton)).toEqual({
        action: 'expand',
        detail: { label },
        ...getMetadataContexts(label, 'normal'),
      });
    });
    test('when expanded', () => {
      const label = 'Action text';
      const wrapper = renderButtonDropdown({
        items,
        children: label,
      });
      wrapper.findTriggerButton()?.click();
      const nativeButton = wrapper.findTriggerButton()!.getElement();
      validateComponentNameAndLabels(nativeButton, labels);
      expect(getGeneratedAnalyticsMetadata(nativeButton)).toEqual({
        action: 'collapse',
        detail: { label },
        ...getMetadataContexts(label, 'normal'),
      });
    });
    test('when disabled', () => {
      const label = 'Action text';
      const wrapper = renderButtonDropdown({
        items,
        children: label,
        disabled: true,
      });
      const nativeButton = wrapper.findTriggerButton()!.getElement();
      validateComponentNameAndLabels(nativeButton, labels);
      expect(getGeneratedAnalyticsMetadata(nativeButton)).toEqual(getMetadataContexts(label, 'normal', true));
    });
    test('with icon variant', () => {
      const label = 'Action text';
      const wrapper = renderButtonDropdown({
        items,
        ariaLabel: label,
        variant: 'icon',
      });
      const nativeButton = wrapper.findTriggerButton()!.getElement();
      validateComponentNameAndLabels(nativeButton, labels);
      expect(getGeneratedAnalyticsMetadata(nativeButton)).toEqual({
        action: 'expand',
        detail: { label },
        ...getMetadataContexts(label, 'icon'),
      });
    });
    test('with primary variant', () => {
      const label = 'Action text';
      const wrapper = renderButtonDropdown({
        items,
        children: label,
        variant: 'primary',
      });
      const nativeButton = wrapper.findTriggerButton()!.getElement();
      validateComponentNameAndLabels(nativeButton, labels);
      expect(getGeneratedAnalyticsMetadata(nativeButton)).toEqual({
        action: 'expand',
        detail: { label },
        ...getMetadataContexts(label, 'primary'),
      });
    });
    test('with main action', () => {
      const label = 'Action text';
      const wrapper = renderButtonDropdown({
        items,
        ariaLabel: label,
        variant: 'primary',
        mainAction: { text: 'Launch instance' },
      });
      const nativeButton = wrapper.findTriggerButton()!.getElement();
      validateComponentNameAndLabels(nativeButton, labels);
      expect(getGeneratedAnalyticsMetadata(nativeButton)).toEqual({
        action: 'expand',
        detail: { label },
        ...getMetadataContexts(label, 'primary'),
      });
      const mainAction = wrapper.findMainAction()!.getElement();
      validateComponentNameAndLabels(mainAction, labels);
      expect(getGeneratedAnalyticsMetadata(mainAction)).toEqual({
        action: 'click',
        detail: { label: 'Launch instance' },
        ...getMetadataContexts(label, 'primary'),
      });
    });
  });
  describe('in the items', () => {
    test('for simple items', () => {
      const label = 'Action text';
      const wrapper = renderButtonDropdown({
        items,
        children: label,
      });
      wrapper.openDropdown();
      const enabledSimpleItem = wrapper.findItemById('rm')!.getElement();
      validateComponentNameAndLabels(enabledSimpleItem, labels);
      expect(getGeneratedAnalyticsMetadata(enabledSimpleItem)).toEqual({
        action: 'click',
        detail: { label: 'Delete', id: 'rm', position: '1', href: '#' },
        ...getMetadataContexts(label, 'normal'),
      });

      const disabledSimpleItem = wrapper.findItemById('rn')!.getElement();
      validateComponentNameAndLabels(disabledSimpleItem, labels);
      expect(getGeneratedAnalyticsMetadata(disabledSimpleItem)).toEqual({
        ...getMetadataContexts(label, 'normal'),
      });
    });
    test('for simple items displayed in portal', () => {
      const label = 'Action text';
      const wrapper = renderButtonDropdown({
        items,
        children: label,
        expandToViewport: true,
      });
      wrapper.openDropdown();
      const enabledSimpleItem = wrapper.findItemById('rm')!.getElement();
      validateComponentNameAndLabels(enabledSimpleItem, labels);
      expect(getGeneratedAnalyticsMetadata(enabledSimpleItem)).toEqual({
        action: 'click',
        detail: { label: 'Delete', id: 'rm', position: '1', href: '#' },
        ...getMetadataContexts(label, 'normal'),
      });
    });
    test('for nested items', () => {
      const label = 'Action text';
      const wrapper = renderButtonDropdown({
        items,
        children: label,
      });
      wrapper.openDropdown();
      const enabledNestedItem = wrapper.findItemById('restart')!.getElement();
      validateComponentNameAndLabels(enabledNestedItem, labels);
      expect(getGeneratedAnalyticsMetadata(enabledNestedItem)).toEqual({
        action: 'click',
        detail: { label: 'Restart', id: 'restart', position: '3,2', href: '' },
        ...getMetadataContexts(label, 'normal'),
      });

      const disabledNestedItem = wrapper.findItemById('upload')!.getElement();
      validateComponentNameAndLabels(disabledNestedItem, labels);
      expect(getGeneratedAnalyticsMetadata(disabledNestedItem)).toEqual({
        ...getMetadataContexts(label, 'normal'),
      });
    });
    test('for expandable groups', () => {
      const label = 'Action text';
      const wrapper = renderButtonDropdown({
        items,
        children: label,
        expandableGroups: true,
      });
      wrapper.openDropdown();

      const enabledCategory = wrapper.findExpandableCategoryById('instances')!.find('svg')!.getElement();
      validateComponentNameAndLabels(enabledCategory, labels);
      expect(getGeneratedAnalyticsMetadata(enabledCategory)).toEqual({
        action: 'expand',
        detail: { label: 'Instances', id: 'instances', position: '3' },
        ...getMetadataContexts(label, 'normal'),
      });

      wrapper.findExpandableCategoryById('instances')?.click();
      expect(getGeneratedAnalyticsMetadata(enabledCategory)).toEqual({
        action: 'collapse',
        detail: { label: 'Instances', id: 'instances', position: '3' },
        ...getMetadataContexts(label, 'normal'),
      });

      const disabledCategory = wrapper.findExpandableCategoryById('ssh')!.find('svg')!.getElement();
      validateComponentNameAndLabels(disabledCategory, labels);
      expect(getGeneratedAnalyticsMetadata(disabledCategory)).toEqual({
        ...getMetadataContexts(label, 'normal'),
      });
    });

    test('for nested items in expandable groups', () => {
      const label = 'Action text';
      const wrapper = renderButtonDropdown({
        items,
        children: label,
        expandableGroups: true,
      });
      wrapper.openDropdown();
      wrapper.findExpandableCategoryById('instances')?.click();

      const enabledNestedItem = wrapper.findItemById('restart')!.getElement();
      validateComponentNameAndLabels(enabledNestedItem, labels);
      expect(getGeneratedAnalyticsMetadata(enabledNestedItem)).toEqual({
        action: 'click',
        detail: { label: 'Restart', id: 'restart', position: '3,2', href: '' },
        ...getMetadataContexts(label, 'normal'),
      });
    });
  });
});

describe('Internal Button Dropdown', () => {
  test('does not render "component" metadata', () => {
    const renderResult = render(<InternalButtonDropdown items={items}>Action text</InternalButtonDropdown>);
    const wrapper = createWrapper(renderResult.container).findButtonDropdown()!.findTriggerButton()!;
    expect(getGeneratedAnalyticsMetadata(wrapper.getElement())).toEqual({
      action: 'expand',
      detail: {
        label: 'Action text',
      },
    });
  });
  test('accepts analyticsMetadataTransformer', () => {
    const renderResult = render(
      <InternalButtonDropdown
        analyticsMetadataTransformer={md => {
          delete md!.detail!.id;
          return md;
        }}
        items={items}
      >
        Action text
      </InternalButtonDropdown>
    );
    const wrapper = createWrapper(renderResult.container).findButtonDropdown()!;
    wrapper.openDropdown();
    const enabledSimpleItem = wrapper.findItemById('rm')!.getElement();
    expect(getGeneratedAnalyticsMetadata(enabledSimpleItem)).toEqual({
      action: 'click',
      detail: { label: 'Delete', position: '1', href: '#' },
    });
  });
});
