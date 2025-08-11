// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import {
  activateAnalyticsMetadata,
  GeneratedAnalyticsMetadataFragment,
} from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

import {
  GeneratedAnalyticsMetadataButtonGroupClick,
  GeneratedAnalyticsMetadataButtonGroupCollapse,
  GeneratedAnalyticsMetadataButtonGroupExpand,
} from '../../../lib/components/button-group/analytics-metadata/interfaces.js';
import ButtonGroup, { ButtonGroupProps } from '../../../lib/components/button-group/index.js';
import InternalButtonGroup from '../../../lib/components/button-group/internal.js';
import createWrapper from '../../../lib/components/test-utils/dom/index.js';

const getMenuDropdownItem = (suffix = ''): ButtonGroupProps.MenuDropdown => ({
  type: 'menu-dropdown',
  id: `more-actions${suffix}`,
  text: 'More actions',
  items: [
    { id: `cut${suffix}`, iconName: 'delete-marker', text: 'Cut' },
    { id: `paste${suffix}`, iconName: 'add-plus', text: 'Paste', disabled: true },
    {
      text: 'Misc',
      items: [
        { id: `edit${suffix}`, iconName: 'edit', text: 'Edit' },
        { id: `open${suffix}`, iconName: 'file-open', text: 'Open' },
        { id: `search${suffix}`, iconName: 'search', text: 'Search' },
      ],
    },
  ],
});

const items: ButtonGroupProps['items'] = [
  {
    type: 'icon-button',
    id: 'send',
    iconName: 'send',
    text: 'Send',
  },
  {
    type: 'icon-button',
    id: 'send-disabled',
    iconName: 'send',
    text: 'Send',
    disabled: true,
  },
  {
    type: 'icon-toggle-button',
    id: 'single-like',
    iconName: 'thumbs-up',
    pressedIconName: 'thumbs-up-filled',
    text: 'Like',
    pressed: false,
  },
  {
    type: 'icon-toggle-button',
    id: 'single-like-disabled',
    iconName: 'thumbs-up',
    pressedIconName: 'thumbs-up-filled',
    text: 'Like',
    pressed: false,
    disabled: true,
  },
  {
    type: 'icon-file-input',
    id: 'file-input',
    text: 'Choose files',
  },
  getMenuDropdownItem(),
  { ...getMenuDropdownItem('-disabled'), disabled: true },
  {
    type: 'group',
    text: 'Group',
    items: [
      {
        type: 'icon-button',
        id: 'send-in-group',
        iconName: 'send',
        text: 'Send',
      },
      {
        type: 'icon-toggle-button',
        id: 'single-like-in-group',
        iconName: 'thumbs-up',
        pressedIconName: 'thumbs-up-filled',
        text: 'Like',
        pressed: false,
      },
      getMenuDropdownItem('-in-group'),
    ],
  },
];

function renderButtonGroup(props: Partial<ButtonGroupProps> = {}) {
  const renderResult = render(<ButtonGroup ariaLabel="Button group label" items={items} variant="icon" {...props} />);
  return createWrapper(renderResult.container).findButtonGroup()!;
}

const metadataContexts: GeneratedAnalyticsMetadataFragment = {
  contexts: [
    {
      type: 'component',
      detail: {
        name: 'awsui.ButtonGroup',
        label: 'Button group label',
      },
    },
  ],
};

const getClickEvent = (
  label: string,
  position: string,
  id: string,
  href?: string
): GeneratedAnalyticsMetadataFragment => {
  const clickEvent: GeneratedAnalyticsMetadataButtonGroupClick = {
    action: 'click',
    detail: { label, position, id },
  };
  if (href !== undefined) {
    clickEvent.detail.href = href;
  }
  return {
    ...metadataContexts,
    ...clickEvent,
  };
};

const getExpandEvent = (label: string, position: string, expanded = false): GeneratedAnalyticsMetadataFragment => {
  const expandEvent: GeneratedAnalyticsMetadataButtonGroupExpand | GeneratedAnalyticsMetadataButtonGroupCollapse = {
    action: expanded ? 'collapse' : 'expand',
    detail: { label, position },
  };
  return {
    ...metadataContexts,
    ...expandEvent,
  };
};

