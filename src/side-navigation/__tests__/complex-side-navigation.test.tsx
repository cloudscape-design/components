// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';
import Badge from '../../../lib/components/badge';
import Popover from '../../../lib/components/popover';
import SideNavigation, { SideNavigationProps } from '../../../lib/components/side-navigation';
import createWrapper from '../../../lib/components/test-utils/dom';
import { SideNavigationItemWrapper } from '../../../lib/components/test-utils/dom/side-navigation';
import '../../__a11y__/to-validate-a11y';

function renderSideNavigation(props: SideNavigationProps = {}) {
  const { container } = render(<SideNavigation {...props} />);
  return createWrapper(container).findSideNavigation()!;
}

it('Side navigation with all possible items', async () => {
  const wrapper = renderSideNavigation({
    items: [
      {
        type: 'link',
        text: 'Page 1',
        href: '#/page1',
        info: <Badge>1</Badge>,
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: 'Section 1',
        items: [
          {
            type: 'link',
            text: 'Page 2',
            href: '#/page2',
            info: (
              <Popover content="very new feature" renderWithPortal={true}>
                new
              </Popover>
            ),
          },
          {
            type: 'link',
            text: 'Page 3',
            href: '#/page3',
            external: true,
            externalIconAriaLabel: 'Opens in a new tab',
          },
          { type: 'divider' },
          {
            type: 'link',
            text: 'Page 4',
            href: '#/page4',
          },
          {
            type: 'link',
            text: 'Page 5',
            href: '#/page5',
          },
        ],
      },
      { type: 'divider' },
      {
        type: 'section-group',
        title: 'Section group 1',
        items: [
          {
            type: 'link',
            text: 'Page 6',
            href: '#/page6',
          },
          {
            type: 'link',
            text: 'Page 7',
            href: '#/page7',
          },
          {
            type: 'section',
            text: 'Section 2',
            items: [
              {
                type: 'link',
                text: 'Page 8',
                href: '#/page8',
              },
              {
                type: 'link',
                text: 'Page 9',
                href: '#/page9',
              },
            ],
          },
          {
            type: 'expandable-link-group',
            text: 'Expandable link group',
            href: '#/exp-link-group',
            defaultExpanded: true,
            items: [
              {
                type: 'link',
                text: 'Page 10',
                href: '#/page10',
              },
              {
                type: 'link',
                text: 'Page 11',
                href: '#/page11',
              },
              { type: 'divider' },
              {
                type: 'link',
                text: 'Page 12',
                href: '#/page12',
              },
              {
                type: 'link',
                text: 'Page 13',
                href: '#/page13',
              },
            ],
          },
        ],
      },
      { type: 'divider' },
      {
        type: 'section-group',
        title: 'Section group 2',
        items: [
          {
            type: 'link',
            text: 'Page 14',
            href: '#/page14',
          },
          {
            type: 'link-group',
            text: 'Link group',
            href: '#/link-group',
            items: [
              {
                type: 'link',
                text: 'Page 15',
                href: '#/page15',
              },
              {
                type: 'link',
                text: 'Page 16',
                href: '#/page16',
              },
              { type: 'divider' },
              {
                type: 'link',
                text: 'Page 17',
                href: '#/page17',
              },
              {
                type: 'link',
                text: 'Page 18',
                href: '#/page18',
              },
            ],
          },
        ],
      },
      { type: 'divider' },
      { type: 'link', text: 'Notifications', href: '#/notifications' },
      {
        type: 'link',
        text: 'External Link',
        href: 'https://aws.amazon.com/',
        external: true,
        externalIconAriaLabel: 'Opens in a new tab',
      },
    ],
  });

  expect(wrapper.findItemByIndex(1)!.findLink()!.getElement()).toHaveTextContent('Page 1');

  expect(wrapper.findItemByIndex(2)!.findDivider()).toBeTruthy();

  // Section 1 with 1 divider
  expect(wrapper.findItemByIndex(3)!.findSectionTitle()!.getElement()).toHaveTextContent('Section 1');
  expect(wrapper.findItemByIndex(3)!.findItemByIndex(1)!.findLink()!.getElement()).toHaveTextContent('Page 2');
  expect(wrapper.findItemByIndex(3)!.findItemByIndex(3)!.findDivider()).toBeTruthy();
  expect(wrapper.findItemByIndex(3)!.findItemByIndex(4)!.findLink()!.getElement()).toHaveTextContent('Page 4');

  expect(wrapper.findItemByIndex(4)!.findDivider()).toBeTruthy();

  // Section group 1
  expect(wrapper.findItemByIndex(5)!.findSectionGroupTitle()!.getElement()).toHaveTextContent('Section group 1');
  expect(wrapper.findItemByIndex(5)!.findItemByIndex(1)!.findLink()!.getElement()).toHaveTextContent('Page 6');
  // Section 2 inside Section group 1
  expect(wrapper.findItemByIndex(5)!.findItemByIndex(3)!.findSectionTitle()!.getElement()).toHaveTextContent(
    'Section 2'
  );
  expect(
    wrapper.findItemByIndex(5)!.findItemByIndex(3)!.findItemByIndex(1)!.findLink()!.getElement()
  ).toHaveTextContent('Page 8');
  // Expandable link group inside Section group 1
  expect(wrapper.findItemByIndex(5)!.findItemByIndex(4)!.findExpandableLinkGroup()).toBeTruthy();
  expect(
    wrapper
      .findItemByIndex(5)!
      .findItemByIndex(4)!
      .findExpandableLinkGroup()!
      .findExpandedContent()!
      .findComponent('ul', SideNavigationItemWrapper)!
      .findItemByIndex(1)!
      .findLink()!
      .getElement()
  ).toHaveTextContent('Page 10');

  expect(wrapper.findItemByIndex(6)!.findDivider()).toBeTruthy();

  // Section group 2
  expect(wrapper.findItemByIndex(7)!.findSectionGroupTitle()!.getElement()).toHaveTextContent('Section group 2');
  expect(wrapper.findItemByIndex(7)!.findItemByIndex(2)!.findLink()!.getElement()).toHaveTextContent('Link group');

  expect(
    wrapper
      .findItemByIndex(7)!
      .findItemByIndex(2)!
      .findComponent('ul', SideNavigationItemWrapper)!
      .findItemByIndex(1)!
      .findLink()!
      .getElement()
  ).toHaveTextContent('Page 15');

  expect(wrapper.findItemByIndex(8)!.findDivider()).toBeTruthy();

  expect(wrapper.findItemByIndex(9)!.findLink()!.getElement()).toHaveTextContent('Notifications');
  await expect(wrapper.getElement()).toValidateA11y();
});