beforeAll(() => {
  activateAnalyticsMetadata(true);
});
describe('Button Group renders correct analytics metadata', () => {
  test('for icon-button type', () => {
    const wrapper = renderButtonGroup();
    expect(getGeneratedAnalyticsMetadata(wrapper.findButtonById('send')?.getElement() as HTMLElement)).toEqual(
      getClickEvent('Send', '1', 'send')
    );
    expect(getGeneratedAnalyticsMetadata(wrapper.findButtonById('send-disabled')?.getElement() as HTMLElement)).toEqual(
      metadataContexts
    );
  });
  test('for icon-toggle-button type', () => {
    const wrapper = renderButtonGroup();
    expect(getGeneratedAnalyticsMetadata(wrapper.findButtonById('single-like')?.getElement() as HTMLElement)).toEqual(
      getClickEvent('Like', '3', 'single-like')
    );
    expect(
      getGeneratedAnalyticsMetadata(wrapper.findButtonById('single-like-disabled')?.getElement() as HTMLElement)
    ).toEqual(metadataContexts);
  });
  test('for file-input type', () => {
    const wrapper = renderButtonGroup();
    expect(
      getGeneratedAnalyticsMetadata(wrapper.findButtonById('file-input')?.find('button')?.getElement() as HTMLElement)
    ).toEqual(getClickEvent('Choose files', '5', 'file-input'));
  });
  describe('for menu-dropdown type', () => {
    [true, false].forEach(dropdownExpandToViewport => {
      test(`dropdownExpandToViewport=${dropdownExpandToViewport}`, () => {
        const wrapper = renderButtonGroup({ dropdownExpandToViewport });
        const buttonDropdownWrapper = wrapper.findMenuById('more-actions');
        expect(
          getGeneratedAnalyticsMetadata(buttonDropdownWrapper?.findTriggerButton()?.getElement() as HTMLElement)
        ).toEqual(getExpandEvent('More actions', '6'));
        buttonDropdownWrapper?.openDropdown();
        expect(
          getGeneratedAnalyticsMetadata(buttonDropdownWrapper?.findTriggerButton()?.getElement() as HTMLElement)
        ).toEqual(getExpandEvent('More actions', '6', true));
        expect(
          getGeneratedAnalyticsMetadata(buttonDropdownWrapper?.findItemById('cut')?.getElement() as HTMLElement)
        ).toEqual(getClickEvent('Cut', '6,1', 'cut', ''));
      });
    });

    test('disabled', () => {
      const wrapper = renderButtonGroup();
      expect(
        getGeneratedAnalyticsMetadata(
          wrapper.findMenuById('more-actions-disabled')?.findTriggerButton()?.getElement() as HTMLElement
        )
      ).toEqual(metadataContexts);
    });
  });
  test('for group type', () => {
    const wrapper = renderButtonGroup();

    expect(getGeneratedAnalyticsMetadata(wrapper.findButtonById('send-in-group')?.getElement() as HTMLElement)).toEqual(
      getClickEvent('Send', '8,1', 'send-in-group')
    );

    expect(
      getGeneratedAnalyticsMetadata(wrapper.findButtonById('single-like-in-group')?.getElement() as HTMLElement)
    ).toEqual(getClickEvent('Like', '8,2', 'single-like-in-group'));

    const buttonDropdownWrapper = wrapper.findMenuById('more-actions-in-group');
    expect(
      getGeneratedAnalyticsMetadata(buttonDropdownWrapper?.findTriggerButton()?.getElement() as HTMLElement)
    ).toEqual(getExpandEvent('More actions', '8,3'));
    buttonDropdownWrapper?.openDropdown();
    expect(
      getGeneratedAnalyticsMetadata(buttonDropdownWrapper?.findTriggerButton()?.getElement() as HTMLElement)
    ).toEqual(getExpandEvent('More actions', '8,3', true));
    expect(
      getGeneratedAnalyticsMetadata(buttonDropdownWrapper?.findItemById('cut-in-group')?.getElement() as HTMLElement)
    ).toEqual(getClickEvent('Cut', '8,3,1', 'cut-in-group', ''));
  });
});
describe('Internal Button Group', () => {
  test('does not render "component" metadata', () => {
    const renderResult = render(
      <InternalButtonGroup
        ariaLabel="Button group label"
        items={items}
        variant="icon"
        dropdownExpandToViewport={false}
      />
    );
    const wrapper = createWrapper(renderResult.container).findButtonGroup()!;
    expect(getGeneratedAnalyticsMetadata(wrapper.findButtonById('send')?.getElement() as HTMLElement)).toEqual({
      action: 'click',
      detail: { label: 'Send', position: '1', id: 'send' },
    });
  });
});
